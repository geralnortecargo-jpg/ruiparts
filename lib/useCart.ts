"use client";

import { useEffect, useState } from "react";
import type { Part } from "@/lib/catalog";

const KEY = "oms-cart";

function read(): Part[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function openCart() {
  window.dispatchEvent(new Event("oms-open-cart"));
}

export function useCart() {
  const [cart, setCart] = useState<Part[]>([]);

  useEffect(() => {
    const sync = () => setCart(read());
    sync();
    window.addEventListener("oms-cart", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("oms-cart", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  function write(next: Part[]) {
    localStorage.setItem(KEY, JSON.stringify(next));
    setCart(next);
    window.dispatchEvent(new Event("oms-cart"));
  }

  return {
    cart,
    add(part: Part) {
      const current = read();
      if (!current.some((item) => item.id === part.id)) write([...current, part]);
      openCart();
    },
    remove(id: string) {
      write(read().filter((item) => item.id !== id));
    },
    clear() {
      write([]);
    },
  };
}
