"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { euros, fetchStock, removePart, textoEstado, updateOrderStatus, type Part } from "@/lib/catalog";
import StockForm from "@/components/StockForm";

type Order = {
  id: string;
  created_at?: string;
  customer_email?: string;
  customer_name?: string;
  total_price?: number;
  status?: string;
  delivery_method?: string;
  items?: Part[];
};

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [tab, setTab] = useState<"stock" | "pedidos">("stock");
  const [parts, setParts] = useState<Part[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editing, setEditing] = useState<Part | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    const stock = await fetchStock();
    setParts(stock.parts);
    setError(stock.error);
    const { data, error: orderError } = await supabase.from("orders").select("*");
    if (orderError) setError(orderError.message);
    const lista = ((data || []) as Order[]).slice().sort((a, b) => (b.created_at || "").localeCompare(a.created_at || ""));
    setOrders(lista);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 8000);
    supabase.auth.getSession().then(({ data }) => {
      window.clearTimeout(timer);
      setAuthed(Boolean(data.session));
      setReady(true);
      if (data.session) void load();
    });
    return () => window.clearTimeout(timer);
  }, []);

  async function entrar(event: FormEvent) {
    event.preventDefault();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setLoginError("Email ou palavra-passe incorretos.");
      return;
    }
    setAuthed(true);
    await load();
  }

  if (!ready) return <main className="oms-wrap py-10">A abrir a gestão...</main>;

  if (!authed) {
    return (
      <main className="oms-wrap py-10">
        <form className="oms-panel grid max-w-md gap-3" onSubmit={entrar}>
          <p className="oms-kicker">Gestão</p>
          <h1 className="font-display text-5xl">O pátio entra aqui.</h1>
          {loginError ? <p className="text-sm text-[#9d3d0c]">{loginError}</p> : null}
          <input required type="email" className="oms-field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required type="password" className="oms-field" placeholder="Palavra-passe" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="oms-btn w-fit">Entrar na gestão</button>
        </form>
      </main>
    );
  }

  return (
    <main className="oms-wrap grid gap-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="oms-kicker">Gestão</p>
          <h1 className="font-display text-5xl">Stock e pedidos</h1>
        </div>
        <div className="flex gap-2">
          <button className={tab === "stock" ? "oms-btn" : "oms-btn-ghost"} onClick={() => setTab("stock")}>Stock</button>
          <button className={tab === "pedidos" ? "oms-btn" : "oms-btn-ghost"} onClick={() => setTab("pedidos")}>Pedidos</button>
        </div>
      </div>
      {error ? <p className="text-sm text-[#9d3d0c]">{error}</p> : null}

      {tab === "stock" ? (
        <section className="grid gap-4">
          <div className="flex justify-end">
            <button className="oms-btn-ink" onClick={() => { setEditing(null); setShowForm((value) => !value); }}>
              {showForm && !editing ? "Fechar" : "Nova peça"}
            </button>
          </div>
          {showForm || editing ? (
            <div className="oms-panel">
              <StockForm
                initial={editing}
                onSaved={() => {
                  setEditing(null);
                  setShowForm(false);
                  void load();
                }}
              />
            </div>
          ) : null}
          <div className="grid gap-3">
            {parts.length === 0 ? <p className="oms-panel">Ainda não há peças gravadas.</p> : null}
            {parts.map((part) => (
              <article key={`${part.source}-${part.id}`} className="oms-panel flex flex-wrap items-center justify-between gap-3 !p-4">
                <div>
                  <p className="text-xs text-[#6f6256]">{part.oem || "Sem OEM"} · {textoEstado(part.status)}</p>
                  <h2 className="font-semibold">{part.name}</h2>
                  <p className="text-sm text-[#6f6256]">{[part.brand, part.model, euros(part.price)].filter(Boolean).join(" · ")}</p>
                </div>
                <div className="flex gap-2">
                  <button className="oms-btn-ghost !py-2" onClick={() => { setEditing(part); setShowForm(true); }}>Editar</button>
                  <button
                    className="oms-btn-ghost !py-2"
                    onClick={async () => {
                      if (!confirm(`Tirar ${part.name} do stock?`)) return;
                      const result = await removePart(part);
                      if (result.error) setError(result.error);
                      else void load();
                    }}
                  >
                    Apagar
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="grid gap-3">
          {orders.length === 0 ? <p className="oms-panel">Ainda não há pedidos.</p> : null}
          {orders.map((order) => (
            <article key={order.id} className="oms-panel grid gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">{order.customer_name || order.customer_email || "Cliente"}</p>
                  <p className="text-sm text-[#6f6256]">
                    {order.created_at ? new Date(order.created_at).toLocaleString("pt-PT") : "Sem data"} · {order.delivery_method === "ship" ? "Envio" : "Recolha"}
                  </p>
                </div>
                <p className="oms-price text-3xl">{euros(Number(order.total_price) || 0)}</p>
              </div>
              <p className="text-sm">{(order.items || []).map((item) => item.name).filter(Boolean).join(", ") || "Peças por ler"}</p>
              <select
                className="oms-field max-w-xs"
                value={order.status || "Pedido recebido"}
                onChange={async (event) => {
                  const result = await updateOrderStatus(order.id, event.target.value, order.items || []);
                  if (result.error) setError(result.error);
                  else void load();
                }}
              >
                {["Pedido recebido", "Reservada", "Paga", "Enviada", "Recolhida", "Cancelada"].map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
