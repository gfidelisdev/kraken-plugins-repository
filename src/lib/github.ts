import { PluginCatalogItem, GitHubUser } from "@/types";
import { parseGitHubRepoUrl } from "./utils";

export interface GitHubRepoDetails {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage: string;
  license: string;
  download_url: string;
  sha256: string;
  runtime_type: "none" | "wasm" | "container";
  permissions: string[];
  readme_markdown: string;
  github_repo: string;
  release_tag: string;
  stars: number;
}

// Fetch GitHub user profile using Personal Access Token
export async function fetchGitHubUser(token: string): Promise<GitHubUser> {
  const res = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!res.ok) {
    throw new Error(`Token inválido ou expirado (${res.status})`);
  }

  const data = await res.json();
  return {
    login: data.login,
    name: data.name || data.login,
    avatar_url: data.avatar_url,
    html_url: data.html_url,
    token,
  };
}

// Fetch plugin specifications directly from the GitHub repository and its releases
export async function inspectGitHubPluginRepo(
  repoUrl: string,
  token?: string
): Promise<GitHubRepoDetails> {
  const parsed = parseGitHubRepoUrl(repoUrl);
  if (!parsed) {
    throw new Error("URL do GitHub inválida. Exemplo esperado: https://github.com/usuario/meu-plugin");
  }

  const { owner, repo } = parsed;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 1. Get repository metadata
  const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });
  if (!repoRes.ok) {
    if (repoRes.status === 404) {
      throw new Error(`Repositório ${owner}/${repo} não encontrado ou é privado.`);
    }
    throw new Error(`Erro ao acessar GitHub API: ${repoRes.statusText}`);
  }
  const repoData = await repoRes.json();
  const defaultBranch = repoData.default_branch || "main";

  // 2. Fetch plugin.json from default branch or raw URL
  let manifestData: any = null;
  const manifestRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/plugin.json`;
  const manifestRes = await fetch(manifestRawUrl);
  if (manifestRes.ok) {
    try {
      manifestData = await manifestRes.json();
    } catch {
      throw new Error("O arquivo 'plugin.json' no repositório não é um JSON válido.");
    }
  } else {
    // Try via API contents
    const apiManifestRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/plugin.json`,
      { headers }
    );
    if (apiManifestRes.ok) {
      const contentObj = await apiManifestRes.json();
      if (contentObj.content) {
        const decoded = atob(contentObj.content.replace(/\n/g, ""));
        manifestData = JSON.parse(decoded);
      }
    }
  }

  if (!manifestData) {
    throw new Error(
      `O repositório ${owner}/${repo} não possui o arquivo obrigatório 'plugin.json' na raiz.`
    );
  }

  // 3. Fetch README.md
  let readme = "";
  const readmeRawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${defaultBranch}/README.md`;
  const readmeRes = await fetch(readmeRawUrl);
  if (readmeRes.ok) {
    readme = await readmeRes.text();
  }

  // 4. Fetch Releases to obtain download URL and checksum
  let downloadUrl = "";
  let releaseTag = manifestData.version ? `v${manifestData.version}` : "latest";
  let sha256 = "";

  const releasesRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
    { headers }
  );
  if (releasesRes.ok) {
    const releaseData = await releasesRes.json();
    releaseTag = releaseData.tag_name || releaseTag;

    // Look for .zip or .tar.gz asset
    if (Array.isArray(releaseData.assets) && releaseData.assets.length > 0) {
      const archiveAsset = releaseData.assets.find(
        (a: any) =>
          a.name.endsWith(".zip") ||
          a.name.endsWith(".tar.gz") ||
          a.name.endsWith(".tgz")
      );
      if (archiveAsset) {
        downloadUrl = archiveAsset.browser_download_url;
      }

      // Check for sha256 checksum file
      const checksumAsset = releaseData.assets.find(
        (a: any) =>
          a.name.endsWith(".sha256") ||
          a.name.endsWith(".sha256sum") ||
          a.name.endsWith(".sig")
      );
      if (checksumAsset) {
        // Can optionally read checksum
      }
    }

    if (!downloadUrl && releaseData.zipball_url) {
      downloadUrl = releaseData.zipball_url;
    }
  }

  if (!downloadUrl) {
    // Fallback to archive zip of branch
    downloadUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`;
  }

  return {
    id: manifestData.id || `${owner}.${repo}`,
    name: manifestData.name || repoData.name,
    version: manifestData.version || "1.0.0",
    description: manifestData.description || repoData.description || "",
    author: manifestData.author || owner,
    homepage: manifestData.homepage || repoData.html_url,
    license: manifestData.license || (repoData.license?.spdx_id || "Apache-2.0"),
    download_url: downloadUrl,
    sha256: sha256 || "auto-verify",
    runtime_type: manifestData.runtime?.type || "none",
    permissions: Array.isArray(manifestData.permissions) ? manifestData.permissions : [],
    readme_markdown: readme || `# ${manifestData.name}\n\n${manifestData.description}`,
    github_repo: `${owner}/${repo}`,
    release_tag: releaseTag,
    stars: repoData.stargazers_count || 0,
  };
}
