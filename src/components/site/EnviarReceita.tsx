// "Envie a sua receita" — o caminho de quem chega com a prescrição do
// médico na mão.
//
// ATENÇÃO AO TEXTO DESTA SEÇÃO. Farmácia de manipulação segue regras
// próprias de comunicação (RDC 67/2007 e RDC 96/2008), então o texto
// aqui é deliberadamente descritivo, e não promocional:
//   - fala em PRESCRIÇÃO, nunca em comprar manipulado sem receita;
//   - descreve o PROCESSO (avaliação farmacêutica, preparo, prazo),
//     nunca resultado, eficácia ou benefício de saúde;
//   - não compara com industrializado nem sugere trocar/ajustar o que
//     o médico prescreveu;
//   - não menciona nome de ativo, indicação ou preço.
// Antes de mexer, confirme com o farmacêutico responsável da loja.
import { WHATSAPP_NUMERO, WHATSAPP_LOJA } from "@/lib/tipos";

const MENSAGEM =
  "Olá! Gostaria de enviar a minha receita para avaliação e orçamento.";

const LINK = `https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent(MENSAGEM)}`;

const PASSOS = [
  {
    titulo: "Fotografe a receita",
    texto: "Com a folha inteira aparecendo e o texto legível.",
  },
  {
    titulo: "Envie no WhatsApp",
    texto: "A mensagem já vai escrita, é só anexar a foto.",
  },
  {
    titulo: "Aguarde a avaliação",
    texto: "O farmacêutico analisa a prescrição e retorna com valor e prazo.",
  },
];

// Descrição do processo, não do resultado
const COMO_FUNCIONA = [
  "Cada preparação é feita individualmente, conforme a prescrição",
  "A receita passa por avaliação farmacêutica antes do preparo",
  "O preparo começa depois do pedido, não fica pronto na prateleira",
  "O rótulo sai com o seu nome, a composição e a validade",
];

export function EnviarReceita() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Como funciona a manipulação */}
        <div className="bg-royal-nevoa border border-linha rounded-[2rem] px-6 md:px-10 py-10 md:py-12">
          <p className="selo-secao text-escarlate">como funciona</p>
          <h2 className="font-display text-3xl md:text-[2.4rem] font-semibold text-grafite leading-[1.1] mt-2">
            Do papel até
            <br />
            <span className="italic text-royal">a sua mão</span>
          </h2>
          <p className="text-grafite-medio text-base md:text-lg leading-relaxed mt-4">
            O medicamento manipulado é preparado sob prescrição de profissional
            habilitado, na dose e na forma farmacêutica que constam da receita.
          </p>

          <ul className="flex flex-col gap-3 mt-7">
            {COMO_FUNCIONA.map((item) => (
              <li key={item} className="flex items-start gap-3 text-grafite">
                <span className="shrink-0 w-6 h-6 rounded-full bg-white border border-linha text-royal flex items-center justify-center mt-0.5">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enviar a receita */}
        <div className="relative bg-noite text-white rounded-[2rem] px-6 md:px-10 py-10 md:py-12 overflow-hidden flex flex-col">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(100% 70% at 0% 0%, rgba(47,124,196,0.42), transparent 60%), radial-gradient(80% 60% at 100% 100%, rgba(224,33,41,0.22), transparent 60%)",
            }}
          />

          <div className="relative">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-3.5 py-1.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-white/70">
                <path
                  d="M7.5 3.5h9a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />
                <path d="M9 8.5h6M9 12h6M9 15.5h3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <span className="text-xs font-medium text-white/80">mediante prescrição</span>
            </span>

            <h2 className="font-display text-3xl md:text-[2.4rem] font-semibold leading-[1.1] mt-4">
              Envie a sua
              <br />
              <span className="italic">receita</span>
            </h2>
            <p className="text-white/65 text-base md:text-lg leading-relaxed mt-4">
              Mande a foto da prescrição pelo WhatsApp. O farmacêutico avalia e retorna
              com o orçamento e o prazo de preparo.
            </p>

            <ol className="flex flex-col gap-4 mt-8">
              {PASSOS.map((p, i) => (
                <li key={p.titulo} className="flex items-start gap-3.5">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-white/10 ring-1 ring-white/20 text-white/80 flex items-center justify-center text-[0.7rem] font-bold">
                    {i + 1}
                  </span>
                  <span className="-mt-0.5">
                    <span className="block font-medium text-white/90">{p.titulo}</span>
                    <span className="block text-white/50 text-sm leading-snug mt-0.5">
                      {p.texto}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>

          <a
            href={LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="relative mt-8 inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1eb857] text-white text-lg font-semibold rounded-2xl px-6 py-4 transition-colors active:scale-[0.98] shadow-[0_10px_30px_rgba(37,211,102,0.25)]"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="shrink-0">
              <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.5 14.2c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.1c.1.2.1.4 0 .6l-.4.6-.5.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1.1 2.1 1.4 2.5 1.6.3.1.5.1.6-.1l.8-1c.2-.3.4-.2.7-.1l2.1 1c.3.1.5.2.6.4 0-.1 0 .6-.2 1.3Z" />
            </svg>
            Enviar receita no WhatsApp
          </a>

          {/* Aviso legal, discreto mas presente */}
          <p className="relative text-white/40 text-xs leading-relaxed mt-4">
            {WHATSAPP_LOJA} · Medicamentos manipulados são preparados somente mediante
            prescrição de profissional habilitado, dentro da validade. A sua receita e os
            seus dados ficam apenas com a nossa equipe.
          </p>
        </div>
      </div>
    </section>
  );
}
