export interface PluginCatalogIndex {
  name: string;
  description?: string;
  url?: string;
  updated_at?: string;
  plugins: PluginCatalogItem[];
}

export interface PluginCatalogItem {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  homepage?: string;
  license?: string;
  download_url: string;
  sha256: string;
  icon_url?: string;
  icon_svg?: string;
  readme_markdown?: string;
  runtime_type: "none" | "wasm" | "container";
  permissions: string[];
  github_repo?: string;
  release_tag?: string;
  stars?: number;
  ui_extensions?: {
    sidebar?: Array<{ id: string; title: string; icon?: string; badge?: string }>;
    dashboard_widgets?: Array<{ id: string; title: string }>;
    server_tabs?: Array<{ id: string; title: string }>;
  };
}

export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  token?: string;
}

export interface PluginSubmission {
  repoUrl: string; // e.g. https://github.com/user/plugin-name
  releaseTag?: string; // optional, defaults to latest release
}
