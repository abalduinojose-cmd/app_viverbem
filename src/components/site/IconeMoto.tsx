// Moto de entrega — as entregas da Viver Bem são feitas de moto,
// então este ícone substituiu o de caminhão em todo o site.
export function IconeMoto({ tamanho = 24 }: { tamanho?: number }) {
  return (
    <svg
      width={tamanho}
      height={tamanho}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* rodas */}
      <circle cx="5.2" cy="16.8" r="3.2" />
      <circle cx="18.8" cy="16.8" r="3.2" />
      {/* quadro: da roda de trás, sobe no banco e segue até a coluna */}
      <path d="M5.2 16.8h6.6L8.6 11.4h5.8l2-3" />
      {/* guidão */}
      <path d="M14.8 7.6h3.4" />
      {/* garfo dianteiro */}
      <path d="M16.6 9.1 18.8 16.8" />
    </svg>
  );
}
