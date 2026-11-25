"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { euros, fetchStock, podePedir, textoEstado, type Part } from "@/lib/catalog";
import { useCart } from "@/lib/useCart";

export default function PecaFicha() {
  const params = useParams<{ id: string }>();
  const { add } = useCart();
  const [part, setPart] = useState<Part | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = decodeURIComponent(params.id || "");
    const source = raw.startsWith("products-") ? "products" : "parts";
    const id = raw.replace(/^(parts|products)-/, "");
    fetchStock().then((result) => {
      setPart(result.parts.find((item) => item.id === id && item.source === source) || null);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) return <main className="oms-wrap py-10">A abrir a ficha...</main>;
  if (!part) {
    return (
      <main className="oms-wrap py-10">
        <p className="font-display text-4xl">Esta peça já não está no stock.</p>
        <Link href="/" className="oms-btn mt-4">Voltar ao catálogo</Link>
      </main>
    );
  }

  const ficha = [
    ["Marca", part.brand],
    ["Modelo", part.model],
    ["Ano", part.year],
    ["Mês", part.month],
    ["Combustível", part.fuel],
    ["Caixa", part.gearbox],
    ["Segmento", part.body],
    ["Tração", part.drive],
    ["Portas", part.doors],
    ["Lado", part.side],
    ["Motor", part.engine],
    ["Quilómetros", part.km],
    ["Origem", part.donor],
    ["Garantia", part.warranty],
    ["Estado", part.condition],
    ["Referência", part.oem],
    ["VIN", part.vin],
  ].filter(([, value]) => value);

  return (
    <main className="oms-wrap grid gap-6 py-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="min-h-80 overflow-hidden rounded-[28px] bg-[#2a231c]">
        {part.image ? (
          <img src={part.image} alt="" className="h-full min-h-80 w-full object-cover" />
        ) : (
          <div className="grid min-h-80 place-items-center font-display text-8xl text-[#f0c9a0]">{(part.category || "MS").slice(0, 1)}</div>
        )}
      </div>
      <div className="grid content-start gap-4">
        <Link href="/#stock" className="text-sm font-semibold text-[#6f6256]">Voltar ao stock</Link>
        <p className="oms-kicker">{part.category || "Peça"} · {textoEstado(part.status)}</p>
        <h1 className="font-display text-5xl leading-none">{part.name}</h1>
        <p className="oms-price">{euros(part.price)}</p>
        <dl className="grid grid-cols-2 gap-3">
          {ficha.map(([nome, valor]) => (
            <div key={nome} className="oms-panel !p-3">
              <dt className="text-xs uppercase tracking-wide text-[#6f6256]">{nome}</dt>
              <dd className="font-semibold">{valor}</dd>
            </div>
          ))}
        </dl>
        {part.description ? <p className="whitespace-pre-wrap text-[#3d342c]">{part.description}</p> : null}
        {podePedir(part) ? (
          <button className="oms-btn w-fit" onClick={() => add(part)}>Pedir esta peça</button>
        ) : (
          <p className="font-semibold text-[#9d3d0c]">Esta peça está reservada ou vendida.</p>
        )}
      </div>
    </main>
  );
}
