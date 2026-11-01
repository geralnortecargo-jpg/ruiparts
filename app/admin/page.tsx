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
  ChevronRight,
  Clock
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function AdminDashboard() {
  // Estado para controlar o menu ativo na barra vertical
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "produtos" | "destaques" | "utilizadores" | "clientes" | "compras">("dashboard");

  // Dados mock / reais para o painel
  const [appointments, setAppointments] = useState([
    { id: 1, title: "Recepção de Motor 1.9 TDI (Fornecedor A)", date: "Segunda, 09:30", type: "entrada" },
    { id: 2, title: "Envio de Encomenda Oficina Norte", date: "Terça, 14:00", type: "saida" },
    { id: 3, title: "Inventário de Caixas de Velocidades", date: "Quinta, 10:00", type: "interno" },
  ]);

  const [movements, setMovements] = useState([
    { id: "M01", type: "Compra", item: "Alternador BMW E90", price: -120, date: "Hoje, 11:20" },
    { id: "M02", type: "Venda", item: "Ótica LED W205", price: 290, date: "Hoje, 10:05" },
    { id: "M03", type: "Venda", item: "Motor 1.9 TDI BKC", price: 650, date: "Ontem, 16:40" },
  ]);

  // Gestão de Produtos (Exemplo de listagem para o CRUD)
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAdminData() {
      const { data } = await supabase.from("parts").select("*");
      if (data) setProducts(data);
    }
    fetchAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex">
      
      {/* 1. BARRA VERTICAL DE MENUS */}
      <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Logo / Topo */}
          <div className="p-6 border-b border-white/10">
            <h1 className="text-xl font-black tracking-tight text-white">RUIPARTS</h1>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase mt-0.5">
              Painel de Administração
            </p>
          </div>

          {/* Lista de Menus */}
          <nav className="p-4 space-y-1.5 text-xs font-semibold">
            <button
              onClick={() => setActiveMenu("dashboard")}
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

        {/* Voltar ao site */}
        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-white py-2.5 rounded-xl text-xs font-bold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Voltar ao Site
          </Link>
        </div>
      </aside>

      {/* 2. CONTEÚDO PRINCIPAL DO PAINEL */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* Cabeçalho do Painel */}
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

        {/* CONTEÚDO DINAMICO CONSOANTE O MENU SELECIONADO */}

        {/* A. DASHBOARD / CALENDÁRIO E MOVIMENTOS */}
        {activeMenu === "dashboard" && (
          <div className="space-y-8">
            
            {/* Calendário Semanal de Compromissos */}
            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CalendarIcon className="w-5 h-5 text-slate-300" /> Calendário Semanal da Empresa
                </h3>
                <button className="bg-slate-300 hover:bg-white text-slate-950 font-bold px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Novo Compromisso
                </button>
              </div>

              {/* Grelha de Dias da Semana */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {["Segunda", "Terça", "Quarta", "Quinta", "Sexta"].map((dia, index) => (
                  <div key={dia} className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">{dia}</span>
                      {index === 0 && <p className="text-xs text-slate-200 bg-slate-900 p-2 rounded-lg border border-white/5 mb-2">09:30 - Recepção de Motor 1.9 TDI</p>}
                      {index === 1 && <p className="text-xs text-slate-200 bg-slate-900 p-2 rounded-lg border border-white/5 mb-2">14:00 - Envio Oficina Norte</p>}
                      {index === 3 && <p className="text-xs text-slate-200 bg-slate-900 p-2 rounded-lg border border-white/5 mb-2">10:00 - Inventário Caixas</p>}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-4 text-right">Sem compromissos extra</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Peças que Entram e Saem (Compras e Vendas recentes) */}
            <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-slate-300" /> Entradas (Compras) e Saídas (Vendas) Recentes
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-400">
                      <th className="pb-3">Tipo</th>
                      <th className="pb-3">Componente / Peça</th>
                      <th className="pb-3">Data</th>
                      <th className="pb-3 text-right">Valor (€)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {movements.map((mov) => (
                      <tr key={mov.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 font-bold flex items-center gap-1.5">
                          {mov.type === "Compra" ? (
                            <span className="text-red-400 flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5" /> Entrada (Compra)</span>
                          ) : (
                            <span className="text-emerald-400 flex items-center gap-1"><TrendingUp className="w-3.5 h-3.5" /> Saída (Venda)</span>
                          )}
                        </td>
                        <td className="py-3 text-white font-medium">{mov.item}</td>
                        <td className="py-3 text-slate-400">{mov.date}</td>
                        <td className={`py-3 text-right font-extrabold ${mov.price > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {mov.price > 0 ? `+${mov.price} €` : `${mov.price} €`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* B. MENU PRODUTOS (Adicionar, Editar, Apagar) */}
        {activeMenu === "produtos" && (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Gestão de Stock de Peças</h3>
              <button className="bg-slate-300 hover:bg-white text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar Novo Produto
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {products.map((p) => (
                <div key={p.id} className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">OEM: {p.oem}</span>
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <p className="text-xs text-slate-300">{p.brand} - {p.model} • {p.price} €</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1">
                      <Edit className="w-3.5 h-3.5" /> Editar / Alterar
                    </button>
                    <button className="bg-red-500/20 hover:bg-red-500/30 text-red-300 p-2 rounded-xl text-xs font-bold flex items-center gap-1">
                      <Trash2 className="w-3.5 h-3.5" /> Apagar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* C. MENU DESTAQUES */}
        {activeMenu === "destaques" && (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Gestão de Destaques da Página Principal</h3>
              <button className="bg-slate-300 hover:bg-white text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar Destaque
              </button>
            </div>
            <p className="text-xs text-slate-300">Aqui pode gerir, alterar, editar e apagar os componentes em destaque no topo do catálogo.</p>
          </div>
        )}

        {/* D. MENU UTILIZADORES */}
        {activeMenu === "utilizadores" && (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Gestão de Utilizadores do Sistema</h3>
              <button className="bg-slate-300 hover:bg-white text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar Utilizador
              </button>
            </div>
            <p className="text-xs text-slate-300">Adicione, edite, altere permissões ou apague utilizadores com acesso interno.</p>
          </div>
        )}

        {/* E. MENU CLIENTES (ERP / Sage) */}
        {activeMenu === "clientes" && (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white">Fichas de Clientes e Oficinas (Prontas para Sage)</h3>
              <button className="bg-slate-300 hover:bg-white text-slate-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar Cliente
              </button>
            </div>
            <p className="text-xs text-slate-300">Gerencie NIFs, moradas fiscais e códigos postais de 7 dígitos para exportação ERP.</p>
          </div>
        )}

        {/* F. MENU COMPRAS & VENDAS */}
        {activeMenu === "compras" && (
          <div className="bg-slate-900/60 border border-white/10 p-6 rounded-3xl backdrop-blur-xl space-y-6">
            <h3 className="text-lg font-bold text-white">Histórico Completo de Compras e Entradas de Stock</h3>
            <div className="bg-slate-950/80 border border-white/10 p-4 rounded-2xl">
              <p className="text-xs text-slate-300">Registo detalhado de todas as compras efetuadas a sucateiros e fornecedores parceiros.</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}