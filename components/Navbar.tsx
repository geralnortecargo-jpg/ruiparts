"use client";

import { useState, useEffect } from "react";
import { PackageCheck, Menu, X, Phone, History, Home, UserPlus, User, LogOut, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RuipartsNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    // 1. Verificar sessão ativa ao carregar
    async function checkUserSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
      }
    }
    checkUserSession();

    // 2. Ouvir alterações de autenticação (Login / Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Função para fazer Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        setShowLoginModal(false);
        window.location.href = "/dashboard";
      }
    } catch (err: any) {
      console.error("Erro no login:", err);
      setLoginError(err.message || "Erro ao iniciar sessão. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <>
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          
          {/* Logótipo & Nome */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-slate-300 text-slate-950 p-2 rounded-xl font-black text-xl tracking-wider shadow group-hover:bg-white transition-colors">
              RP
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white leading-none">
                RUIPARTS
              </h1>
              <p className="text-[10px] text-slate-300 font-semibold tracking-widest uppercase mt-0.5">
                Peças de Sucata & Autos
              </p>
            </div>
          </Link>

          {/* Links de Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <Link href="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Home className="w-4 h-4 text-slate-300" /> Início
            </Link>
            <a href="/#historia" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <History className="w-4 h-4 text-slate-300" /> História
            </a>
            <a href="/#contactos" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-4 h-4 text-slate-300" /> Contactos
            </a>

            {currentUser ? (
              <div className="flex items-center gap-3">
                <Link 
                  href="/dashboard"
                  className="bg-slate-900 border border-white/15 hover:border-slate-300 text-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow"
                >
                  <User className="w-3.5 h-3.5 text-slate-300" /> O Meu Painel
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 p-1.5 transition-colors"
                  title="Terminar Sessão"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-slate-200 hover:text-white text-xs font-bold transition-colors"
                >
                  Entrar
                </button>
                <Link 
                  href="/registo" 
                  className="flex items-center gap-1.5 text-slate-950 hover:bg-white transition-colors font-bold bg-slate-200 px-3.5 py-1.5 rounded-xl text-xs shadow"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Registar Conta
                </Link>
              </div>
            )}
          </nav>

          {/* Informação de Stock & Botão Mobile */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 text-slate-200 text-xs font-bold bg-slate-900/90 px-3.5 py-2 rounded-full border border-white/15">
              <PackageCheck className="w-4 h-4 text-slate-300" /> +5.000 Peças em Stock
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-slate-300 hover:text-white p-2"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile Desdobrável */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-white/10 px-4 py-6 space-y-4">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 text-sm font-semibold text-slate-200 hover:text-white py-2 border-b border-white/10"
            >
              <Home className="w-4 h-4 text-slate-300" /> Início
            </Link>
            <a
              href="/#historia"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 text-sm font-semibold text-slate-200 hover:text-white py-2 border-b border-white/10"
            >
              <History className="w-4 h-4 text-slate-300" /> História
            </a>
            <a
              href="/#contactos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 text-sm font-semibold text-slate-200 hover:text-white py-2 border-b border-white/10"
            >
              <Phone className="w-4 h-4 text-slate-300" /> Contactos
            </a>

            {currentUser ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-sm font-bold text-slate-950 bg-slate-300 py-2.5 px-3 rounded-xl justify-center"
                >
                  <User className="w-4 h-4" /> O Meu Painel (/dashboard)
                </Link>
                <button
                  onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                  className="w-full flex items-center justify-center gap-2 text-sm font-bold text-red-400 bg-red-500/10 border border-red-500/20 py-2.5 px-3 rounded-xl"
                >
                  <LogOut className="w-4 h-4" /> Terminar Sessão
                </button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => { setMobileMenuOpen(false); setShowLoginModal(true); }}
                  className="w-full text-center text-sm font-bold text-white bg-slate-900 border border-white/15 py-2.5 rounded-xl"
                >
                  Iniciar Sessão
                </button>
                <Link
                  href="/registo"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 text-sm font-bold text-slate-950 bg-slate-300 py-2.5 px-3 rounded-xl justify-center"
                >
                  <UserPlus className="w-4 h-4" /> Criar Conta / Registo
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* MODAL DE LOGIN RÁPIDO */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/20 p-6 md:p-8 rounded-3xl max-w-md w-full shadow-2xl relative space-y-6">
            <button 
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="bg-slate-300 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">
                Área Reservada
              </span>
              <h3 className="text-xl font-black text-white mt-2">Iniciar Sessão na Ruiparts</h3>
              <p className="text-xs text-slate-400 mt-1">Insira as suas credenciais para aceder ao seu dashboard.</p>
            </div>

            {loginError && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs p-3 rounded-xl">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs text-slate-300 block mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="email"
                    required
                    placeholder="exemplo@oficina.pt"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">Palavra-passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-200 hover:bg-white text-slate-950 font-extrabold py-3 rounded-xl text-xs transition-all shadow-lg"
              >
                {loading ? "A entrar..." : "Entrar no Dashboard"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}