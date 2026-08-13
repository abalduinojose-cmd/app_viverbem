// Faixa de credibilidade entre o hero e o conteúdo.
// No desktop: os pilares da marca em colunas, com números e ícone.
// No celular: a mesma informação desliza em movimento contínuo.
const PILARES = [
  {
    destaque: "19",
    titulo: "anos de história",
    texto: "Tradição em Petrópolis desde 2007",
    icone: (
      <>
        <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 7.5v5l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
  {
    destaque: "3",
    titulo: "unidades",
    texto: "Centro, Corrêas e Posse",
    icone: (
      <>
        <path d="M12 21s7-5.4 7-11a7 7 0 1 0-14 0c0 5.6 7 11 7 11Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.6" />
      </>
    ),
  },
  {
    destaque: "100%",
    titulo: "sob medida",
    texto: "Cada fórmula na sua dosagem",
    icone: (
      <>
        <path d="M6 4.5h12M8 4.5v5.2L4.8 17a2.4 2.4 0 0 0 2.1 3.5h10.2A2.4 2.4 0 0 0 19.2 17L16 9.7V4.5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M6.6 14.5h10.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    destaque: "5,0",
    titulo: "no Google",
    texto: "A avaliação de quem já é cliente",
    icone: (
      <path
        d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    ),
  },
];

export function MarqueeMarca() {
  return (
    <section className="bg-[#10173f] text-white relative overflow-hidden">
      {/* Brilho suave ao fundo */}
      <div
        className="absolute -top-24 left-1/4 w-[36rem] h-[36rem] rounded-full bg-royal/25 blur-3xl"
        aria-hidden="true"
      />

      {/* Desktop: colunas com os pilares */}
      <div className="relative hidden md:grid max-w-7xl mx-auto px-8 py-10 grid-cols-4 gap-6">
        {PILARES.map((p, i) => (
          <div
            key={p.titulo}
            className={`flex items-start gap-4 ${
              i > 0 ? "border-l border-white/10 pl-6" : ""
            }`}
          >
            <span className="shrink-0 w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center text-white/80">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                {p.icone}
              </svg>
            </span>
            <div>
              <p className="font-display text-2xl font-semibold leading-none">
                {p.destaque}{" "}
                <span className="text-base font-normal italic text-white/70">{p.titulo}</span>
              </p>
              <p className="text-white/55 text-sm mt-1.5 leading-snug">{p.texto}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Celular: a mesma informação em movimento */}
      <div className="relative md:hidden py-4 overflow-hidden" aria-hidden="true">
        <div className="marquee-faixa">
          {[0, 1].map((repeticao) => (
            <div key={repeticao} className="flex shrink-0">
              {PILARES.map((p) => (
                <span key={p.titulo} className="flex items-center shrink-0 px-5">
                  <span className="font-display text-lg font-semibold whitespace-nowrap">
                    {p.destaque}{" "}
                    <span className="font-normal italic text-white/70">{p.titulo}</span>
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-escarlate ml-5" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
