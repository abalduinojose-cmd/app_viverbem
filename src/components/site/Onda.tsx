// A onda do logo como divisor de seções — a assinatura visual da marca.
// cor: a cor da seção que vem DEPOIS da onda (a onda "entra" nela).
// invertida: vira a onda de cabeça para baixo (fim de uma seção escura).
export function Onda({
  cor = "#ffffff",
  invertida = false,
  className = "",
}: {
  cor?: string;
  invertida?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 64"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block w-full h-10 md:h-16 ${invertida ? "rotate-180" : ""} ${className}`}
    >
      <path
        d="M0 40 C 240 8, 480 56, 720 36 S 1200 10, 1440 34 L 1440 64 L 0 64 Z"
        fill={cor}
      />
    </svg>
  );
}
