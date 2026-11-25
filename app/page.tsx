"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { euros, fetchStock, podePedir, textoEstado, visivelNoCatalogo, type Part } from "@/lib/catalog";
import { anos, caixas, combustiveis, marcasModelos, meses, modelosDaMarca, portas, segmentos, tracoes } from "@/lib/veiculos";
import { useCart } from "@/lib/useCart";

const fotos = [
  { src: "/ruiparts-bg.jpg", alt: "Fachada do pátio" },
  { src: "/patio-carros.jpg", alt: "Viaturas de origem" },
  { src: "/patio-motores.jpg", alt: "Motores e caixas" },
  { src: "/patio-oticas.jpg", alt: "Óticas e chapa" },
];

export default function HomePage() {
  const { add } = useCart();
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const [vin, setVin] = useState("");
  const [brand, setBrand] = useState("Todas");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [fuel, setFuel] = useState("");
  const [gearbox, setGearbox] = useState("");
  const [body, setBody] = useState("");
  const [drive, setDrive] = useState("");
  const [doors, setDoors] = useState("");
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    fetchStock().then((result) => {
      setParts(result.parts);
      setError(result.error);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setFrame((atual) => (atual + 1) % fotos.length), 5600);
    return () => window.clearInterval(id);
  }, []);

  const catalogo = parts.filter(visivelNoCatalogo);
  const marcasExtra = catalogo
    .map((part) => part.brand)
    .filter((nome) => nome && !marcasModelos.some((item) => item.marca.toLowerCase() === nome.toLowerCase()));
  const brands = ["Todas", ...marcasModelos.map((item) => item.marca), ...new Set(marcasExtra)];
  const modelosExtra = catalogo
    .filter((part) => brand === "Todas" || part.brand.toLowerCase() === brand.toLowerCase())
    .map((part) => part.model)
    .filter((nome) => nome && !modelosDaMarca(brand).some((item) => item.toLowerCase() === nome.toLowerCase()));
  const models = [...modelosDaMarca(brand), ...new Set(modelosExtra)];
  const fuels = [...new Set([...combustiveis, ...catalogo.map((part) => part.fuel).filter(Boolean)])];

  const visiveis = useMemo(() => {
    const ref = reference.replace(/[\s-]/g, "").toLowerCase();
    const vinQuery = vin.replace(/[\s-]/g, "").toLowerCase();
    const modelQuery = model.trim().toLowerCase();
    return catalogo.filter((part) => {
      const oem = `${part.oem} ${part.engine}`.replace(/[\s-]/g, "").toLowerCase();
      const vinAlvo = `${part.vin} ${part.description}`.replace(/[\s-]/g, "").toLowerCase();
      return (
        (!ref || oem.includes(ref)) &&
        (!vinQuery || vinAlvo.includes(vinQuery)) &&
        (brand === "Todas" || part.brand.toLowerCase() === brand.toLowerCase()) &&
        (!modelQuery || part.model.toLowerCase() === modelQuery) &&
        (!year || part.year === year) &&
        (!month || part.month.toLowerCase() === month.toLowerCase()) &&
        (!fuel || part.fuel.toLowerCase() === fuel.toLowerCase()) &&
        (!gearbox || part.gearbox.toLowerCase() === gearbox.toLowerCase()) &&
        (!body || part.body.toLowerCase() === body.toLowerCase()) &&
        (!drive || part.drive.toLowerCase() === drive.toLowerCase()) &&
        (!doors || part.doors === doors)
      );
    });
  }, [catalogo, reference, vin, brand, model, year, month, fuel, gearbox, body, drive, doors]);

  function limpar() {
    setReference("");
    setVin("");
    setBrand("Todas");
    setModel("");
    setYear("");
    setMonth("");
    setFuel("");
    setGearbox("");
    setBody("");
    setDrive("");
    setDoors("");
  }

  return (
    <main className="oms-wrap grid gap-8 py-6">
      <section className="oms-stage">
        <div className="oms-reel" aria-hidden={false}>
          {fotos.map((foto, index) => (
            <img key={foto.src} src={foto.src} alt={index === frame ? foto.alt : ""} className={index === frame ? "is-on" : ""} />
          ))}
        </div>
        <div className="oms-stage-shade" />
        <div className="relative z-10 grid items-end gap-6 p-5 md:p-8 lg:grid-cols-[0.85fr_1.15fr] lg:p-10">
          <div>
            <p className="oms-kicker !text-[#f0a15a]">Desmontagem · stock do pátio</p>
            <h1>O mundo<br />das sucatas.</h1>
            <p className="max-w-xl text-lg text-[#f6efe4]">
              Cada peça saiu de um carro. Vês a origem, o lado, o motor e o estado antes de a pedires.
              O pagamento só acontece depois de o pátio confirmar.
            </p>
            <div className="oms-dots" role="tablist" aria-label="Imagens do pátio">
              {fotos.map((foto, index) => (
                <button key={foto.src} type="button" className={index === frame ? "is-on" : ""} aria-label={foto.alt} onClick={() => setFrame(index)} />
              ))}
            </div>
          </div>
          <div className="oms-glass grid gap-3 md:grid-cols-6">
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c] md:col-span-3">
            Referência
            <input className="oms-field" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="OEM ou código do motor" />
          </label>
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c] md:col-span-3">
            VIN
            <input className="oms-field" value={vin} onChange={(e) => setVin(e.target.value.toUpperCase())} placeholder="Chassi da viatura" maxLength={17} />
          </label>
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c] md:col-span-2">
            Marca
            <select
              className="oms-field"
              value={brand}
              onChange={(e) => {
                const next = e.target.value;
                setBrand(next);
                const lista = modelosDaMarca(next);
                if (model && !lista.some((item) => item.toLowerCase() === model.toLowerCase())) setModel("");
              }}
            >
              {brands.map((item) => <option key={item} value={item}>{item === "Todas" ? "Todas as marcas" : item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c] md:col-span-2">
            Modelo
            <select className="oms-field" value={model} onChange={(e) => setModel(e.target.value)}>
              <option value="">Todos os modelos</option>
              {models.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c]">
            Ano
            <select className="oms-field" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Todos</option>
              {anos.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c]">
            Mês
            <select className="oms-field" value={month} onChange={(e) => setMonth(e.target.value)}>
              <option value="">Todos</option>
              {meses.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c] md:col-span-2">
            Combustível
            <select className="oms-field" value={fuel} onChange={(e) => setFuel(e.target.value)}>
              <option value="">Todos</option>
              {fuels.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c]">
            Caixa
            <select className="oms-field" value={gearbox} onChange={(e) => setGearbox(e.target.value)}>
              <option value="">Todas</option>
              {caixas.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c]">
            Segmento
            <select className="oms-field" value={body} onChange={(e) => setBody(e.target.value)}>
              <option value="">Todos</option>
              {segmentos.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c]">
            Tração
            <select className="oms-field" value={drive} onChange={(e) => setDrive(e.target.value)}>
              <option value="">Todas</option>
              {tracoes.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className="grid gap-1 text-[11px] font-bold uppercase tracking-wide text-[#9d3d0c]">
            Portas
            <select className="oms-field" value={doors} onChange={(e) => setDoors(e.target.value)}>
              <option value="">Todas</option>
              {portas.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <div className="md:col-span-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#6f6256]">
              {marcasModelos.length} marcas e {marcasModelos.reduce((total, item) => total + item.modelos.length, 0)} modelos, lista importada do Standvirtual.
            </p>
            <button type="button" className="oms-btn-ghost !border-[#9d3d0c] !text-[#9d3d0c]" onClick={limpar}>Limpar pesquisa</button>
          </div>
          </div>
        </div>
      </section>

      <div className="oms-film" aria-hidden="true">
        <div className="oms-film-track">
          {[...fotos, ...fotos].map((foto, index) => (
            <img key={`${foto.src}-${index}`} src={foto.src} alt="" />
          ))}
        </div>
      </div>

      <section id="stock" className="grid gap-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="oms-kicker">No pátio agora</p>
            <h2 className="font-display text-4xl">{loading ? "A abrir o stock" : `${visiveis.length} peças`}</h2>
          </div>
        </div>
        {error ? <p className="oms-panel text-sm">{error}</p> : null}
        {!loading && visiveis.length === 0 ? (
          <div className="oms-panel">
            <p className="font-semibold">Nada no stock com estes critérios.</p>
            <p className="mt-1 text-sm text-[#6f6256]">As peças entram pela gestão e aparecem aqui. Não há catálogo inventado.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visiveis.map((part) => (
              <article key={`${part.source}-${part.id}`} className="oms-card">
                <Link href={`/peca/${part.source}-${part.id}`} className="block h-48 bg-[#2a231c]">
                  {part.image ? (
                    <img src={part.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <span className="grid h-full place-items-center font-display text-6xl text-[#9d3d0c]">
                      {(part.category || "MS").slice(0, 1)}
                    </span>
                  )}
                </Link>
                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div className="flex flex-wrap gap-2">
                    {part.brand ? <span className="oms-chip">{part.brand}</span> : null}
                    <span className="oms-chip">{textoEstado(part.status)}</span>
                  </div>
                  <Link href={`/peca/${part.source}-${part.id}`}>
                    <h3 className="text-lg font-bold leading-tight">{part.name}</h3>
                  </Link>
                  <p className="text-sm text-[#6f6256]">
                    {[part.model, [part.month, part.year].filter(Boolean).join(" "), part.fuel, part.gearbox].filter(Boolean).join(" · ") || "Origem por indicar"}
                  </p>
                  <p className="font-mono text-xs">
                    {[part.oem && `Ref. ${part.oem}`, part.vin && `VIN ${part.vin}`].filter(Boolean).join(" · ") || part.condition}
                  </p>
                  <div className="mt-auto flex items-center justify-between gap-3">
                    <span className="oms-price">{euros(part.price)}</span>
                    {podePedir(part) ? (
                      <button className="oms-btn" onClick={() => add(part)}>Pedir</button>
                    ) : (
                      <span className="text-sm font-semibold text-[#9d3d0c]">Reservada</span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section id="patio" className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="oms-panel">
          <p className="oms-kicker">O pátio</p>
          <h2 className="mt-2 font-display text-4xl">Peça única, carro de origem, estado dito como é.</h2>
          <p className="mt-3 max-w-xl text-[#6f6256]">
            Motor, caixa, ótica ou chapa: o que está no cartão é o que está no chão.
            Recolha no pátio ou envio com portes combinados. Oficinas e particulares pedem com NIF e morada.
          </p>
        </div>
        <div className="oms-hero !p-6">
          <p className="oms-kicker !text-[#f0a15a]">Como se pede</p>
          <ol className="mt-4 grid gap-3 text-lg">
            <li>1. Escolhes a peça pela referência ou pelo carro.</li>
            <li>2. O pedido fica registado, sem cobrança.</li>
            <li>3. O pátio confirma, reserva e combina o pagamento.</li>
          </ol>
        </div>
      </section>
    </main>
  );
}
