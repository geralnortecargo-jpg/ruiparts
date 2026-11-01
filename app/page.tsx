"use client";

import { useState, useEffect } from "react";
import { Search, Car, Truck, Store, ShieldCheck, ShoppingCart, CreditCard, Filter, User, X, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import RuipartsNavbar from "@/components/Navbar";
import Link from "next/link";

export default function RuiPartsCatalog() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [selectedModel, setSelectedModel] = useState("Todos");
  const [selectedYear, setSelectedYear] = useState("Todos");
  const [selectedFuel, setSelectedFuel] = useState("Todos");
  
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Estados para o Carrinho e Autenticação
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  // Checkout / Encomenda
  const [deliveryMethod, setDeliveryMethod] = useState<"ship" | "pickup">("ship");
  const [paymentDone, setPaymentDone] = useState(false);
  const [mbwayNumber, setMbwayNumber] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Credenciais de Login Supabase
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const BRANDS = ["Todas", "Volkswagen", "BMW", "Mercedes-Benz", "Audi", "Peugeot", "Renault"];
  const MODELS = ["Todos", "Golf V / Passat", "Série 3 (E90/E91) 320d", "Classe C (W205)", "A4 (B8)"];
  const YEARS = ["Todos", "2006", "2008", "2011", "2017"];
  const FUELS = ["Todos", "Gasóleo", "Gasolina", "Híbrido", "Elétrico"];

  useEffect(() => {
    // Verificar sessão ativa do Supabase
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setCurrentUser(session.user);
      }
    }
    checkUser();

    // Escutar mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    async function fetchParts() {
      setLoading(true);
      const { data, error } = await supabase.from("parts").select("*");

      if (!error && data && data.length > 0) {
        setParts(data);
      } else {
        setParts([
          {
            id: "P001",
            name: "Motor 1.9 TDI 105cv (Código BKC)",
            brand: "Volkswagen",
            model: "Golf V / Passat",
            year: "2006",
            fuel: "Gasóleo",
            oem: "03G100031X",
            category: "Motores & Caixas",
            price: 650,
            condition: "Testado & Garantido (140.000 km)",
            image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=500&auto=format&fit=crop&q=60"
          },
          {
            id: "P002",
            name: "Caixa de Velocidades Manual 6 Vel.",
            brand: "BMW",
            model: "Série 3 (E90/E91) 320d",
            year: "2008",
            fuel: "Gasóleo",
            oem: "GS6-37DZ",
            category: "Transmissão",
            price: 380,
            condition: "Excelente Estado",
            image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=500&auto=format&fit=crop&q=60"
          },
          {
            id: "P003",
            name: "Ótica Dianteira Esquerda LED",
            brand: "Mercedes-Benz",
            model: "Classe C (W205)",
            year: "2017",
            fuel: "Gasolina",
            oem: "A2059062302",
            category: "Iluminação",
            price: 290,
            condition: "Sem Riscos",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&auto=format&fit=crop&q=60"
          },
          {
            id: "P004",
            name: "Parachoques Frontal S-Line",
            brand: "Audi",
            model: "A4 (B8)",
            year: "2011",
            fuel: "Gasóleo",
            oem: "8K0807233",
            category: "Chaparia",
            price: 180,
            condition: "Completo com grelhas",
            image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop&q=60"
          }
        ]);
      }
      setLoading(false);
    }

    fetchParts();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const addToCart = (part: any) => {
    if (!cart.some(item => item.id === part.id)) {
      setCart([...cart, part]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + item.price, 0);
  const finalTotal = cartTotal + (deliveryMethod === "ship" ? 25 : 0);

  // Efetuar login real com Supabase
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message);
    } else {
      setIsLoginOpen(false);
      setEmail("");
      setPassword("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  // Submeter Encomenda ligada ao Cliente Registado
  const handleConfirmOrder = async () => {
    setIsSubmittingOrder(true);
    try {
      const orderData = {
        user_id: currentUser ? currentUser.id : null,
        customer_email: currentUser ? currentUser.email : "convidado@ruiparts.pt",
        items: cart,
        delivery_method: deliveryMethod,
        total_price: finalTotal,
        mbway_number: mbwayNumber,
        status: "Pago / MB WAY Iniciado"
      };

      const { error } = await supabase.from("orders").insert([orderData]);

      if (error) throw error;

      setPaymentDone(true);
    } catch (err: any) {
      alert("Erro ao registar encomenda: " + (err.message || "Tente novamente."));
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const filteredParts = parts.filter((part) => {
    const query = search.toLowerCase();
    const matchesSearch =
      part.name.toLowerCase().includes(query) ||
      (part.oem && part.oem.toLowerCase().includes(query)) ||
      (part.model && part.model.toLowerCase().includes(query));
    
    const matchesBrand = selectedBrand === "Todas" || part.brand === selectedBrand;
    const matchesModel = selectedModel === "Todos" || part.model === selectedModel;
    const matchesYear = selectedYear === "Todos" || part.year === selectedYear;
    const matchesFuel = selectedFuel === "Todos" || part.fuel === selectedFuel;

    return matchesSearch && matchesBrand && matchesModel && matchesYear && matchesFuel;
  });

  return (
    <main className="min-h-screen text-slate-100 font-sans relative">
      {/* Imagem de Fundo Ajustada */}
      <div 
        className="fixed inset-0 z-0 bg-no-repeat bg-top"
        style={{ 
          backgroundImage: `url('/ruiparts-bg.jpg')`,
          backgroundSize: '70% auto' 
        }}
      >
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px]"></div>
      </div>

      {/* Conteúdo Principal */}
      <div className="relative z-10">
        <RuipartsNavbar />

        {/* Barra de Ações Rápidas (Carrinho & Login) */}
        <div className="max-w-7xl mx-auto px-4 pt-4 flex justify-end gap-3">
          {currentUser ? (
            <div className="flex items-center gap-2 bg-slate-950/80 border border-white/15 px-4 py-2 rounded-xl text-xs backdrop-blur-md">
              <User className="w-4 h-4 text-slate-300" />
              <span className="text-slate-200 font-bold">{currentUser.email}</span>
              <button onClick={handleLogout} className="text-slate-400 hover:text-white ml-2 text-[10px] underline">
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-slate-950/70 border border-white/15 hover:border-slate-300 text-slate-200 px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg backdrop-blur-md"
            >
              <User className="w-4 h-4 text-slate-300" />
              Entrar / Registar
            </button>
          )}

          <button
            onClick={() => setIsCartOpen(true)}
            className="bg-slate-300 hover:bg-white text-slate-950 px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 shadow-lg relative"
          >
            <ShoppingCart className="w-4 h-4" />
            Carrinho
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        {/* Secção Hero */}
        <section id="inicio" className="max-w-7xl mx-auto px-4 pt-4">
          <div className="bg-slate-950/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/15 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <span className="bg-slate-300 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                Instalações Oficiais
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white">Ruiparts • Peças Automóveis</h2>
              <p className="text-xs md:text-sm text-slate-200 max-w-xl">
                Especialistas em desmontagem, armazenamento e envio rápido de componentes com garantia para todo o país.
              </p>
            </div>
            <div className="bg-slate-950/80 border border-white/15 p-4 rounded-2xl text-center min-w-[200px]">
              <span className="text-xs text-slate-300 block font-medium">Stock Disponível</span>
              <span className="text-2xl font-black text-slate-200">+5.000 Peças</span>
            </div>
          </div>
        </section>

        {/* Filtros de Pesquisa */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-slate-950/60 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-white/15 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-slate-300" />
              <h2 className="text-xl font-bold text-white">Filtros de Pesquisa do Stock</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative md:col-span-1">
                <Search className="absolute left-3 top-3.5 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Pesquisar OEM..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-900/90 border border-white/15 rounded-xl py-3 pl-10 pr-3 text-white focus:outline-none focus:border-slate-300 transition-all text-xs font-mono placeholder-slate-400"
                />
              </div>

              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="bg-slate-900/90 border border-white/15 rounded-xl py-3 px-3 text-white focus:outline-none focus:border-slate-300 transition-all text-xs"
              >
                <option value="Todas" className="bg-slate-900">Todas as Marcas</option>
                {BRANDS.filter(b => b !== "Todas").map((b) => (
                  <option key={b} value={b} className="bg-slate-900">{b}</option>
                ))}
              </select>

              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-900/90 border border-white/15 rounded-xl py-3 px-3 text-white focus:outline-none focus:border-slate-300 transition-all text-xs"
              >
                <option value="Todos" className="bg-slate-900">Todos os Modelos</option>
                {MODELS.filter(m => m !== "Todos").map((m) => (
                  <option key={m} value={m} className="bg-slate-900">{m}</option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-900/90 border border-white/15 rounded-xl py-3 px-3 text-white focus:outline-none focus:border-slate-300 transition-all text-xs"
              >
                <option value="Todos" className="bg-slate-900">Todos os Anos</option>
                {YEARS.filter(y => y !== "Todos").map((y) => (
                  <option key={y} value={y} className="bg-slate-900">{y}</option>
                ))}
              </select>

              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="bg-slate-900/90 border border-white/15 rounded-xl py-3 px-3 text-white focus:outline-none focus:border-slate-300 transition-all text-xs"
              >
                <option value="Todos" className="bg-slate-900">Combustível</option>
                {FUELS.filter(f => f !== "Todos").map((f) => (
                  <option key={f} value={f} className="bg-slate-900">{f}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Grelha de Catálogo */}
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Car className="w-5 h-5 text-slate-300" /> Resultados Encontrados ({filteredParts.length})
            </h3>
          </div>

          {filteredParts.length === 0 ? (
            <div className="text-center py-12 bg-slate-950/60 backdrop-blur-md rounded-2xl border border-white/15">
              <p className="text-slate-300 text-sm">Nenhuma peça encontrada para os critérios selecionados.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredParts.map((part) => (
                <div key={part.id} className="bg-slate-950/70 backdrop-blur-xl border border-white/15 hover:border-slate-300/50 rounded-2xl overflow-hidden transition-all flex flex-col justify-between shadow-xl">
                  <div>
                    <div className="h-44 bg-slate-950 relative overflow-hidden">
                      <img src={part.image} alt={part.name} className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300" />
                      <span className="absolute top-3 right-3 bg-slate-300 text-slate-950 text-[10px] font-black uppercase px-2 py-1 rounded shadow">
                        {part.brand}
                      </span>
                    </div>
                    
                    <div className="p-5">
                      <div className="text-xs text-slate-300 font-mono mb-1">OEM: {part.oem}</div>
                      <h4 className="font-bold text-white text-base leading-snug mb-2">{part.name}</h4>
                      <div className="text-xs text-slate-300 mb-2 font-medium">{part.model} ({part.year}) • {part.fuel}</div>
                      <div className="text-xs text-slate-300 bg-slate-900/80 p-2 rounded-lg border border-white/10 mb-4">
                        Estado: <span className="text-slate-100">{part.condition}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-white/10 mt-auto flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Preço</span>
                      <span className="text-xl font-black text-white">{part.price} €</span>
                    </div>
                    <button
                      onClick={() => addToCart(part)}
                      className="bg-slate-300 hover:bg-white text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow"
                    >
                      <ShoppingCart className="w-4 h-4" /> Adicionar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MODAL DO CARRINHO DE COMPRAS */}
        {isCartOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl max-h-[90vh] flex flex-col">
              <button
                onClick={() => { setIsCartOpen(false); setPaymentDone(false); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-slate-300" /> Carrinho de Compras ({cart.length})
              </h3>

              {!paymentDone ? (
                <>
                  <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
                    {cart.length === 0 ? (
                      <p className="text-slate-400 text-xs text-center py-8">O seu carrinho está vazio.</p>
                    ) : (
                      cart.map((item) => (
                        <div key={item.id} className="bg-slate-900/90 border border-white/10 p-3 rounded-xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                            <div>
                              <h4 className="text-xs font-bold text-white">{item.name}</h4>
                              <span className="text-[10px] text-slate-400 font-mono">OEM: {item.oem}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-extrabold text-white">{item.price} €</span>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-300">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="border-t border-white/10 pt-4 space-y-4">
                      {currentUser && (
                        <div className="text-[10px] bg-slate-900 p-2 rounded-lg border border-white/10 text-slate-300 flex items-center justify-between">
                          <span>Encomenda associada a:</span>
                          <span className="font-bold text-white">{currentUser.email}</span>
                        </div>
                      )}

                      <div>
                        <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block mb-2">Método de Entrega</label>
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            onClick={() => setDeliveryMethod("ship")}
                            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                              deliveryMethod === "ship" ? "border-slate-300 bg-slate-300/10 text-slate-200" : "border-white/10 bg-slate-900 text-slate-400"
                            }`}
                          >
                            <Truck className="w-4 h-4" /> Envio (+25€)
                          </button>
                          <button
                            onClick={() => setDeliveryMethod("pickup")}
                            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition-all ${
                              deliveryMethod === "pickup" ? "border-slate-300 bg-slate-300/10 text-slate-200" : "border-white/10 bg-slate-900 text-slate-400"
                            }`}
                          >
                            <Store className="w-4 h-4" /> Recolha Loja (Grátis)
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block mb-2">Pagamento MB WAY</label>
                        <input
                          type="tel"
                          placeholder="Nº de Telemóvel (9xx xxx xxx)"
                          value={mbwayNumber}
                          onChange={(e) => setMbwayNumber(e.target.value)}
                          className="w-full bg-slate-900 border border-white/15 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-slate-300"
                        />
                      </div>

                      <button
                        onClick={handleConfirmOrder}
                        disabled={!mbwayNumber || cart.length === 0 || isSubmittingOrder}
                        className="w-full bg-slate-300 hover:bg-white disabled:opacity-50 text-slate-950 font-extrabold py-3 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg"
                      >
                        {isSubmittingOrder ? "A registar encomenda..." : `Confirmar Pagamento • Total: ${finalTotal} €`}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                    <ShieldCheck className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white">Encomenda Registada!</h3>
                  <p className="text-xs text-slate-300">
                    Obrigado pela sua compra. A encomenda foi gravada com sucesso e associada à sua conta.
                  </p>
                  <button
                    onClick={() => { setCart([]); setIsCartOpen(false); setPaymentDone(false); setMbwayNumber(""); }}
                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
                  >
                    Fechar e Continuar
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL DE LOGIN */}
        {isLoginOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <div className="bg-slate-950/95 backdrop-blur-2xl border border-white/20 rounded-3xl max-w-sm w-full p-6 relative shadow-2xl">
              <button
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-300" /> Área de Cliente
              </h3>
              <p className="text-xs text-slate-400 mb-6">Aceda com as suas credenciais ou crie conta.</p>

              <form onSubmit={handleLogin} className="space-y-4">
                {loginError && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs p-2.5 rounded-xl">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="ex: oficina@email.pt"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">Palavra-passe</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-slate-300"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-300 hover:bg-white text-slate-950 font-extrabold py-3 rounded-xl text-xs transition-all shadow-lg"
                >
                  Entrar
                </button>

                <div className="pt-2 text-center border-t border-white/10">
                  <p className="text-xs text-slate-400 mb-2">Ainda não tem conta de cliente/oficina?</p>
                  <Link
                    href="/registo"
                    onClick={() => setIsLoginOpen(false)}
                    className="inline-block text-xs text-slate-200 font-bold hover:underline"
                  >
                    Criar Ficha de Cliente Completa →
                  </Link>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}