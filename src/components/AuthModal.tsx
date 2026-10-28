"use client";

import React, { useState } from "react";
import { GitHubUser } from "@/types";
import { fetchGitHubUser } from "@/lib/github";
import { LogIn, LogOut, Key, Github, Check, AlertCircle, User, Loader2 } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: GitHubUser | null;
  onLogin: (user: GitHubUser) => void;
  onLogout: () => void;
}

export function AuthModal({ isOpen, onClose, user, onLogin, onLogout }: AuthModalProps) {
  const [tokenInput, setTokenInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) {
      setError("Por favor, cole um GitHub Personal Access Token.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const ghUser = await fetchGitHubUser(tokenInput.trim());
      onLogin(ghUser);
      onClose();
    } catch (err: any) {
      setError(err.message || "Falha na autenticação com o GitHub.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Autenticação GitHub</h3>
              <p className="text-xs text-slate-400">Para colaboradores e publicadores de plugins</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {user ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-12 h-12 rounded-full border border-teal-500/30"
              />
              <div className="overflow-hidden">
                <span className="text-sm font-bold text-white block truncate">{user.name}</span>
                <span className="text-xs font-mono text-teal-400 block">@{user.login}</span>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-slate-400 hover:text-slate-300 underline mt-0.5 block"
                >
                  Ver Perfil no GitHub
                </a>
              </div>
            </div>

            <div className="text-xs text-slate-400 leading-relaxed bg-teal-500/5 p-3 rounded-xl border border-teal-500/10">
              ✅ Você está autenticado como mantenedor/colaborador. Agora você pode cadastrar e inspecionar novas releases de plugins para o catálogo.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
              >
                Continuar
              </button>
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-4 py-2 rounded-xl text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition flex items-center gap-1.5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Desconectar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleAuthenticate} className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              O repositório é hospedado estaticamente no <strong>GitHub Pages</strong>. Para cadastrar ou sincronizar plugins sem necessidade de servidor intermediário, informe um <strong>GitHub Personal Access Token (classic ou fine-grained)</strong> com escopo de leitura de repositórios.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Personal Access Token (PAT)
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  placeholder="ghp_..."
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-teal-500 font-mono"
                />
              </div>
              <span className="text-[10px] text-slate-500 block">
                O token fica gravado apenas no seu navegador (localStorage) e nunca é exposto publicamente.
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <a
                href="https://github.com/settings/tokens/new"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-teal-400 hover:text-teal-300 underline"
              >
                Gerar token no GitHub
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition flex items-center gap-1.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Autenticando...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-3.5 w-3.5" />
                      Entrar
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
