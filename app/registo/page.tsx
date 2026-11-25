"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";

const inicial = {
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
  sameAsBilling: true,
};

export default function RegistoPage() {
  const [form, setForm] = useState(inicial);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof inicial>(key: K, value: (typeof inicial)[K]) {
    setForm((atual) => ({ ...atual, [key]: value }));
  }

  async function submeter(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    if (form.nif.length !== 9) {
      setError("O NIF tem de ter 9 dígitos.");
      setLoading(false);
      return;
    }

    const meta = {
      account_type: form.accountType,
      name: form.name,
      nif: form.nif,
      phone: form.phone,
      billing_address: form.billingAddress,
      billing_city: form.billingCity,
      billing_postal_code: form.billingPostalCode,
      shipping_address: form.sameAsBilling ? form.billingAddress : form.shippingAddress,
      shipping_city: form.sameAsBilling ? form.billingCity : form.shippingCity,
      shipping_postal_code: form.sameAsBilling ? form.billingPostalCode : form.shippingPostalCode,
    };

    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: meta },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        full_name: form.name,
        nif: form.nif,
        phone: form.phone,
        address: [meta.billing_address, meta.billing_postal_code, meta.billing_city].filter(Boolean).join(", "),
        role: form.accountType === "empresa" ? "workshop" : "customer",
      });
    }

    setLoading(false);
    if (data.session) window.location.href = "/dashboard";
    else setDone(true);
  }

  return (
    <main className="oms-wrap py-8">
      <form className="oms-panel mx-auto grid max-w-2xl gap-4" onSubmit={submeter}>
        <Link href="/" className="text-sm font-semibold text-[#6f6256]">Voltar ao stock</Link>
        <p className="oms-kicker">Conta</p>
        <h1 className="font-display text-5xl">Ficha de cliente</h1>
        <p className="text-sm text-[#6f6256]">Particular ou oficina. O NIF e a morada ficam prontos para a fatura.</p>
        {done ? (
          <div>
            <p className="font-semibold">Conta criada. Já podes entrar.</p>
            <Link href="/" className="oms-btn mt-3">Ir ao catálogo</Link>
          </div>
        ) : (
          <>
            {error ? <p className="text-sm text-[#9d3d0c]">{error}</p> : null}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="oms-label">Tipo
                <select className="oms-field" value={form.accountType} onChange={(e) => set("accountType", e.target.value)}>
                  <option value="particular">Particular</option>
                  <option value="empresa">Oficina / empresa</option>
                </select>
              </label>
              <label className="oms-label">Nome
                <input required className="oms-field" value={form.name} onChange={(e) => set("name", e.target.value)} />
              </label>
              <label className="oms-label">NIF
                <input required maxLength={9} className="oms-field" value={form.nif} onChange={(e) => set("nif", e.target.value.replace(/\D/g, ""))} />
              </label>
              <label className="oms-label">Telemóvel
                <input required className="oms-field" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </label>
              <label className="oms-label">Email
                <input required type="email" className="oms-field" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </label>
              <label className="oms-label">Palavra-passe
                <input required type="password" minLength={6} className="oms-field" value={form.password} onChange={(e) => set("password", e.target.value)} />
              </label>
              <label className="oms-label md:col-span-2">Morada de faturação
                <input required className="oms-field" value={form.billingAddress} onChange={(e) => set("billingAddress", e.target.value)} />
              </label>
              <label className="oms-label">Localidade
                <input required className="oms-field" value={form.billingCity} onChange={(e) => set("billingCity", e.target.value)} />
              </label>
              <label className="oms-label">Código postal
                <input required className="oms-field" value={form.billingPostalCode} onChange={(e) => set("billingPostalCode", e.target.value)} />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.sameAsBilling} onChange={(e) => set("sameAsBilling", e.target.checked)} />
              A entrega é na mesma morada
            </label>
            {!form.sameAsBilling ? (
              <div className="grid gap-3 md:grid-cols-2">
                <label className="oms-label md:col-span-2">Morada de entrega
                  <input className="oms-field" value={form.shippingAddress} onChange={(e) => set("shippingAddress", e.target.value)} />
                </label>
                <label className="oms-label">Localidade
                  <input className="oms-field" value={form.shippingCity} onChange={(e) => set("shippingCity", e.target.value)} />
                </label>
                <label className="oms-label">Código postal
                  <input className="oms-field" value={form.shippingPostalCode} onChange={(e) => set("shippingPostalCode", e.target.value)} />
                </label>
              </div>
            ) : null}
            <button className="oms-btn w-fit" disabled={loading}>{loading ? "A criar..." : "Criar conta"}</button>
          </>
        )}
      </form>
    </main>
  );
}
