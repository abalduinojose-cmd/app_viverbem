// Faixa de credibilidade entre o hero e o conteúdo, no modelo
// "número grande em degradê + rótulo pequeno embaixo", sobre fundo
// claro. Cada coluna entra em cascata quando aparece na tela — no
// celular, isso acontece conforme a pessoa rola.
import { Revelar } from "./Revelar";
import {
  ANOS_TRADICAO,
  UNIDADES,
  AVALIACOES_GOOGLE_TOTAL,
} from "@/lib/tipos";

const DADOS = [
  {
    numero: `+${ANOS_TRADICAO}`,
    unidade: "anos",
    rotulo: "de tradição em Petrópolis",
  },
  {
    numero: `${UNIDADES.length}`,
    unidade: "unidades",
    rotulo: "Centro, Corrêas e Posse",
  },
  {
    numero: `+${AVALIACOES_GOOGLE_TOTAL}`,
    unidade: "avaliações",
    rotulo: "com nota 5,0 no Google",
  },
  {
    numero: "100%",
    unidade: "sob medida",
    rotulo: "cada fórmula na sua dosagem",
  },
];

export function MarqueeMarca() {
  return (
    <section className="bg-white border-b border-linha">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
        {DADOS.map((d, i) => (
          <Revelar key={d.rotulo} atraso={i * 130}>
            <div>
              <p className="font-display font-semibold leading-none whitespace-nowrap">
                <span className="texto-degrade text-4xl md:text-5xl tracking-tight tabular-nums">
                  {d.numero}
                </span>{" "}
                <span className="texto-degrade text-2xl md:text-3xl italic">
                  {d.unidade}
                </span>
              </p>
              <p className="text-grafite-claro text-sm md:text-base mt-2.5 leading-snug">
                {d.rotulo}
              </p>
            </div>
          </Revelar>
        ))}
      </div>
    </section>
  );
}
