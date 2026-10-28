"use client";

import React, { useState, useEffect, useMemo } from "react";
import { PluginCatalogItem, GitHubUser } from "@/types";
import { loadCatalogPlugins } from "@/lib/catalog";
import { PluginCard } from "@/components/PluginCard";
import { PluginDetailModal } from "@/components/PluginDetailModal";
import { AuthModal } from "@/components/AuthModal";
import { SubmitPluginModal } from "@/components/SubmitPluginModal";
import {
  Search,
  Plus,
  Github,
  LogIn,
  User,
  ExternalLink,
  ShieldCheck,
  Cpu,
  Layers,
  BookOpen,
  Package,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Terminal,
} from "lucide-react";

export default function Home() {
  const [plugins, setPlugins] = useState<PluginCatalogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRuntime, setSelectedRuntime] = useState<string>("all");
  const [selectedPlugin, setSelectedPlugin] = useState<PluginCatalogItem | null>(null);

  // Auth & Submission modals
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<GitHubUser | null>(null);
  const [isCatalogUrlCopied, setIsCatalogUrlCopied] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("kraken_gh_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }

    // Load initial plugins
    loadCatalogPlugins().then(setPlugins);
  }, []);

  const handleLogin = (user: GitHubUser) => {
    setCurrentUser(user);
    localStorage.setItem("kraken_gh_user", JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("kraken_gh_user");
  };

  const handlePluginAdded = (newPlugin: PluginCatalogItem) => {
    setPlugins((prev) => {
      const exists = prev.some((p) => p.id === newPlugin.id);
      if (exists) {
        return prev.map((p) => (p.id === newPlugin.id ? newPlugin : p));
      }
      return [newPlugin, ...prev];
    });
  };

  const filteredPlugins = useMemo(() => {
    return plugins.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRuntime =
        selectedRuntime === "all" || p.runtime_type === selectedRuntime;

      return matchesSearch && matchesRuntime;
    });
  }, [plugins, searchQuery, selectedRuntime]);

  const handleCopyCatalogURL = () => {
    const catalogUrl = typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname.replace(/\/+$/, "")}/index.json`
      : "https://gfidelis.github.io/kraken-plugins-repository/index.json";

    navigator.clipboard.writeText(catalogUrl);
    setIsCatalogUrlCopied(true);
    setTimeout(() => setIsCatalogUrlCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-sky-500 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-teal-500/20">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">Kraken</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 font-bold">
                  Plugins Store
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">Repositório Oficial do Kraken Admin Tool</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyCatalogURL}
              className="px-3 py-1.5 rounded-xl text-xs font-mono border border-slate-800 hover:border-teal-500/40 bg-slate-900 text-slate-300 hover:text-white transition flex items-center gap-1.5"
              title="Copiar URL deste catálogo index.json para adicionar no Kraken"
            >
              {isCatalogUrlCopied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">URL do Catálogo Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-400" />
                  <span className="hidden md:inline">Adicionar Catálogo no Kraken</span>
                  <span className="md:hidden">Catálogo</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsSubmitOpen(true)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition flex items-center gap-1.5 shadow-lg shadow-teal-500/20"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Publicar Plugin</span>
            </button>

            <button
              onClick={() => setIsAuthOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-medium border border-slate-800 hover:bg-slate-900 text-slate-300 transition flex items-center gap-2"
            >
              {currentUser ? (
                <>
                  <img
                    src={currentUser.avatar_url}
                    alt={currentUser.name}
                    className="w-5 h-5 rounded-full border border-teal-500/40"
                  />
                  <span className="hidden sm:inline font-mono text-[11px]">@{currentUser.login}</span>
                </>
              ) : (
                <>
                  <Github className="h-4 w-4" />
                  <span className="hidden sm:inline">Entrar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950 py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Catálogo Oficial de Plugins do Kraken Admin Tool
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Descubra, instale e compartilhe <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-sky-400">
              extensões seguras para o Kraken
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed">
            Plugins isolados via Web Worker e WebAssembly (WASI) com suporte a Auto-Build e atuação real em servidores remotos. Hospedado diretamente no GitHub Pages.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto pt-4">
            <div className="relative">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Buscar plugins por nome, autor, descrição ou ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6 w-full">
        {/* Filters and Counters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              {filteredPlugins.length} {filteredPlugins.length === 1 ? "plugin disponível" : "plugins disponíveis"}
            </span>
          </div>

          {/* Runtime filter tags */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "all", label: "Todos os Runtimes" },
              { id: "wasm", label: "WASM / Go" },
              { id: "none", label: "Apenas Frontend (UI)" },
              { id: "container", label: "Container" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedRuntime(tab.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-xl transition shrink-0 ${
                  selectedRuntime === tab.id
                    ? "bg-teal-500 text-slate-950 font-bold"
                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Plugin Grid */}
        {filteredPlugins.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlugins.map((plugin) => (
              <PluginCard
                key={plugin.id}
                plugin={plugin}
                onOpenDetails={(p) => setSelectedPlugin(p)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
            <Package className="h-10 w-10 text-slate-600 mx-auto" />
            <h4 className="text-base font-bold text-white">Nenhum plugin encontrado</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Nenhum plugin corresponde aos filtros de busca atuais. Tente outros termos ou publique uma nova extensão.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 text-center text-xs text-slate-500 space-y-2">
        <p>Kraken Plugins Repository — Repositório Oficial e Comunitário para o Kraken Admin Tool</p>
        <p className="font-mono text-[11px] text-slate-600">
          Totalmente compatível com o Kraken Admin Tool Catalog Specification (index.json)
        </p>
      </footer>

      {/* Modals */}
      <PluginDetailModal
        plugin={selectedPlugin}
        onClose={() => setSelectedPlugin(null)}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <SubmitPluginModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        user={currentUser}
        onPluginAdded={handlePluginAdded}
        onRequireLogin={() => {
          setIsSubmitOpen(false);
          setIsAuthOpen(true);
        }}
      />
    </div>
  );
}
