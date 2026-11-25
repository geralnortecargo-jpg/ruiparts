import dados from "@/data/marcas-modelos.json";

export type MarcaModelos = {
  marca: string;
  modelos: string[];
};

export const marcasModelos: MarcaModelos[] = (dados.marcas as MarcaModelos[]).filter(
  (item) => item.marca !== "Outra não listada"
);

export function modelosDaMarca(marca: string) {
  if (!marca || marca === "Todas") {
    return [...new Set(marcasModelos.flatMap((item) => item.modelos))];
  }
  const encontrada = marcasModelos.find((item) => item.marca.toLowerCase() === marca.toLowerCase());
  return encontrada?.modelos ?? [];
}

export const anos = Array.from({ length: 2027 - 1900 + 1 }, (_, index) => String(2027 - index));

export const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const combustiveis = [
  "Diesel",
  "Gasolina",
  "Elétrico",
  "GNC",
  "GPL",
  "Híbrido (Diesel)",
  "Híbrido (Gasolina)",
  "Híbrido Plug-In",
  "Hidrogénio",
];

export const caixas = ["Manual", "Automática"];

export const segmentos = [
  "Cabrio",
  "Carrinha",
  "Citadino",
  "Coupé",
  "Monovolume",
  "Pequeno citadino",
  "Sedan",
  "SUV / TT",
  "Utilitário",
];

export const tracoes = ["Integral", "Tracção dianteira", "Tracção traseira"];

export const portas = ["1", "2", "3", "4", "5", "6"];
