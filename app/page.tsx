"use client";

import { useState } from "react";
import { Search, Car, PackageCheck, Truck, Store, ShieldCheck, ShoppingCart, CreditCard } from "lucide-react";

// Exemplo de stock de peças para a Demo (Simulação das 5.000+ peças)
const SAMPLE_PARTS = [
  {
    id: "P001",
    name: "Motor 1.9 TDI 105cv (Código BKC)",
    brand: "Volkswagen",
    model: "Golf V / Passat",
    year: "2006",
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
    oem: "8K0807233",
    category: "Chaparia",
    price: 180,
    condition: "Completo com grelhas",
    image: "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop&q=60"
  }
];

export default function RuiPartsDemo() {
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("Todas");
  const [selectedPart, setSelectedPart] = useState<any>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"ship" | "pickup">("ship");
  const [paymentDone, setPaymentDone] = useState(false);
  const [mbwayNumber, setMbwayNumber] = useState("");

  const filteredParts = SAMPLE_PARTS.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(search.toLowerCase()) ||
      part.oem.toLowerCase().includes(search.toLowerCase()) ||
      part.model.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = selectedBrand === "Todas" || part.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Banner Demo */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-center text-xs font-bold text-white tracking-wide uppercase">
        ⚡ DEMO INTERATIVA PARA CLIENTE • RUI PARTS (SISTEMA DE PEÇAS & LOGÍSTICA)
      </div>

      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-500 text-slate-950 p-2 rounded-xl font-black text-xl">RP</div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-white">RUI PARTS</h1>
              <p className="text-xs text-cyan-400 font-medium">Plataforma Profissional de Peças Usadas</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <PackageCheck className="w-4 h-4" /> +5.000 Peças em Stock
            </span>
          </div>
        </div>
      </header>

      {/* Hero & Search Engine */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-b from-slate-900 to-slate-900/60 p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Pesquisa Avançada de Stock
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            Encontre a peça exata instantaneamente por descrição, referência OEM ou modelo de viatura.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Ex: Motor 1.9 TDI, Ótica, 03G100031X..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm"
              />
            </div>

            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-cyan-500 transition-all text-sm"
            >
              <option value="Todas">Todas as Marcas</option>
              <option value="Volkswagen">Volkswagen</option>
              <option value="BMW">BMW</option>
              <option value="Mercedes-Benz">Mercedes-Benz</option>
              <option value="Audi">Audi</option>
            </select>
          </div>
        </div>
      </section>

      {/* Listing */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
          <Car className="w-5 h-5 text-cyan-400" /> Resultados Disponíveis ({filteredParts.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredParts.map((part) => (
            <div key={part.id} className="bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl overflow-hidden transition-all flex flex-col justify-between">
              <div>
                <div className="h-44 bg-slate-950 relative overflow-hidden">
                  <img src={part.image} alt={part.name} className="w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 right-3 bg-cyan-500 text-slate-950 text-[10px] font-black uppercase px-2 py-1 rounded">
                    {part.category}
                  </span>
                </div>
                
                <div className="p-5">
                  <div className="text-xs text-slate-400 font-mono mb-1">OEM: {part.oem}</div>
                  <h4 className="font-bold text-white text-base leading-snug mb-2">{part.name}</h4>
                  <div className="text-xs text-cyan-400 mb-2 font-medium">{part.brand} • {part.model} ({part.year})</div>
                  <div className="text-xs text-slate-400 bg-slate-950 p-2 rounded-lg border border-slate-800 mb-4">
                    Estado: <span className="text-slate-200">{part.condition}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-800/50 mt-auto flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">Preço</span>
                  <span className="text-xl font-black text-white">{part.price} €</span>
                </div>
                <button
                  onClick={() => setSelectedPart(part)}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition-colors flex items-center gap-1.5"
                >
                  <ShoppingCart className="w-4 h-4" /> Comprar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de Checkout / Logística / MB WAY */}
      {selectedPart && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-lg w-full p-6 relative shadow-2xl">
            <button
              onClick={() => { setSelectedPart(null); setPaymentDone(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold"
            >
              ✕
            </button>

            {!paymentDone ? (
              <>
                <h3 className="text-xl font-bold text-white mb-1">Finalizar Encomenda</h3>
                <p className="text-xs text-slate-400 mb-4">{selectedPart.name} - <strong>{selectedPart.price} €</strong></p>

                {/* Escolha de Logística */}
                <div className="mb-6">
                  <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block mb-2">Método de Entrega</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDeliveryMethod("ship")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                        deliveryMethod === "ship"
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                          : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                      Enviar p/ Morada (+25€)
                    </button>

                    <button
                      onClick={() => setDeliveryMethod("pickup")}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-2 text-xs font-bold transition-all ${
                        deliveryMethod === "pickup"
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-300"
                          : "border-slate-800 bg-slate-950 text-slate-400"
                      }`}
                    >
                      <Store className="w-5 h-5" />
                      Levantar em Loja (Grátis)
                    </button>
                  </div>
                </div>

                {/* Pagamento MB WAY */}
                <div className="mb-6">
                  <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block mb-2">Pagamento Imediato</label>
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-white font-bold">
                      <CreditCard className="w-4 h-4 text-cyan-400" /> Pagar com MB WAY
                    </div>
                    <input
                      type="tel"
                      placeholder="Nº de Telemóvel (9xx xxx xxx)"
                      value={mbwayNumber}
                      onChange={(e) => setMbwayNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setPaymentDone(true)}
                  disabled={!mbwayNumber}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-extrabold py-3.5 rounded-xl transition-all text-sm flex items-center justify-center gap-2 shadow-lg"
                >
                  Confirmar Pagamento • Total: {selectedPart.price + (deliveryMethod === "ship" ? 25 : 0)} €
                </button>
              </>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-black text-white">Pagamento Aprovado!</h3>
                <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                  A encomenda foi registada e enviada diretamente para o <strong>Dashboard do Armazém</strong>.
                </p>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-cyan-400 font-mono">
                  Estado: {deliveryMethod === "ship" ? "📦 Aguarda Expedição (Envio)" : "🏪 Aguarda Levantamento em Loja"}
                </div>
                <button
                  onClick={() => { setSelectedPart(null); setPaymentDone(false); setMbwayNumber(""); }}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Voltar à Demo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}