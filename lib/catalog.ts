import { supabase } from "@/lib/supabase";

export type PartSource = "parts" | "products";

export type Part = {
  id: string;
  source: PartSource;
  name: string;
  brand: string;
  model: string;
  year: string;
  month: string;
  fuel: string;
  gearbox: string;
  body: string;
  drive: string;
  doors: string;
  oem: string;
  vin: string;
  category: string;
  price: number;
  condition: string;
  image: string;
  side: string;
  km: string;
  engine: string;
  donor: string;
  warranty: string;
  description: string;
  status: string;
};

export type PartDraft = Omit<Part, "id" | "source">;

export const emptyDraft: PartDraft = {
  name: "",
  brand: "",
  model: "",
  year: "",
  month: "",
  fuel: "Diesel",
  gearbox: "",
  body: "",
  drive: "",
  doors: "",
  oem: "",
  vin: "",
  category: "Motor",
  price: 0,
  condition: "Usado",
  image: "",
  side: "",
  km: "",
  engine: "",
  donor: "",
  warranty: "",
  description: "",
  status: "disponivel",
};

export function euros(value: number) {
  return new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" }).format(value || 0);
}

export function visivelNoCatalogo(part: Part) {
  return part.status !== "vendida";
}

export function podePedir(part: Part) {
  return !part.status || part.status === "disponivel";
}

export function textoEstado(status: string) {
  if (status === "reservada") return "Reservada";
  if (status === "vendida") return "Vendida";
  return "Disponível";
}

function texto(value: unknown) {
  return value == null ? "" : String(value);
}

function vinNaDescricao(description: string) {
  const match = description.match(/VIN:\s*([A-HJ-NPR-Z0-9]{6,17})/i);
  return match?.[1]?.toUpperCase() || "";
}

function campoNaDescricao(description: string, label: string) {
  const match = description.match(new RegExp(`^${label}:\\s*(.+)$`, "im"));
  return match?.[1]?.trim() || "";
}

function normalize(row: Record<string, unknown>, source: PartSource): Part {
  const brand = typeof row.brand === "string" ? row.brand : "";
  const category = typeof row.category === "string" ? row.category : "";
  return {
    id: texto(row.id),
    source,
    name: texto(row.name || row.title || "Peça sem nome"),
    brand,
    model: texto(row.model),
    year: texto(row.year),
    month: texto(row.month) || campoNaDescricao(texto(row.description), "Mês"),
    fuel: texto(row.fuel),
    gearbox: texto(row.gearbox) || campoNaDescricao(texto(row.description), "Caixa"),
    body: texto(row.body) || campoNaDescricao(texto(row.description), "Segmento"),
    drive: texto(row.drive) || campoNaDescricao(texto(row.description), "Tração"),
    doors: texto(row.doors) || campoNaDescricao(texto(row.description), "Portas"),
    oem: texto(row.oem || row.reference_oem),
    vin: texto(row.vin || row.chassis) || vinNaDescricao(texto(row.description)),
    category,
    price: Number(row.price) || 0,
    condition: texto(row.condition || "Usado"),
    image: texto(row.image || row.image_url),
    side: texto(row.side),
    km: texto(row.km),
    engine: texto(row.engine || row.engine_code),
    donor: texto(row.donor),
    warranty: texto(row.warranty),
    description: texto(row.description),
    status: texto(row.status || "disponivel"),
  };
}

function comTempo<T>(promise: PromiseLike<T>, ms = 10000) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("A base de dados não respondeu. Tenta outra vez.")), ms);
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

export async function fetchStock() {
  let partsRes: { data: unknown[] | null; error: { message: string } | null };
  let productsRes: { data: unknown[] | null; error: { message: string } | null };
  try {
    [partsRes, productsRes] = await comTempo(Promise.all([
      supabase.from("parts").select("*"),
      supabase.from("products").select("*"),
    ]));
  } catch (error) {
    return { parts: [] as Part[], error: error instanceof Error ? error.message : "Sem ligação ao stock." };
  }

  const parts = ((partsRes.data || []) as Record<string, unknown>[]).map((row) => normalize(row, "parts"));
  const fromProducts = ((productsRes.data || []) as Record<string, unknown>[]).map((row) => normalize(row, "products"));
  const ids = new Set(parts.map((part) => part.id));
  const merged = [...parts, ...fromProducts.filter((part) => !ids.has(part.id))].sort((a, b) =>
    a.name.localeCompare(b.name, "pt")
  );

  const error = !partsRes.data && partsRes.error && !productsRes.data
    ? partsRes.error.message
    : "";

  return { parts: merged, error };
}

function linha(description: string, label: string, value: string) {
  if (!value || new RegExp(`^${label}:`, "im").test(description)) return "";
  return `${label}: ${value}`;
}

function notas(input: PartDraft) {
  const description = input.description.trim();
  return [
    description,
    linha(description, "Mês", input.month),
    linha(description, "Caixa", input.gearbox),
    linha(description, "Segmento", input.body),
    linha(description, "Tração", input.drive),
    linha(description, "Portas", input.doors),
    linha(description, "Lado", input.side),
    linha(description, "Quilómetros", input.km),
    linha(description, "Motor", input.engine),
    linha(description, "VIN", input.vin),
    linha(description, "Viatura de origem", input.donor),
    linha(description, "Garantia", input.warranty),
  ]
    .filter(Boolean)
    .join("\n");
}

