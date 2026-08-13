// /admin — painel inicial, EXCLUSIVO DO GESTOR.
// O operador não vê números do negócio: cai direto nos produtos.
import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/sessao";
import { obterMetricas } from "@/lib/metricas";
import { PAPEL_ADMIN } from "@/lib/tipos";
import { formatarPreco } from "@/lib/preco";
import { CabecalhoAdmin } from "@/components/admin/PecasAdmin";

export const dynamic = "force-dynamic";

function formatarData(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Selo de variação contra o mês passado
function Variacao({ valor }: { valor: number | null }) {
  if (valor === null) return null;
  const subiu = valor > 0;
  const parado = valor === 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold rounded-full px-2 py-0.5 ${
        parado
          ? "bg-royal-nevoa text-grafite-claro"
          : subiu
            ? "bg-green-50 text-green-700"
            : "bg-escarlate/10 text-escarlate"
      }`}
    >
      {!parado && (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d={subiu ? "M12 19V5m0 0-6 6m6-6 6 6" : "M12 5v14m0 0 6-6m-6 6-6-6"}
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {subiu ? "+" : ""}
      {valor}%
    </span>
  );
}

function Cartao({
  rotulo,
  valor,
  apoio,
  variacao,
}: {
  rotulo: string;
  valor: string;
  apoio?: string;
  variacao?: number | null;
}) {
  return (
    <div className="bg-white rounded-2xl border border-linha p-4 md:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.65rem] md:text-xs font-semibold tracking-wider uppercase text-grafite-claro leading-tight">
          {rotulo}
        </p>
        {variacao !== undefined && <Variacao valor={variacao} />}
      </div>
      <p className="font-display text-2xl md:text-3xl font-semibold text-grafite tracking-tight mt-2 tabular-nums">
        {valor}
      </p>
      {apoio && <p className="text-grafite-claro text-xs mt-1">{apoio}</p>}
    </div>
  );
}

export default async function PaginaPainel() {
  const sessao = await obterSessao();
  if (sessao.papel !== PAPEL_ADMIN) redirect("/admin/produtos");

  const m = await obterMetricas();
  const mes = new Date().toLocaleDateString("pt-BR", { month: "long" });
  const totalAlertas =
    m.alertas.inativos + m.alertas.semFoto + m.alertas.semPreco + m.alertas.semCategoria;

  return (
    <div className="max-w-5xl">
      <CabecalhoAdmin
        titulo={`Olá, ${(sessao.nome ?? "").split(" ")[0]}`}
        descricao={`Como está o mês de ${mes} na Viver Bem.`}
      />

      {/* Números do mês */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <Cartao
          rotulo="Pedidos no mês"
          valor={String(m.pedidosMes)}
          variacao={m.pedidosVariacao}
          apoio={`${m.totalPedidos} desde o início`}
        />
        <Cartao
          rotulo="Faturamento"
          valor={formatarPreco(m.faturamentoMes)}
          variacao={m.faturamentoVariacao}
          apoio="pedidos enviados pelo site"
        />
        <Cartao rotulo="Ticket médio" valor={formatarPreco(m.ticketMedio)} />
        <Cartao
          rotulo="Clientes no mês"
          valor={String(m.clientesUnicos)}
          apoio="WhatsApps diferentes"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Mais pedidos */}
        <div className="bg-white rounded-2xl border border-linha p-5">
          <h2 className="font-semibold text-grafite">Mais pedidos no mês</h2>
          {m.maisPedidos.length === 0 ? (
            <p className="text-grafite-claro text-sm mt-3">
              Nenhum pedido ainda neste mês.
            </p>
          ) : (
            <ul className="flex flex-col gap-2.5 mt-4">
              {m.maisPedidos.map((p, i) => {
                const maior = m.maisPedidos[0].quantidade;
                return (
                  <li key={p.nome}>
                    <div className="flex items-baseline justify-between gap-3 text-sm">
                      <span className="text-grafite truncate">
                        <span className="text-grafite-claro tabular-nums mr-1.5">{i + 1}.</span>
                        {p.nome}
                      </span>
                      <span className="font-semibold text-grafite tabular-nums shrink-0">
                        {p.quantidade}
                      </span>
                    </div>
                    {/* Barra proporcional ao campeão */}
                    <div className="h-1.5 bg-royal-nevoa rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full degrade-marca rounded-full"
                        style={{ width: `${Math.round((p.quantidade / maior) * 100)}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Como os clientes recebem */}
        <div className="bg-white rounded-2xl border border-linha p-5">
          <h2 className="font-semibold text-grafite">Como recebem o pedido</h2>
          {m.entregas + m.retiradas === 0 ? (
            <p className="text-grafite-claro text-sm mt-3">
              Ainda sem pedidos com essa informação neste mês.
            </p>
          ) : (
            <>
              <div className="flex h-3 rounded-full overflow-hidden mt-4 bg-royal-nevoa">
                <div
                  className="bg-royal"
                  style={{
                    width: `${Math.round((m.entregas / (m.entregas + m.retiradas)) * 100)}%`,
                  }}
                />
                <div className="bg-escarlate flex-1" />
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-royal" aria-hidden="true" />
                  <span className="text-grafite-medio">Entrega</span>
                  <b className="text-grafite tabular-nums">{m.entregas}</b>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-escarlate" aria-hidden="true" />
                  <span className="text-grafite-medio">Retirada</span>
                  <b className="text-grafite tabular-nums">{m.retiradas}</b>
                </span>
              </div>
              <p className="text-grafite-claro text-xs mt-4 leading-relaxed">
                Serve para dimensionar a equipe de entrega e saber qual loja recebe mais
                gente.
              </p>
            </>
          )}
        </div>
      </div>

      {/* O que precisa de atenção */}
      <div className="bg-white rounded-2xl border border-linha p-5 mt-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-grafite">O que precisa de atenção</h2>
          <span className="text-xs text-grafite-claro">{m.totalProdutos} produtos</span>
        </div>

        {totalAlertas === 0 ? (
          <p className="text-green-700 bg-green-50 rounded-xl px-4 py-3 text-sm mt-4">
            Catálogo em ordem: todos os produtos têm foto, preço e categoria.
          </p>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
            {[
              { n: m.alertas.semPreco, r: "sem preço", grave: true },
              { n: m.alertas.semFoto, r: "sem foto", grave: false },
              { n: m.alertas.semCategoria, r: "sem categoria", grave: false },
              { n: m.alertas.inativos, r: "escondidos do site", grave: false },
            ]
              .filter((a) => a.n > 0)
              .map((a) => (
                <Link
                  key={a.r}
                  href="/admin/produtos"
                  className={`rounded-xl px-4 py-3 border transition-colors ${
                    a.grave
                      ? "border-escarlate/30 bg-escarlate/5 hover:border-escarlate/60"
                      : "border-linha hover:border-royal/40"
                  }`}
                >
                  <p
                    className={`font-display text-2xl font-semibold tabular-nums ${
                      a.grave ? "text-escarlate" : "text-grafite"
                    }`}
                  >
                    {a.n}
                  </p>
                  <p className="text-grafite-medio text-xs mt-0.5">{a.r}</p>
                </Link>
              ))}
          </div>
        )}
      </div>

      {/* Últimos pedidos */}
      <div className="bg-white rounded-2xl border border-linha p-5 mt-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-grafite">Últimos pedidos</h2>
          <Link href="/admin/clientes" className="text-royal text-sm font-medium hover:underline">
            Ver todos
          </Link>
        </div>
        {m.ultimos.length === 0 ? (
          <p className="text-grafite-claro text-sm mt-3">Nenhum pedido registrado ainda.</p>
        ) : (
          <ul className="flex flex-col divide-y divide-linha mt-2">
            {m.ultimos.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-grafite truncate">{p.nome}</p>
                  <p className="text-grafite-claro text-xs tabular-nums">
                    {p.codigo} · {formatarData(p.criadoEm)}
                    {p.entrega ? ` · ${p.entrega}` : ""}
                  </p>
                </div>
                <span className="font-semibold text-grafite tabular-nums shrink-0">
                  {formatarPreco(p.totalCentavos)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
