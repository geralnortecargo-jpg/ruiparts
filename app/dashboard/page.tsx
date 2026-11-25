"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { euros } from "@/lib/catalog";

type Profile = {
  full_name?: string;
  nif?: string;
  phone?: string;
  address?: string;
  role?: string;
};

type Order = {
  id: string;
  created_at?: string;
  total_price?: number;
  status?: string;
  delivery_method?: string;
  items?: { name?: string; price?: number; oem?: string }[];
  invoice_url?: string;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [ficha, setFicha] = useState({ name: "", nif: "", phone: "", address: "", role: "" });
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      if (!user) {
        window.location.href = "/";
        return;
      }
      setEmail(user.email || "");
      const meta = user.user_metadata || {};
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      const row = (profile || {}) as Profile;
      setFicha({
        name: row.full_name || meta.name || "",
        nif: row.nif || meta.nif || "",
        phone: row.phone || meta.phone || "",
        address: row.address || [meta.billing_address, meta.billing_postal_code, meta.billing_city].filter(Boolean).join(", "),
        role: row.role || (meta.account_type === "empresa" ? "workshop" : "customer"),
      });
      const { data: ordersData } = await supabase.from("orders").select("*").eq("user_id", user.id);
      const lista = ((ordersData || []) as Order[]).slice().sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
      setOrders(lista);
      setLoading(false);
    }
    void load();
  }, []);

  if (loading) return <main className="oms-wrap py-10">A abrir a conta...</main>;

  return (
    <main className="oms-wrap grid gap-6 py-8">
      <section className="oms-hero">
        <p className="oms-kicker !text-[#f0a15a]">{ficha.role === "workshop" ? "Oficina" : "Cliente"}</p>
        <h1 className="!text-5xl">{ficha.name || email}</h1>
        <p className="text-[#f0e4d4]">Os pedidos ficam aqui. A fatura aparece quando o pátio a juntar.</p>
        <Link href="/#stock" className="oms-btn relative z-10 mt-4 w-fit">Ver o stock</Link>
      </section>
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="grid gap-3">
          <h2 className="font-display text-4xl">Pedidos</h2>
          {orders.length === 0 ? <p className="oms-panel">Ainda não há pedidos nesta conta.</p> : null}
          {orders.map((order) => (
            <article key={order.id} className="oms-panel">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[#6f6256]">{order.created_at ? new Date(order.created_at).toLocaleDateString("pt-PT") : "Pedido"}</p>
                <p className="font-display text-3xl">{euros(Number(order.total_price) || 0)}</p>
              </div>
              <p className="mt-2 font-semibold">{order.status || "Pedido recebido"}</p>
              <p className="text-sm text-[#6f6256]">{order.delivery_method === "ship" ? "Envio" : "Recolha no pátio"}</p>
              <ul className="mt-3 grid gap-1 text-sm">
                {(order.items || []).map((item, index) => (
                  <li key={`${item.name}-${index}`}>{item.name} {item.oem ? `· ${item.oem}` : ""}</li>
                ))}
              </ul>
              {order.invoice_url ? <a className="mt-3 inline-block font-semibold text-[#9d3d0c]" href={order.invoice_url}>Descarregar fatura</a> : null}
            </article>
          ))}
        </div>
        <aside className="oms-panel h-fit">
          <h2 className="font-display text-3xl">Ficha</h2>
          <dl className="mt-3 grid gap-3 text-sm">
            <div><dt className="text-[#6f6256]">Email</dt><dd>{email}</dd></div>
            <div><dt className="text-[#6f6256]">NIF</dt><dd>{ficha.nif || "—"}</dd></div>
            <div><dt className="text-[#6f6256]">Telemóvel</dt><dd>{ficha.phone || "—"}</dd></div>
            <div><dt className="text-[#6f6256]">Morada</dt><dd>{ficha.address || "—"}</dd></div>
          </dl>
        </aside>
      </section>
    </main>
  );
}
