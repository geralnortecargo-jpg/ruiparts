"use client";

import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Package, 
  Star, 
  Users, 
  UserCheck, 
  ShoppingCart, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Edit, 
  Trash2, 
  LogOut,
  X
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import ProductForm from "@/components/ProductForm";

export default function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "produtos" | "destaques" | "utilizadores" | "clientes" | "compras">("dashboard");
  const [showProductForm, setShowProductForm] = useState(false);

  const [products, setProducts] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAdminData() {
      // 1. Buscar produtos
      const { data: prodData } = await supabase.from("products").select("*");
      if (prodData) setProducts(prodData);

      // 2. Buscar marcas do Supabase
      const { data: brandData } = await supabase.from("brands").select("*").order("name");
      if (brandData && brandData.length > 0) {
        setBrands(brandData);
      } else {
        // Fallback de segurança local se a tabela estiver vazia ou com falha de rede
        setBrands([
          { id: '1', name: 'BMW' },
          { id: '2', name: 'Mercedes-Benz' },
          { id: '3', name: 'Audi' },
          { id: '4', name: 'Volkswagen' },
          { id: '5', name: 'Opel' },
          { id: '6', name: 'Ford' },
          { id: '7', name: 'Renault' },
          { id: '8', name: 'Peugeot' }
        ]);
      }

      // 3. Buscar categorias do Supabase
      const { data: catData } = await supabase.from("categories").select("*").order("name");
      if (catData && catData.length > 0) {
        setCategories(catData);
      } else {
        // Fallback de segurança local
        setCategories([
          { id: '1', name: 'Motor e Componentes' },
          { id: '2', name: 'Carroçaria e Exterior' },
          { id: '3', name: 'Suspensão e Direção' },
          { id: '4', name: 'Sistema Elétrico' },
          { id: '5', name: 'Interior' }
        ]);
      }
    }
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
      
      {/* BARRA VERTICAL DE MENUS */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-black tracking-tight text-white">RUIPARTS</h1>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase mt-0.5">
              Painel de Administração
            </p>
          </div>

          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => { setActiveMenu("dashboard"); setShowProductForm(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === "dashboard" ? "bg-slate-300 text-slate-950 font-extrabold shadow" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <CalendarIcon className="w-4 h-4" /> Visão Geral & Calendário
            </button>

            <button
              onClick={() => setActiveMenu("produtos")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === "produtos" ? "bg-slate-300 text-slate-950 font-extrabold shadow" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <Package className="w-4 h-4" /> Produtos (Stock)
            </button>

            <button
              onClick={() => setActiveMenu("destaques")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === "destaques" ? "bg-slate-300 text-slate-950 font-extrabold shadow" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <Star className="w-4 h-4" /> Destaques
            </button>

            <button
              onClick={() => setActiveMenu("utilizadores")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === "utilizadores" ? "bg-slate-300 text-slate-950 font-extrabold shadow" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <Users className="w-4 h-4" /> Utilizadores
            </button>

            <button
              onClick={() => setActiveMenu("clientes")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === "clientes" ? "bg-slate-300 text-slate-950 font-extrabold shadow" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <UserCheck className="w-4 h-4" /> Clientes (ERP/Sage)
            </button>

            <button
              onClick={() => setActiveMenu("compras")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeMenu === "compras" ? "bg-slate-300 text-slate-950 font-extrabold shadow" : "text-slate-300 hover:bg-white/5"
              }`}
            >
              <ShoppingCart className="w-4 h-4" /> Compras & Vendas
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Voltar ao Site
          </Link>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        <header className="flex justify-between items-center mb-8 bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
          <div>
            <span className="bg-slate-300 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
              Gestão ERP & Operações
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1 capitalize">
              {activeMenu === "dashboard" ? "Painel Principal & Calendário" : activeMenu}
            </h2>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-400 block">Sessão Ativa</span>
            <span className="text-xs font-bold text-emerald-400">Administrador Ruiparts</span>
          </div>
        </header>

        {/* DASHBOARD */}
        {activeMenu === "dashboard" && (
          <div className="space-y-8">
            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4">Visão Geral da Operação</h3>
              <p className="text-xs text-slate-300">Selecione uma opção no menu lateral para gerir o stock, clientes ou destaques da Ruiparts.</p>
            </div>
          </div>
        )}

        {/* PRODUTOS COM FORMULÁRIO INTEGRADO */}
        {activeMenu === "produtos" && (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Gestão de Stock de Peças</h3>
              
              <button 
                onClick={() => setShowProductForm(!showProductForm)}
                className="bg-slate-300 hover:bg-white text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer"
              >
                {showProductForm ? (
                  <>
                    <X className="w-4 h-4" /> Fechar Formulário
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Adicionar Novo Produto
                  </>
                )}
              </button>
            </div>

            {/* FORMULÁRIO COM PASSAGEM DE MARCAS E CATEGORIAS */}
            {showProductForm && (
              <div className="mb-6 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <ProductForm 
                  initialBrands={brands} 
                  initialCategories={categories} 
                />
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {products.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">Nenhum produto registado na base de dados.</p>
              ) : (
                products.map((p) => (
                  <div key={p.id} className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono">OEM: {p.reference_oem || p.oem || "N/A"}</span>
                      <h4 className="text-sm font-bold text-white">{p.title || p.name}</h4>
                      <p className="text-xs text-slate-300">{p.model} — {p.price} €</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1">
                        <Edit className="w-3.5 h-3.5" /> Editar
                      </button>
                      <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-xl text-xs font-bold flex items-center gap-1">
                        <Trash2 className="w-3.5 h-3.5" /> Apagar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* OUTROS MENUS */}
        {activeMenu === "destaques" && (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white">Gestão de Destaques</h3>
          </div>
        )}

        {activeMenu === "utilizadores" && (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white">Gestão de Utilizadores</h3>
          </div>
        )}

        {activeMenu === "clientes" && (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white">Fichas de Clientes (Sage)</h3>
          </div>
        )}

        {activeMenu === "compras" && (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white">Histórico de Compras e Vendas</h3>
          </div>
        )}

      </main>
    </div>
  );
}