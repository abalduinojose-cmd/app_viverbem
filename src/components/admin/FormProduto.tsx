"use client";
// Formulário de produto (usado tanto para criar quanto para editar).
// Faz o upload da foto primeiro (se houver) e depois salva o produto.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CategoriaDTO, ProdutoDTO, TIPO_COMBO, TIPO_PRODUTO } from "@/lib/tipos";
import { centavosParaInput, converterPrecoParaCentavos } from "@/lib/preco";

export function FormProduto({
  categorias,
  produto, // undefined = criando novo
}: {
  categorias: CategoriaDTO[];
  produto?: ProdutoDTO;
}) {
  const router = useRouter();
  const editando = Boolean(produto);

  const [nome, setNome] = useState(produto?.nome ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [preco, setPreco] = useState(produto ? centavosParaInput(produto.precoCentavos) : "");
  const [tipo, setTipo] = useState(produto?.tipo ?? TIPO_PRODUTO);
  const [categoriaId, setCategoriaId] = useState<string>(
    produto?.categoriaId ? String(produto.categoriaId) : ""
  );
  const [dosagens, setDosagens] = useState(produto?.dosagens ?? "");
  const [apresentacao, setApresentacao] = useState(produto?.apresentacao ?? "");
  const [indicacoes, setIndicacoes] = useState(produto?.indicacoes ?? "");
  const [composicao, setComposicao] = useState(produto?.composicao ?? "");
  const [modoUso, setModoUso] = useState(produto?.modoUso ?? "");
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [novidade, setNovidade] = useState(produto?.novidade ?? false);
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(produto?.fotoUrl ?? null);
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  function escolherFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = e.target.files?.[0] ?? null;
    setArquivoFoto(arquivo);
    if (arquivo) setPreviewFoto(URL.createObjectURL(arquivo));
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setErro("");

    const precoCentavos = converterPrecoParaCentavos(preco);
    if (precoCentavos === null) {
      setErro("Preço inválido. Use o formato 49,90.");
      return;
    }

    setSalvando(true);
    try {
      // 1) Se o usuário escolheu uma foto nova, envia primeiro
      let fotoUrl = produto?.fotoUrl ?? null;
      if (arquivoFoto) {
        const formulario = new FormData();
        formulario.append("arquivo", arquivoFoto);
        const respostaUpload = await fetch("/api/admin/upload", {
          method: "POST",
          body: formulario,
        });
        const dadosUpload = await respostaUpload.json();
        if (!respostaUpload.ok) {
          setErro(dadosUpload.erro || "Falha no envio da foto.");
          return;
        }
        fotoUrl = dadosUpload.url;
      }

      // 2) Salva o produto
      const corpo = {
        nome,
        descricao,
        precoCentavos,
        tipo,
        fotoUrl,
        ativo,
        novidade,
        destaque,
        dosagens: dosagens.trim() || null,
        apresentacao: apresentacao.trim() || null,
        indicacoes: indicacoes.trim() || null,
        composicao: composicao.trim() || null,
        modoUso: modoUso.trim() || null,
        categoriaId: categoriaId ? Number(categoriaId) : null,
      };

      const resposta = await fetch(
        editando ? `/api/admin/produtos/${produto!.id}` : "/api/admin/produtos",
        {
          method: editando ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(corpo),
        }
      );
      const dados = await resposta.json();
      if (!resposta.ok) {
        setErro(dados.erro || "Não foi possível salvar.");
        return;
      }

      router.push("/admin/produtos");
      router.refresh();
    } catch {
      setErro("Falha de conexão. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  const Caixa = ({
    marcado,
    aoMudar,
    titulo,
    descricaoCurta,
  }: {
    marcado: boolean;
    aoMudar: (v: boolean) => void;
    titulo: string;
    descricaoCurta: string;
  }) => (
    <label
      className={`flex-1 min-w-40 border rounded-xl p-4 cursor-pointer transition-colors ${
        marcado ? "border-royal bg-royal-claro/60" : "border-grafite/20 bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={marcado}
          onChange={(e) => aoMudar(e.target.checked)}
          className="w-5 h-5 accent-[#1C69B5]"
        />
        <span className="font-semibold text-grafite">{titulo}</span>
      </div>
      <p className="text-xs text-grafite-claro mt-1">{descricaoCurta}</p>
    </label>
  );

  return (
    <form onSubmit={salvar} className="max-w-3xl">
      <h1 className="text-2xl font-bold text-grafite">
        {editando ? `Editar: ${produto!.nome}` : "Novo produto"}
      </h1>

      <div className="mt-6 bg-white rounded-2xl border border-grafite/10 shadow-sm p-6 flex flex-col gap-5">
        {/* Foto */}
        <div className="flex items-center gap-5">
          {previewFoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewFoto}
              alt="Foto do produto"
              className="w-28 h-28 rounded-2xl object-cover bg-royal-claro"
            />
          ) : (
            <div className="w-28 h-28 rounded-2xl bg-royal-claro flex items-center justify-center text-grafite-claro text-xs text-center px-2">
              Sem foto
            </div>
          )}
          <label className="cursor-pointer">
            <span className="border border-royal text-royal hover:bg-royal hover:text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors inline-block">
              {previewFoto ? "Trocar foto" : "Enviar foto"}
            </span>
            <input type="file" accept="image/*" onChange={escolherFoto} className="hidden" />
          </label>
        </div>

        {/* Nome */}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-grafite">Nome *</span>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50"
            placeholder="Ex.: Sérum Vitamina C 10%"
          />
        </label>

        {/* Descrição */}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-grafite">Descrição *</span>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            rows={3}
            className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50 resize-y"
            placeholder="Descrição curta que aparece no site"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Preço */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-grafite">Preço (R$) *</span>
            <input
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
              inputMode="decimal"
              className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50"
              placeholder="49,90"
            />
          </label>

          {/* Tipo */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-grafite">Tipo</span>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="border border-grafite/20 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-royal/50"
            >
              <option value={TIPO_PRODUTO}>Produto</option>
              <option value={TIPO_COMBO}>Combo</option>
            </select>
          </label>

          {/* Categoria */}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-grafite">Categoria</span>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="border border-grafite/20 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-royal/50"
            >
              <option value="">Sem categoria</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Dosagens */}
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-grafite">
            Dosagens disponíveis <span className="text-grafite-claro">(opcional)</span>
          </span>
          <input
            value={dosagens}
            onChange={(e) => setDosagens(e.target.value)}
            className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50"
            placeholder="Separe por vírgula. Ex.: 250mg, 500mg, 1g"
          />
          <span className="text-xs text-grafite-claro">
            Se preencher, o cliente escolhe a dosagem no site antes de adicionar ao carrinho.
          </span>
        </label>

        {/* Informações da página do produto */}
        <div className="border-t border-linha pt-5">
          <p className="font-semibold text-grafite">Informações da página do produto</p>
          <p className="text-sm text-grafite-claro mt-0.5">
            Tudo aqui é opcional: o que ficar vazio simplesmente não aparece no site.
          </p>

          <label className="flex flex-col gap-1.5 mt-4">
            <span className="text-sm font-medium text-grafite">Apresentação</span>
            <input
              value={apresentacao}
              onChange={(e) => setApresentacao(e.target.value)}
              className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50"
              placeholder="Ex.: 30 cápsulas · 100ml · Pote 30g"
            />
          </label>

          <label className="flex flex-col gap-1.5 mt-4">
            <span className="text-sm font-medium text-grafite">Indicações</span>
            <textarea
              value={indicacoes}
              onChange={(e) => setIndicacoes(e.target.value)}
              rows={3}
              className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50 resize-y"
              placeholder="Um benefício por linha. Ex.: Regula o ciclo do sono"
            />
          </label>

          <label className="flex flex-col gap-1.5 mt-4">
            <span className="text-sm font-medium text-grafite">Composição</span>
            <textarea
              value={composicao}
              onChange={(e) => setComposicao(e.target.value)}
              rows={3}
              className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50 resize-y"
              placeholder="Um ativo por linha. Ex.: Melatonina 0,21mg"
            />
          </label>

          <label className="flex flex-col gap-1.5 mt-4">
            <span className="text-sm font-medium text-grafite">Modo de uso</span>
            <textarea
              value={modoUso}
              onChange={(e) => setModoUso(e.target.value)}
              rows={2}
              className="border border-grafite/20 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-royal/50 resize-y"
              placeholder="Ex.: Tomar 1 cápsula 30 minutos antes de dormir."
            />
          </label>
        </div>

        {/* Flags */}
        <div className="flex flex-wrap gap-3">
          <Caixa
            marcado={ativo}
            aoMudar={setAtivo}
            titulo="Ativo"
            descricaoCurta="Desmarque para esconder do site sem apagar (ex.: item em falta)"
          />
          <Caixa
            marcado={novidade}
            aoMudar={setNovidade}
            titulo="Novidade"
            descricaoCurta="Aparece na vitrine Novidades da home"
          />
          <Caixa
            marcado={destaque}
            aoMudar={setDestaque}
            titulo="Destaque"
            descricaoCurta="Aparece na vitrine Mais procurados da home"
          />
        </div>

        {erro && (
          <p className="bg-escarlate/10 text-escarlate text-sm font-medium rounded-xl px-4 py-3">
            {erro}
          </p>
        )}

        <div className="flex gap-3 pt-1">
          <button
            type="submit"
            disabled={salvando}
            className="bg-royal hover:bg-royal-escuro disabled:opacity-60 text-white font-bold rounded-xl px-8 py-3 transition-colors"
          >
            {salvando ? "Salvando..." : editando ? "Salvar alterações" : "Cadastrar produto"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/produtos")}
            className="border border-grafite/30 text-grafite hover:bg-grafite/5 font-semibold rounded-xl px-6 py-3 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
