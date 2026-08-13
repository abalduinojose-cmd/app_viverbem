// Peças repetidas do painel, para as telas não divergirem.
// Antes cada uma tinha o seu próprio cabeçalho (text-2xl aqui,
// text-3xl bold ali), o que dava a sensação de telas de épocas
// diferentes.

/** Cabeçalho padrão de página: título, explicação e ação à direita. */
export function CabecalhoAdmin({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-grafite tracking-tight">
          {titulo}
        </h1>
        {descricao && (
          <p className="text-grafite-claro text-sm md:text-base mt-1">{descricao}</p>
        )}
      </div>
      {acao}
    </div>
  );
}

/** Cartão branco padrão (borda fina, sem sombra pesada). */
export function CartaoAdmin({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-linha ${className}`}>{children}</div>
  );
}

/** Número de destaque dos resumos. */
export function CartaoNumero({
  rotulo,
  valor,
  cor = "text-grafite",
}: {
  rotulo: string;
  valor: string | number;
  cor?: string;
}) {
  return (
    <CartaoAdmin className="px-4 py-3.5 md:px-5 md:py-4">
      <p className="text-[0.65rem] md:text-xs font-semibold tracking-wider uppercase text-grafite-claro leading-tight">
        {rotulo}
      </p>
      <p className={`font-display text-2xl md:text-3xl font-semibold tracking-tight mt-1 tabular-nums ${cor}`}>
        {valor}
      </p>
    </CartaoAdmin>
  );
}

/** Chave liga/desliga de verdade, no lugar do botão colorido antigo.
 *  A cor só aparece quando está ligada, o que deixa a leitura da
 *  lista bem mais calma. */
export function Interruptor({
  ligado,
  rotulo,
  aoAlternar,
  desabilitado = false,
  cor = "royal",
}: {
  ligado: boolean;
  rotulo: string;
  aoAlternar: () => void;
  desabilitado?: boolean;
  cor?: "royal" | "verde" | "escarlate";
}) {
  const fundo = {
    royal: "bg-royal",
    verde: "bg-green-600",
    escarlate: "bg-escarlate",
  }[cor];

  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      onClick={aoAlternar}
      disabled={desabilitado}
      className="group flex items-center gap-2 min-h-10 py-2 disabled:opacity-50 transition-opacity"
    >
      <span
        className={`relative w-9 h-5 rounded-full shrink-0 transition-colors ${
          ligado ? fundo : "bg-grafite-claro/35 group-hover:bg-grafite-claro/55"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
            ligado ? "translate-x-4" : ""
          }`}
        />
      </span>
      <span
        className={`text-xs font-medium transition-colors ${
          ligado ? "text-grafite" : "text-grafite-claro"
        }`}
      >
        {rotulo}
      </span>
    </button>
  );
}

/** Estado vazio com explicação e, quando fizer sentido, uma saída. */
export function VazioAdmin({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 gap-3">
      <span className="w-14 h-14 rounded-2xl bg-royal-claro text-royal flex items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <div>
        <p className="font-semibold text-grafite">{titulo}</p>
        {descricao && <p className="text-grafite-claro text-sm mt-1">{descricao}</p>}
      </div>
      {acao}
    </div>
  );
}
