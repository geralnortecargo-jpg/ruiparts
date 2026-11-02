"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import RuipartsNavbar from "@/components/Navbar";
import Link from "next/link";
import { 
  Package, 
  Search, 
  FileText, 
  Download, 
  Truck, 
  Store, 
  Clock, 
  User, 
  Building, 
  ShieldCheck, 
  ArrowRight,
  ExternalLink
} from "lucide-react";

export default function ClientDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);

      // 1. Obter Sessão Ativa
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        window.location.href = "/";
        return;
      }

      const user = session.user;
      setCurrentUser(user);

      // 2. Procurar Perfil do Utilizador (Cliente ou Oficina)
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // 3. Procurar Encomendas do Utilizador
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!ordersError && ordersData) {
        setOrders(ordersData);
      }

      setLoading(false);
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400">A carregar o teu painel...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans relative">
      {/* Imagem de Fundo */}
      <div 
        className="fixed inset-0 z-0 bg-no-repeat bg-top opacity-30 pointer-events-none"
        style={{ 
          backgroundImage: `url('/ruiparts-bg.jpg')`,
          backgroundSize: '70% auto' 
        }}
      >
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]"></div>
      </div>

      <div className="relative z-10">
        <RuipartsNavbar />

        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          
          {/* BANNER PRINCIPAL DO CLIENTE / OFICINA */}
          <div className="bg-slate-900/80 border border-white/15 p-6 md:p-8 rounded-3xl backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-300 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                  {profile?.role === "workshop" ? "Conta Oficina Parceira" : "Área de Cliente"}
                </span>
                {profile?.role === "workshop" && (
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <Building className="w-3 h-3" /> Oficina Verificada
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-white">
                Olá, {profile?.full_name || currentUser?.email?.split('@')[0]}
              </h1>
              <p className="text-xs md:text-sm text-slate-400 max-w-xl">
                Acede ao teu histórico de peças, descarrega faturas e acompanha o estado das tuas encomendas em tempo real.
              </p>
            </div>

            {/* BOTÃO RÁPIDO PARA COMPRAR NOVA PEÇA */}
            <Link 
              href="/"
              className="bg-slate-200 hover:bg-white text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl text-xs transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95"
            >
              <Search className="w-4 h-4" /> Comprar / Pesquisar Nova Peça <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* GRELHA COM AS 2 SECÇÕES PRINCIPAIS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUNA ESQUERDA (2/3): HISTÓRICO DE COMPRAS & PEÇAS */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-slate-300" /> Últimas Compras & Encomendas ({orders.length})
                </h2>
              </div>

              {orders.length === 0 ? (
                <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-10 text-center space-y-4">
                  <Package className="w-12 h-12 text-slate-500 mx-auto" />
                  <p className="text-slate-400 text-sm">Ainda não efetuaste nenhuma compra no nosso catálogo.</p>
                  <Link 
                    href="/"
                    className="inline-block bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
                  >
                    Explorar Peças Disponíveis
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div 
                      key={order.id} 
                      className="bg-slate-900/80 border border-white/15 rounded-2xl p-5 md:p-6 shadow-xl backdrop-blur-md space-y-4 hover:border-slate-300/30 transition-all"
                    >
                      {/* Topo da Encomenda */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-4 gap-2">
                        <div>
                          <span className="text-xs font-mono text-slate-400">ID Encomenda: #{order.id.slice(0, 8)}</span>
                          <div className="text-xs text-slate-300 flex items-center gap-2 mt-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> 
                            {new Date(order.created_at).toLocaleDateString("pt-PT")}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-xl border border-emerald-500/30">
                            {order.status || "Pago / MB WAY Iniciado"}
                          </span>
                          <span className="text-lg font-black text-white">{order.total_price} €</span>
                        </div>
                      </div>

                      {/* Lista de Peças Incluídas */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Componentes Adquiridos:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {order.items && order.items.map((item: any, idx: number) => (
                            <div key={idx} className="bg-slate-950/70 border border-white/10 p-3 rounded-xl flex items-center gap-3">
                              <img 
                                src={item.image || "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&auto=format&fit=crop&q=60"} 
                                alt={item.name} 
                                className="w-12 h-12 rounded-lg object-cover bg-slate-900" 
                              />
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                                <span className="text-[10px] text-slate-400 font-mono block">OEM: {item.oem}</span>
                                <span className="text-xs font-black text-slate-200">{item.price} €</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Rodapé: Método de Entrega & Fatura rápida */}
                      <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                          {order.delivery_method === "ship" ? <Truck className="w-4 h-4 text-slate-300" /> : <Store className="w-4 h-4 text-slate-300" />}
                          <span>Entrega: <strong className="text-slate-200">{order.delivery_method === "ship" ? "Envio Transportadora (+25€)" : "Recolha nas Instalações"}</strong></span>
                        </div>

                        {/* Anexo de Fatura (se existir no Supabase) */}
                        {order.invoice_url ? (
                          <a 
                            href={order.invoice_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 text-xs font-bold flex items-center gap-1.5 underline"
                          >
                            <Download className="w-3.5 h-3.5" /> Descarregar Fatura PDF
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5" /> Fatura em processamento
                          </span>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* COLUNA DIREITA (1/3): FATURAS E DADOS DA CONTA */}
            <div className="space-y-6">
              
              {/* BLOCO: FATURAS E DOCUMENTOS */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <FileText className="w-4 h-4 text-slate-300" /> Faturas & Anexos
                </h3>

                {orders.filter(o => o.invoice_url).length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">
                    Assim que as tuas encomendas forem processadas, os ficheiros de fatura estarão disponíveis aqui para download.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {orders.filter(o => o.invoice_url).map((ord) => (
                      <a 
                        key={ord.id}
                        href={ord.invoice_url} 
                        target="_blank"
                        className="p-3 bg-slate-950/80 border border-white/10 rounded-xl flex items-center justify-between hover:border-slate-300 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-red-400" />
                          <div>
                            <span className="font-bold text-white block">Fatura #{ord.id.slice(0, 6)}</span>
                            <span className="text-[10px] text-slate-400">{ord.total_price} €</span>
                          </div>
                        </div>
                        <Download className="w-4 h-4 text-slate-300" />
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* BLOCO: DADOS DE CLIENTE / OFICINA */}
              <div className="bg-slate-900/80 border border-white/15 rounded-3xl p-6 backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                  <User className="w-4 h-4 text-slate-300" /> Ficha de Registo
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] uppercase font-bold block">Email Registo</span>
                    <span className="font-mono text-slate-200">{currentUser?.email}</span>
                  </div>

                  {profile?.nif && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">NIF / NIPC</span>
                      <span className="font-mono text-slate-200">{profile.nif}</span>
                    </div>
                  )}

                  {profile?.phone && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Telemóvel Contacto</span>
                      <span className="text-slate-200">{profile.phone}</span>
                    </div>
                  )}

                  {profile?.address && (
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Morada Habitual</span>
                      <span className="text-slate-200">{profile.address}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </main>
  );
}