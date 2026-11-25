import { Suspense } from "react";
import PecaFicha from "./ficha";

export default function PecaPage() {
  return (
    <Suspense fallback={<main className="oms-wrap py-10">A abrir a ficha...</main>}>
      <PecaFicha />
    </Suspense>
  );
}
