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
  Tag,
  Star,
  Cpu,
  Layers,
  FileCode,
} from "lucide-react";

interface PluginCardProps {
  plugin: PluginCatalogItem;
  onOpenDetails: (plugin: PluginCatalogItem) => void;
}

export function PluginCard({ plugin, onOpenDetails }: PluginCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyInstallCommand = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(plugin.download_url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onOpenDetails(plugin)}
      className="group relative p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-teal-500/50 transition-all duration-300 shadow-xl hover:shadow-teal-500/10 flex flex-col justify-between cursor-pointer"
    >
      <div className="space-y-3">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-sky-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-base shrink-0 group-hover:scale-105 transition-transform">
              {plugin.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-white group-hover:text-teal-300 transition-colors flex items-center gap-2">
                {plugin.name}
              </h3>
              <span className="text-[11px] font-mono text-slate-400">por {plugin.author}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
              v{plugin.version}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 min-h-[32px]">
          {plugin.description}
        </p>

        {/* Badges / Info */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 flex items-center gap-1">
            <Cpu className="h-3 w-3 text-teal-400" />
            {plugin.runtime_type.toUpperCase()}
          </span>

          {plugin.permissions && plugin.permissions.length > 0 && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-amber-300/90 border border-amber-500/20 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-amber-400" />
              {plugin.permissions.length} perms
            </span>
          )}

          {plugin.license && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
              {plugin.license}
            </span>
          )}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={handleCopyInstallCommand}
          className="text-xs font-mono py-1.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5"
          title="Copiar URL para instalar diretamente no Kraken"
        >
          {isCopied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 text-[11px]">URL Copiada!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[11px]">Copiar URL</span>
            </>
          )}
        </button>

        <a
          href={plugin.download_url}
          download
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-semibold py-1.5 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500 text-teal-300 hover:text-slate-950 border border-teal-500/30 transition flex items-center gap-1.5"
          title="Baixar pacote .zip/.tar.gz"
        >
          <Download className="h-3.5 w-3.5" />
          <span>Baixar</span>
        </a>
      </div>
    </div>
  );
}
