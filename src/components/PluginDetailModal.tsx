"use client";

import React, { useState } from "react";
import { PluginCatalogItem } from "@/types";
import {
  Download,
  ExternalLink,
  ShieldCheck,
  Check,
  Copy,
  BookOpen,
  Cpu,
  Github,
  Tag,
  Star,
  Layers,
  FileCode,
} from "lucide-react";

interface PluginDetailModalProps {
  plugin: PluginCatalogItem | null;
  onClose: () => void;
}

export function PluginDetailModal({ plugin, onClose }: PluginDetailModalProps) {
  const [isCopied, setIsCopied] = useState(false);

  if (!plugin) return null;

  const handleCopyInstallCommand = () => {
    navigator.clipboard.writeText(plugin.download_url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500/20 to-sky-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xl">
              {plugin.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">{plugin.name}</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                  v{plugin.version}
                </span>
                {plugin.release_tag && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {plugin.release_tag}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Desenvolvido por <strong className="text-slate-300">{plugin.author}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Description & Overview */}
        <div className="space-y-4">
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            {plugin.description}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">Identificador (ID)</span>
              <span className="font-mono text-slate-200 truncate block text-[11px]">{plugin.id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Runtime Backend</span>
              <span className="font-mono text-teal-400 uppercase font-semibold block text-[11px]">
                {plugin.runtime_type}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Licença</span>
              <span className="text-slate-200 block text-[11px]">{plugin.license || "Não especificada"}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Checksum SHA-256</span>
              <span className="font-mono text-slate-400 truncate block text-[11px]" title={plugin.sha256}>
                {plugin.sha256.substring(0, 12)}...
              </span>
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-amber-400" />
              Permissões Solicitadas:
            </span>
            <div className="flex flex-wrap gap-2">
              {plugin.permissions && plugin.permissions.length > 0 ? (
                plugin.permissions.map((perm) => (
                  <span
                    key={perm}
                    className="text-xs font-mono px-2.5 py-1 rounded-lg bg-slate-950 text-amber-300 border border-amber-500/20"
                  >
                    {perm}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-500">Nenhuma permissão especial necessária.</span>
              )}
            </div>
          </div>

          {/* Readme Section */}
          {plugin.readme_markdown && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-teal-400" />
                Documentação do Plugin:
              </span>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 max-h-60 overflow-y-auto text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed">
                {plugin.readme_markdown}
              </div>
            </div>
          )}

          {/* Installation Instructions in Kraken */}
          <div className="p-4 rounded-xl bg-teal-500/5 border border-teal-500/20 space-y-2.5">
            <span className="text-xs font-bold text-teal-300 block">
              Como instalar este plugin no Kraken Admin Tool:
            </span>
            <ol className="text-xs text-slate-300 space-y-1 list-decimal list-inside leading-relaxed">
              <li>
                Copie a URL de download abaixo ou baixe o arquivo <code>.zip</code>.
              </li>
              <li>
                No Kraken Admin Tool, navegue até <strong>Plugins & Store &gt; Instalação Direta</strong>.
              </li>
              <li>
                Cole a URL no campo de instalação ou envie o arquivo compactado.
              </li>
            </ol>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                readOnly
                value={plugin.download_url}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 font-mono"
              />
              <button
                onClick={handleCopyInstallCommand}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs transition flex items-center gap-1 shrink-0"
              >
                {isCopied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {isCopied ? "Copiado!" : "Copiar"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {plugin.homepage && (
              <a
                href={plugin.homepage}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                <Github className="h-3.5 w-3.5" />
                Repositório
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl transition"
            >
              Fechar
            </button>
            <a
              href={plugin.download_url}
              download
              className="px-5 py-2 text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-xl transition flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" />
              Baixar Release
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
