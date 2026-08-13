"use client";
// Revela o conteúdo suavemente quando ele entra na tela (rolagem).
// Respeita "reduzir movimento" via CSS (ver globals.css .revelar).
import { useEffect, useRef, useState } from "react";

export function Revelar({
  children,
  atraso = 0,
  className = "",
}: {
  children: React.ReactNode;
  atraso?: number; // ms, para escalonar elementos vizinhos
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas[0].isIntersecting) {
          setVisivel(true);
          observador.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`revelar ${visivel ? "visivel" : ""} ${className}`}
      style={atraso ? { transitionDelay: `${atraso}ms` } : undefined}
    >
      {children}
    </div>
  );
}
