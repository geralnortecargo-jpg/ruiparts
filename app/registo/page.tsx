"use client";

import { useState } from "react";
import { User, Lock, Mail, Phone, MapPin, Building, ShieldCheck, ArrowLeft, FileText, Hash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import RuipartsNavbar from "@/components/Navbar";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    accountType: "particular",
    name: "",
    nif: "",
    email: "",
    password: "",
    phone: "",
    billingAddress: "",
    billingCity: "",
    billingPostalCode: "",
    shippingAddress: "",
    shippingCity: "",
    shippingPostalCode: "",
    sameAsBilling: true
  });
  
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Botão de registo clicado! A submeter dados:", formData.email);
    setLoading(true);
    setErrorMessage("");

    try {
      if (formData.nif && formData.nif.length !== 9) {
        throw new Error("O NIF deve conter exatamente 9 dígitos para integração correta com o Sage.");
      }

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            account_type: formData.accountType,
            name: formData.name,
            nif: formData.nif,
            phone: formData.phone,
            billing_address: formData.billingAddress,
            billing_city: formData.billingCity,
            billing_postal_code: formData.billingPostalCode,
            shipping_address: formData.sameAsBilling ? formData.billingAddress : formData.shippingAddress,
            shipping_city: formData.sameAsBilling ? formData.billingCity : formData.shippingCity,
            shipping_postal_code: formData.sameAsBilling ? formData.billingPostalCode : formData.shippingPostalCode,
            erp_synced: false
          }
        }
      });

      if (error) throw error;

      // Redireciona diretamente para o dashboard se a sessão estiver ativa
      if (data.session) {
        window.location.href = "/dashboard";
      } else {
        setSuccessMessage(true);
      }
    } catch (err: any) {
      console.error("Erro no registo Supabase:", err);
      setErrorMessage(err.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-slate-100 font-sans relative">
      <div 
        className="fixed inset-0 z-0 bg-no-repeat bg-top"
        style={{ backgroundImage: `url('/ruiparts-bg.jpg')`, backgroundSize: '70% auto' }}
      >
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-[1px]"></div>
      </div>

      <div className="relative z-10">
        <RuipartsNavbar />

        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-slate-950/85 backdrop-blur-2xl border border-white/15 p-8 rounded-3xl shadow-2xl relative">
            
            <Link href="/" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
            </Link>

            <div className="mb-6">
              <span className="bg-slate-300 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
                Registo de Cliente / Oficina
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mt-2">Ficha de Cliente Integrável (Sage)</h2>
              <p className="text-xs text-slate-300 mt-1">
                Preencha os dados fiscais e logísticos para garantir compatibilidade com o ERP.
              </p>
            </div>

            {successMessage ? (
              <div className="text-center py-8 space-y-4 bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <ShieldCheck className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-white">Registo Efetuado com Sucesso!</h3>
                <p className="text-xs text-slate-300">
                  A conta foi criada e está pronta. Pode iniciar sessão na página principal.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block bg-slate-300 hover:bg-white text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition-colors"
                >
                  Ir para o Dashboard
                </Link>
              </div>
            ) : (
              <form onSubmit={handleRegister} className="space-y-6">
                {errorMessage && (
                  <div className="bg-red-500/20 border border-red-500/30 text-red-200 text-xs p-3 rounded-xl">
                    {errorMessage}
                  </div>
                )}

                {/* 1. Dados Pessoais / Empresa */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-300" /> 1. Dados Pessoais / Empresa
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Tipo de Conta</label>
                      <select
                        value={formData.accountType}
                        onChange={(e) => setFormData({...formData, accountType: e.target.value})}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-slate-300"
                      >
                        <option value="particular">Cliente Particular</option>
                        <option value="empresa">Empresa / Oficina</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Nome / Designação Social</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                        <input
                          type="text"
                          required
                          placeholder="Ex: Auto Oficina Silva"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-slate-300"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">NIF (9 Dígitos)</label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        required
                        maxLength={9}
                        placeholder="Ex: 509123456"
                        value={formData.nif}
                        onChange={(e) => setFormData({...formData, nif: e.target.value.replace(/\D/g, '')})}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white focus:outline-none focus:border-slate-300 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Contactos */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-300" /> 2. Contactos e Credenciais
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        placeholder="exemplo@oficina.pt"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Telemóvel</label>
                      <input
                        type="tel"
                        required
                        placeholder="9xx xxx xxx"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Palavra-passe</label>
                    <input
                      type="password"
                      required
                      placeholder="Mínimo 6 carateres"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-slate-300"
                    />
                  </div>
                </div>

                {/* 3. Morada de Faturação */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-300" /> 3. Morada de Faturação
                  </h3>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">Morada Fiscal</label>
                    <input
                      type="text"
                      required
                      placeholder="Rua, Número, Andar"
                      value={formData.billingAddress}
                      onChange={(e) => setFormData({...formData, billingAddress: e.target.value})}
                      className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-slate-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Localidade</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Porto"
                        value={formData.billingCity}
                        onChange={(e) => setFormData({...formData, billingCity: e.target.value})}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-slate-300"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-300 block mb-1">Código Postal</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: 4000-000"
                        value={formData.billingPostalCode}
                        onChange={(e) => setFormData({...formData, billingPostalCode: e.target.value})}
                        className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white focus:outline-none focus:border-slate-300 font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Morada de Envio */}
                <div className="bg-slate-900/60 p-5 rounded-2xl border border-white/10 space-y-4">
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-300" /> 4. Morada de Envio
                  </h3>

                  <div className="flex items-center gap-2 pb-2">
                    <input
                      type="checkbox"
                      id="sameAddress"
                      checked={formData.sameAsBilling}
                      onChange={(e) => setFormData({...formData, sameAsBilling: e.target.checked})}
                      className="w-4 h-4 rounded bg-slate-950 border-white/15 text-slate-300"
                    />
                    <label htmlFor="sameAddress" className="text-xs text-slate-300 cursor-pointer">
                      A morada de envio é igual à morada de faturação
                    </label>
                  </div>

                  {!formData.sameAsBilling && (
                    <div className="space-y-4 pt-2 border-t border-white/10">
                      <div>
                        <label className="text-xs text-slate-300 block mb-1">Morada de Entrega</label>
                        <input
                          type="text"
                          placeholder="Rua de Entrega, nº 45"
                          value={formData.shippingAddress}
                          onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
                          className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-slate-300 block mb-1">Localidade de Entrega</label>
                          <input
                            type="text"
                            placeholder="Vila Nova de Gaia"
                            value={formData.shippingCity}
                            onChange={(e) => setFormData({...formData, shippingCity: e.target.value})}
                            className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white"
                          />
                        </div>

                        <div>
                          <label className="text-xs text-slate-300 block mb-1">C. Postal</label>
                          <input
                            type="text"
                            maxLength={8}
                            placeholder="4400-123"
                            value={formData.shippingPostalCode}
                            onChange={(e) => setFormData({...formData, shippingPostalCode: e.target.value})}
                            className="w-full bg-slate-950 border border-white/15 rounded-xl py-2.5 px-3 text-xs text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-300 hover:bg-white disabled:opacity-50 text-slate-950 font-extrabold py-3.5 rounded-xl transition-all text-xs shadow-lg mt-4"
                >
                  {loading ? "A processar registo..." : "Submeter Ficha de Cliente / Oficina"}
                </button>
              </form>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}