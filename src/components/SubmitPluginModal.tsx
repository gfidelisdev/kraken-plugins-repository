"use client";

import React, { useState } from "react";
import { GitHubUser, PluginCatalogItem } from "@/types";
import { inspectGitHubPluginRepo, GitHubRepoDetails } from "@/lib/github";
import { saveCustomPlugin } from "@/lib/catalog";
import {
  Plus,
  Github,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCode,
  ShieldCheck,
  Download,
  Loader2,
  Tag,
  Star,
  ExternalLink,
} from "lucide-react";

interface SubmitPluginModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: GitHubUser | null;
  onPluginAdded: (plugin: PluginCatalogItem) => void;
  onRequireLogin: () => void;
}

export function SubmitPluginModal({
  isOpen,
  onClose,
  user,
  onPluginAdded,
  onRequireLogin,
}: SubmitPluginModalProps) {
  const [repoUrl, setRepoUrl] = useState("");
  const [isInspecting, setIsInspecting] = useState(false);
  const [inspectedPlugin, setInspectedPlugin] = useState<GitHubRepoDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl.trim()) {
      setError("Informe a URL do repositório no GitHub.");
      return;
    }

    setIsInspecting(true);
    setError(null);
    setInspectedPlugin(null);
    setSuccessMessage(null);

    try {
      const details = await inspectGitHubPluginRepo(repoUrl.trim(), user?.token);
      setInspectedPlugin(details);
    } catch (err: any) {
      setError(err.message || "Falha ao inspecionar repositório do plugin.");
    } finally {
      setIsInspecting(false);
    }
  };

  const handleConfirmPublish = () => {
    if (!inspectedPlugin) return;

    const catalogItem: PluginCatalogItem = {
      id: inspectedPlugin.id,
      name: inspectedPlugin.name,
      version: inspectedPlugin.version,
      description: inspectedPlugin.description,
      author: inspectedPlugin.author,
      homepage: inspectedPlugin.homepage,
      license: inspectedPlugin.license,
      download_url: inspectedPlugin.download_url,
      sha256: inspectedPlugin.sha256,
      runtime_type: inspectedPlugin.runtime_type,
      permissions: inspectedPlugin.permissions,
      readme_markdown: inspectedPlugin.readme_markdown,
      github_repo: inspectedPlugin.github_repo,
      release_tag: inspectedPlugin.release_tag,
      stars: inspectedPlugin.stars,
    };

    saveCustomPlugin(catalogItem);
    onPluginAdded(catalogItem);
    setSuccessMessage(`Plugin "${inspectedPlugin.name}" adicionado com sucesso ao catálogo!`);
    setTimeout(() => {
      onClose();
      setInspectedPlugin(null);
      setRepoUrl("");
      setSuccessMessage(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Publicar Novo Plugin</h3>
              <p className="text-xs text-slate-400">
                Insira o link do repositório GitHub para ler automaticamente as especificações e releases
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Step 1: Input GitHub URL */}
        <form onSubmit={handleInspect} className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">
              URL do Repositório do Plugin no GitHub
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Github className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="url"
                  placeholder="https://github.com/usuario/meu-plugin-kraken"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                disabled={isInspecting}
                className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs transition flex items-center gap-1.5 shrink-0"
              >
                {isInspecting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Buscando...
                  </>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" />
                    Inspecionar
                  </>
                )}
              </button>
            </div>
            <span className="text-[11px] text-slate-500 block">
              O sistema lerá o <code>plugin.json</code> da raiz e buscará a última release com o pacote <code>.zip</code> ou <code>.tar.gz</code>.
            </span>
          </div>
        </form>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
            <div>
              <span className="font-semibold block">Erro na inspeção do repositório:</span>
              <p className="text-[11px] text-rose-300/80 mt-0.5 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Step 2: Inspection Result Preview */}
        {inspectedPlugin && (
          <div className="p-5 rounded-xl bg-slate-950 border border-teal-500/30 space-y-4 animate-in fade-in">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-white">{inspectedPlugin.name}</h4>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    v{inspectedPlugin.version}
                  </span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <Tag className="h-3 w-3 text-slate-400" />
                    {inspectedPlugin.release_tag}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{inspectedPlugin.description}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                <Star className="h-3.5 w-3.5 fill-amber-400" />
                {inspectedPlugin.stars}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">ID do Plugin</span>
                <span className="font-mono text-slate-200 truncate block">{inspectedPlugin.id}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Autor</span>
                <span className="text-slate-200 truncate block">{inspectedPlugin.author}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Runtime</span>
                <span className="font-mono text-teal-400 uppercase font-semibold block">
                  {inspectedPlugin.runtime_type}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Licença</span>
                <span className="text-slate-200 block">{inspectedPlugin.license}</span>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300 block">
                Permissões Solicitadas:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {inspectedPlugin.permissions.length > 0 ? (
                  inspectedPlugin.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 border border-amber-500/20"
                    >
                      {perm}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-500">Nenhuma permissão especial</span>
                )}
              </div>
            </div>

            {/* Download Link */}
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs flex items-center justify-between">
              <div className="overflow-hidden">
                <span className="text-[10px] text-slate-500 block">Arquivo de Release / Download</span>
                <span className="font-mono text-slate-300 truncate block text-[11px]">
                  {inspectedPlugin.download_url}
                </span>
              </div>
              <a
                href={inspectedPlugin.download_url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition shrink-0 ml-2"
                title="Testar link de download"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setInspectedPlugin(null)}
                className="px-4 py-2 text-xs font-medium border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="px-5 py-2 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
              >
                <ShieldCheck className="h-4 w-4" />
                Confirmar e Adicionar ao Catálogo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
