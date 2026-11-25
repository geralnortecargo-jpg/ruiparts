"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { euros, placeOrder, type Part } from "@/lib/catalog";
import { useCart } from "@/lib/useCart";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { cart, remove, clear } = useCart();
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const [login, setLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [buyer, setBuyer] = useState({
    name: "",
    email: "",
    phone: "",
    nif: "",
    address: "",
    delivery: "pickup" as "pickup" | "ship",
    payment: "recolha" as "recolha" | "mbway" | "transferencia",
    note: "",
  });
  const [sending, setSending] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email || "");
      setUserId(data.session?.user.id || null);
      const meta = data.session?.user.user_metadata || {};
      setBuyer((atual) => ({
        ...atual,
        name: atual.name || meta.name || "",
        email: data.session?.user.email || "",
        phone: atual.phone || meta.phone || "",
        nif: atual.nif || meta.nif || "",
        address: atual.address || [meta.billing_address, meta.billing_postal_code, meta.billing_city].filter(Boolean).join(", "),
      }));
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email || "");
      setUserId(session?.user.id || null);
    });
    const show = () => setOpen(true);
    window.addEventListener("oms-open-cart", show);
    return () => {
      data.subscription.unsubscribe();
      window.removeEventListener("oms-open-cart", show);
    };
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  async function entrar(event: FormEvent) {
    event.preventDefault();
    setLoginError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoginError(error.message === "Invalid login credentials" ? "Email ou palavra-passe incorretos." : error.message);
      return;
    }
    setLogin(false);
    setPassword("");
  }

  async function sair() {
    await supabase.auth.signOut();
    setUserEmail("");
    setUserId(null);
  }

  async function confirmar(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setOrderError("");
    const saved = await placeOrder({
      ...buyer,
      items: cart,
      userId,
    });
    setSending(false);
    if (saved.error) {
      setOrderError(saved.error);
      return;
    }
    clear();
    setDone(true);
  }

  return (
    <>
      <header className="oms-header">
        <div className="oms-wrap flex items-center justify-between gap-4 py-3">
          <Link href="/" className="oms-brand">
            <span className="oms-mark">MS</span>
            <span>
              <strong className="block font-display text-lg leading-none">O Mundo das Sucatas</strong>
              <span className="text-xs text-[#6f6256]">Peças de desmontagem</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm font-semibold md:flex">
            <Link href="/#stock">Stock</Link>
            <Link href="/#patio">O pátio</Link>
            <Link href="/admin">Gestão</Link>
            {userEmail ? (
              <>
                <Link href="/dashboard">A minha conta</Link>
                <button className="oms-btn-ghost !px-3 !py-2" onClick={sair}>Sair</button>
              </>
            ) : (
              <>
                <button onClick={() => setLogin(true)}>Entrar</button>
                <Link href="/registo" className="oms-btn-ink !px-3 !py-2">Criar conta</Link>
              </>
            )}
            <button className="oms-btn" onClick={() => { setDone(false); setOpen(true); }}>
              Pedido {cart.length > 0 ? `(${cart.length})` : ""}
            </button>
          </nav>
          <button className="oms-btn-ink oms-mobile" onClick={() => setMenu((value) => !value)}>Menu</button>
        </div>
        {menu ? (
          <div className="oms-wrap flex flex-col gap-3 pb-4 text-sm font-semibold md:hidden">
            <Link href="/#stock" onClick={() => setMenu(false)}>Stock</Link>
            <Link href="/#patio" onClick={() => setMenu(false)}>O pátio</Link>
            <Link href="/admin" onClick={() => setMenu(false)}>Gestão</Link>
            <Link href={userEmail ? "/dashboard" : "/registo"} onClick={() => setMenu(false)}>{userEmail ? "A minha conta" : "Criar conta"}</Link>
            <button className="oms-btn" onClick={() => { setMenu(false); setOpen(true); }}>Abrir pedido ({cart.length})</button>
          </div>
        ) : null}
      </header>
      {children}
      <footer className="oms-wrap py-10 text-sm text-[#6f6256]">
        O Mundo das Sucatas · a peça só sai do stock quando o pátio a confirma.
      </footer>

      {open ? (
        <div className="oms-drawer" onClick={() => setOpen(false)}>
          <aside className="oms-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-3xl">Pedido</h2>
              <button onClick={() => setOpen(false)}>Fechar</button>
            </div>
            {done ? (
              <div className="oms-panel">
                <p className="oms-kicker">Recebido</p>
                <p className="mt-2 text-lg font-semibold">O pátio vai confirmar a peça e o pagamento.</p>
                <p className="mt-2 text-sm text-[#6f6256]">Ainda não foi cobrado nada. Se a peça continuar disponível, fica reservada.</p>
              </div>
            ) : cart.length === 0 ? (
              <p className="text-[#6f6256]">Ainda não há peças no pedido.</p>
            ) : (
              <form className="grid gap-3" onSubmit={confirmar}>
                {cart.map((item) => (
                  <Linha key={item.id} item={item} onRemove={() => remove(item.id)} />
                ))}
                <p className="font-display text-3xl">{euros(total)}</p>
                <p className="text-sm text-[#6f6256]">Os portes, quando houver envio, são combinados à parte. Este total é só das peças.</p>
                <label className="oms-label">Nome
                  <input required className="oms-field" value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} />
                </label>
                <label className="oms-label">Email
                  <input required type="email" className="oms-field" value={buyer.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} />
                </label>
                <label className="oms-label">Telemóvel
                  <input required className="oms-field" value={buyer.phone} onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })} />
                </label>
                <label className="oms-label">NIF
                  <input className="oms-field" value={buyer.nif} onChange={(e) => setBuyer({ ...buyer, nif: e.target.value })} />
                </label>
                <label className="oms-label">Entrega
                  <select className="oms-field" value={buyer.delivery} onChange={(e) => setBuyer({ ...buyer, delivery: e.target.value as "pickup" | "ship" })}>
                    <option value="pickup">Recolha no pátio</option>
                    <option value="ship">Envio, portes a combinar</option>
                  </select>
                </label>
                {buyer.delivery === "ship" ? (
                  <label className="oms-label">Morada
                    <input required className="oms-field" value={buyer.address} onChange={(e) => setBuyer({ ...buyer, address: e.target.value })} />
                  </label>
                ) : null}
                <label className="oms-label">Pagamento
                  <select className="oms-field" value={buyer.payment} onChange={(e) => setBuyer({ ...buyer, payment: e.target.value as "recolha" | "mbway" | "transferencia" })}>
                    <option value="recolha">Na recolha</option>
                    <option value="mbway">MB WAY, depois da confirmação</option>
                    <option value="transferencia">Transferência, depois da confirmação</option>
                  </select>
                </label>
                <label className="oms-label">Nota para o pátio
                  <textarea className="oms-field" rows={3} value={buyer.note} onChange={(e) => setBuyer({ ...buyer, note: e.target.value })} />
                </label>
                {orderError ? <p className="text-sm text-[#9d3d0c]">{orderError}</p> : null}
                <button className="oms-btn" disabled={sending}>{sending ? "A registar..." : "Pedir estas peças"}</button>
              </form>
            )}
          </aside>
        </div>
      ) : null}

      {login ? (
        <div className="oms-modal-back" onClick={() => setLogin(false)}>
          <form className="oms-modal grid gap-3" onClick={(event) => event.stopPropagation()} onSubmit={entrar}>
            <h2 className="font-display text-4xl">Entrar</h2>
            {loginError ? <p className="text-sm text-[#9d3d0c]">{loginError}</p> : null}
            <input required type="email" className="oms-field" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input required type="password" className="oms-field" placeholder="Palavra-passe" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="oms-btn">Entrar</button>
            <Link href="/registo" className="text-sm font-semibold" onClick={() => setLogin(false)}>Ainda não tenho conta</Link>
          </form>
        </div>
      ) : null}
    </>
  );
}

function Linha({ item, onRemove }: { item: Part; onRemove: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-[#e4d7c4] py-2">
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-xs text-[#6f6256]">{item.oem || item.brand}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">{euros(item.price)}</p>
        <button type="button" className="text-xs text-[#9d3d0c]" onClick={onRemove}>Tirar</button>
      </div>
    </div>
  );
}