function partRow(input: PartDraft) {
  return {
    name: input.name.trim(),
    brand: input.brand.trim(),
    model: input.model.trim(),
    year: input.year.trim(),
    month: input.month,
    fuel: input.fuel,
    gearbox: input.gearbox,
    body: input.body,
    drive: input.drive,
    doors: input.doors,
    oem: input.oem.trim(),
    vin: input.vin.trim().toUpperCase(),
    category: input.category.trim(),
    price: Number(input.price) || 0,
    condition: input.condition,
    image: input.image.trim(),
    side: input.side,
    km: input.km.trim(),
    engine: input.engine.trim(),
    donor: input.donor.trim(),
    warranty: input.warranty.trim(),
    description: notas(input),
    status: input.status || "disponivel",
  };
}

function productRow(input: PartDraft) {
  return {
    title: input.name.trim(),
    model: input.model.trim(),
    year: input.year ? Number(input.year) : null,
    reference_oem: input.oem.trim(),
    price: Number(input.price) || 0,
    condition: input.condition,
    image_url: input.image.trim(),
    description: notas(input),
    status: input.status || "disponivel",
  };
}

async function writeFlexible(
  op: "insert" | "update",
  table: string,
  row: Record<string, unknown>,
  id?: string
) {
  const payload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    if (value !== "" && value !== undefined && value !== null) payload[key] = value;
  }

  const dropped: string[] = [];
  let last = "Não foi possível gravar.";

  for (let attempt = 0; attempt < 16; attempt += 1) {
    const query =
      op === "insert"
        ? supabase.from(table).insert([payload]).select("id").single()
        : supabase.from(table).update(payload).eq("id", id).select("id").single();
    const { data, error } = await query;
    if (!error) return { id: String((data as { id?: string } | null)?.id || id || ""), dropped };

    last = error.message;
    const missing = error.message.match(/Could not find the '([^']+)' column/);
    if (missing && missing[1] in payload) {
      dropped.push(missing[1]);
      delete payload[missing[1]];
      continue;
    }
    if (/invalid input syntax for type integer/i.test(error.message) && typeof payload.year === "string") {
      payload.year = Number(payload.year);
      continue;
    }
    break;
  }

  return { error: last, dropped };
}

export async function savePart(input: PartDraft) {
  const onParts = await writeFlexible("insert", "parts", partRow(input));
  if (!onParts.error) return onParts;
  return writeFlexible("insert", "products", productRow(input));
}

export async function updatePart(part: Pick<Part, "id" | "source">, input: Partial<PartDraft>) {
  const draft = { ...emptyDraft, ...input };
  const table = part.source === "products" ? "products" : "parts";
  const row = part.source === "products" ? productRow(draft) : partRow(draft);
  const patch: Record<string, unknown> = {};
  for (const key of Object.keys(input) as (keyof PartDraft)[]) {
    if (key in row) patch[key === "name" && part.source === "products" ? "title" : key] = row[key as keyof typeof row];
  }
  if (part.source === "products") {
    if ("name" in input) patch.title = draft.name;
    if ("oem" in input) patch.reference_oem = draft.oem;
    if ("image" in input) patch.image_url = draft.image;
    delete patch.name;
    delete patch.oem;
    delete patch.image;
  }
  return writeFlexible("update", table, patch, part.id);
}

export async function removePart(part: Pick<Part, "id" | "source">) {
  const table = part.source === "products" ? "products" : "parts";
  const { error } = await supabase.from(table).delete().eq("id", part.id);
  return { error: error?.message || "" };
}

export type Pedido = {
  email: string;
  name: string;
  phone: string;
  nif: string;
  address: string;
  delivery: "ship" | "pickup";
  payment: "mbway" | "transferencia" | "recolha";
  note: string;
  items: Part[];
  userId: string | null;
};

export async function placeOrder(pedido: Pedido) {
  const total = pedido.items.reduce((sum, item) => sum + item.price, 0);
  const row: Record<string, unknown> = {
    user_id: pedido.userId,
    customer_email: pedido.email,
    customer_name: pedido.name,
    customer_phone: pedido.phone,
    customer_nif: pedido.nif,
    shipping_address: pedido.address,
    items: pedido.items.map((item) => ({
      id: item.id,
      source: item.source,
      name: item.name,
      oem: item.oem,
      price: item.price,
      image: item.image,
      brand: item.brand,
      model: item.model,
    })),
    delivery_method: pedido.delivery,
    total_price: total,
    payment_method: pedido.payment,
    mbway_number: pedido.payment === "mbway" ? pedido.phone : "",
    status: "Pedido recebido",
    notes: pedido.note,
  };

  const saved = await writeFlexible("insert", "orders", row);
  if (saved.error) return saved;

  await Promise.all(pedido.items.map((item) => updatePart(item, { status: "reservada" })));
  return saved;
}

export async function updateOrderStatus(id: string, status: string, items: Part[]) {
  const saved = await writeFlexible("update", "orders", { status }, id);
  if (saved.error) return saved;
  const next = status === "Cancelada" ? "disponivel" : status === "Pedido recebido" || status === "Reservada" ? "reservada" : "vendida";
  await Promise.all(items.filter((item) => item.id && item.source).map((item) => updatePart(item, { status: next })));
  return saved;
}
