"use client";

import { useState } from "react";
import { PackageCheck, Menu, X, Phone, History, Home, UserPlus } from "lucide-react";
import Link from "next/link";

export default function RuipartsNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <Link href="/" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Home className="w-4 h-4 text-slate-300" /> Início
          </Link>
          <a href="/#historia" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <History className="w-4 h-4 text-slate-300" /> História
          </a>
          <a href="/#contactos" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Phone className="w-4 h-4 text-slate-300" /> Contactos
          </a>
          <Link href="/registo" className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors font-bold bg-slate-900/90 border border-white/15 px-3 py-1.5 rounded-xl text-xs">
            <UserPlus className="w-3.5 h-3.5 text-slate-300" /> Registar Conta
          </Link>
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
          <Link
            href="/registo"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 text-sm font-bold text-slate-950 bg-slate-300 py-2.5 px-3 rounded-xl justify-center"
          >
            <UserPlus className="w-4 h-4" /> Criar Conta / Registo
          </Link>
        </div>
      )}
    </header>
  );
}