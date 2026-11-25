"use client";

import { FormEvent, useEffect, useState } from "react";
import { emptyDraft, savePart, updatePart, type Part, type PartDraft } from "@/lib/catalog";
import { anos, caixas, combustiveis, marcasModelos, meses, modelosDaMarca, portas, segmentos, tracoes } from "@/lib/veiculos";

const categorias = ["Motor", "Caixa", "Iluminação", "Chaparia", "Suspensão", "Travões", "Interior", "Elétrica", "Outra"];

function comAtual(lista: string[], atual: string) {
  if (atual && !lista.some((item) => item.toLowerCase() === atual.toLowerCase())) return [atual, ...lista];
  return lista;
}

export default function StockForm({
  initial,
  onSaved,
}: {
  initial?: Part | null;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<PartDraft>(emptyDraft);
  const [erro, setErro] = useState("");
  const [aGuardar, setAGuardar] = useState(false);

  useEffect(() => {
    if (!initial) {
      setForm(emptyDraft);
      return;
    }
    const { id: _id, source: _source, ...draft } = initial;
    setForm(draft);
  }, [initial]);

  function set<K extends keyof PartDraft>(key: K, value: PartDraft[K]) {
    setForm((atual) => ({ ...atual, [key]: value }));
  }

  function mudarMarca(marca: string) {
    setForm((atual) => {
      const lista = modelosDaMarca(marca);
      const model = lista.some((item) => item.toLowerCase() === atual.model.toLowerCase()) ? atual.model : "";
      return { ...atual, brand: marca, model };
    });
  }

  async function submeter(event: FormEvent) {
    event.preventDefault();
    setAGuardar(true);
    setErro("");
    const result = initial ? await updatePart(initial, form) : await savePart(form);
    setAGuardar(false);
    if (result.error) {
      setErro(result.error);
      return;
    }
    setForm(emptyDraft);
    onSaved();
  }

  return (
    <form className="grid gap-3" onSubmit={submeter}>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="oms-label md:col-span-2">Peça
          <input required className="oms-field" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Motor 1.9 TDI, ótica esquerda..." />
        </label>
        <label className="oms-label">Marca
          <select required className="oms-field" value={form.brand} onChange={(e) => mudarMarca(e.target.value)}>
            <option value="">Escolher</option>
            {comAtual(marcasModelos.map((item) => item.marca), form.brand).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="oms-label">Modelo
          <select className="oms-field" value={form.model} onChange={(e) => set("model", e.target.value)} disabled={!form.brand}>
            <option value="">{form.brand ? "Escolher" : "Escolhe a marca"}</option>
            {comAtual(form.brand ? modelosDaMarca(form.brand) : [], form.model).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="oms-label">Ano
          <select className="oms-field" value={form.year} onChange={(e) => set("year", e.target.value)}>
            <option value="">Escolher</option>
            {comAtual(anos, form.year).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="oms-label">Mês
          <select className="oms-field" value={form.month} onChange={(e) => set("month", e.target.value)}>
            <option value="">Escolher</option>
            {meses.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="oms-label">Combustível
          <select className="oms-field" value={form.fuel} onChange={(e) => set("fuel", e.target.value)}>
            {comAtual(combustiveis, form.fuel).map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="oms-label">Caixa
          <select className="oms-field" value={form.gearbox} onChange={(e) => set("gearbox", e.target.value)}>
            <option value="">Escolher</option>
            {caixas.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="oms-label">Segmento
          <select className="oms-field" value={form.body} onChange={(e) => set("body", e.target.value)}>
            <option value="">Escolher</option>
            {segmentos.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="oms-label">Tração
          <select className="oms-field" value={form.drive} onChange={(e) => set("drive", e.target.value)}>
            <option value="">Escolher</option>
            {tracoes.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="oms-label">Portas
          <select className="oms-field" value={form.doors} onChange={(e) => set("doors", e.target.value)}>
            <option value="">Escolher</option>
            {portas.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="oms-label">Categoria
          <select className="oms-field" value={form.category} onChange={(e) => set("category", e.target.value)}>
            {categorias.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label className="oms-label">Referência OEM
          <input className="oms-field" value={form.oem} onChange={(e) => set("oem", e.target.value)} placeholder="03G100031X" />
        </label>
        <label className="oms-label">VIN da viatura
          <input className="oms-field" value={form.vin} onChange={(e) => set("vin", e.target.value.toUpperCase())} placeholder="WVWZZZ1KZ6W000000" maxLength={17} />
        </label>
        <label className="oms-label">Lado
          <select className="oms-field" value={form.side} onChange={(e) => set("side", e.target.value)}>
            <option value="">Não se aplica</option>
            <option>Esquerdo</option>
            <option>Direito</option>
          </select>
        </label>
        <label className="oms-label">Código do motor
          <input className="oms-field" value={form.engine} onChange={(e) => set("engine", e.target.value)} />
        </label>
        <label className="oms-label">Quilómetros
          <input className="oms-field" value={form.km} onChange={(e) => set("km", e.target.value)} />
        </label>
        <label className="oms-label">Viatura de origem
          <input className="oms-field" value={form.donor} onChange={(e) => set("donor", e.target.value)} />
        </label>
        <label className="oms-label">Garantia
          <input className="oms-field" value={form.warranty} onChange={(e) => set("warranty", e.target.value)} placeholder="14 dias, testado à bancada..." />
        </label>
        <label className="oms-label">Preço €
          <input required type="number" min="0" step="0.01" className="oms-field" value={form.price || ""} onChange={(e) => set("price", Number(e.target.value))} />
        </label>
        <label className="oms-label">Estado da peça
          <select className="oms-field" value={form.condition} onChange={(e) => set("condition", e.target.value)}>
            <option>Usado</option>
            <option>Testado</option>
            <option>Recondicionado</option>
            <option>Para peças</option>
          </select>
        </label>
        <label className="oms-label">Situação no stock
          <select className="oms-field" value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="disponivel">Disponível</option>
            <option value="reservada">Reservada</option>
            <option value="vendida">Vendida</option>
          </select>
        </label>
        <label className="oms-label md:col-span-2">Foto (endereço da imagem)
          <input className="oms-field" value={form.image} onChange={(e) => set("image", e.target.value)} placeholder="https://..." />
        </label>
        <label className="oms-label md:col-span-2">Notas
          <textarea rows={3} className="oms-field" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </label>
      </div>
      {erro ? <p className="text-sm text-[#9d3d0c]">{erro}</p> : null}
      <button className="oms-btn w-fit" disabled={aGuardar}>{aGuardar ? "A gravar..." : initial ? "Atualizar peça" : "Meter no stock"}</button>
    </form>
  );
}
