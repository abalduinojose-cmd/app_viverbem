// Faixa deslizante com as palavras da marca, separadas pela onda.
// Dá movimento e identidade entre o hero e o conteúdo.
const PALAVRAS = [
  "Manipulação",
  "Homeopatia",
  "Dermocosméticos",
  "Fórmulas sob medida",
  "Há 19 anos em Petrópolis",
  "Vitaminas e suplementos",
];

function Sequencia() {
  return (
    <>
      {PALAVRAS.map((p) => (
        <span key={p} className="flex items-center shrink-0">
          <span className="font-display text-lg md:text-xl italic text-white/90 px-6 md:px-8 whitespace-nowrap">
            {p}
          </span>
          <svg width="34" height="12" viewBox="0 0 34 12" aria-hidden="true" className="shrink-0">
            <path
              d="M2 8 C 8 3, 14 10, 20 6 S 30 3, 32 6"
              fill="none"
              stroke="#E02129"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </span>
      ))}
    </>
  );
}

export function MarqueeMarca() {
  return (
    <div className="bg-[#10173f] py-4 overflow-hidden" aria-hidden="true">
      <div className="marquee-faixa">
        <Sequencia />
        <Sequencia />
      </div>
    </div>
  );
}
