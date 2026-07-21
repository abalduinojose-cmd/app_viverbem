"use client";
// Carrinho de compras do totem (estado no cliente + localStorage).
// O pedido final é enviado por WhatsApp — nada é gravado no servidor.
//
// Uso: envolva a árvore com <CarrinhoProvider> e acesse com useCarrinho().

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface ItemCarrinho {
  produtoId: number;
  nome: string;
  precoCentavos: number;
  dosagem: string | null; // dosagem escolhida (ex.: "500mg") ou null
  quantidade: number;
}

interface ContextoCarrinho {
  itens: ItemCarrinho[];
  totalItens: number;
  totalCentavos: number;
  adicionar: (item: Omit<ItemCarrinho, "quantidade">, quantidade?: number) => void;
  mudarQuantidade: (produtoId: number, dosagem: string | null, delta: number) => void;
  remover: (produtoId: number, dosagem: string | null) => void;
  limpar: () => void;
}

const Contexto = createContext<ContextoCarrinho | null>(null);

const CHAVE_STORAGE = "viverbem_carrinho";

export function CarrinhoProvider({ children }: { children: React.ReactNode }) {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  // Carrega o carrinho salvo (sobrevive a navegações e recarregamentos)
  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE_STORAGE);
      if (salvo) setItens(JSON.parse(salvo));
    } catch {
      /* storage indisponível ou corrompido — começa vazio */
    }
  }, []);

  // Persiste a cada mudança
  useEffect(() => {
    try {
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(itens));
    } catch {
      /* sem storage, carrinho vive só em memória */
    }
  }, [itens]);

  // Mesmo produto com dosagens diferentes = itens separados no carrinho
  const mesmaLinha = (a: ItemCarrinho, produtoId: number, dosagem: string | null) =>
    a.produtoId === produtoId && a.dosagem === dosagem;

  const adicionar = useCallback(
    (item: Omit<ItemCarrinho, "quantidade">, quantidade = 1) => {
      setItens((atual) => {
        const existente = atual.find((i) => mesmaLinha(i, item.produtoId, item.dosagem));
        if (existente) {
          return atual.map((i) =>
            mesmaLinha(i, item.produtoId, item.dosagem)
              ? { ...i, quantidade: i.quantidade + quantidade }
              : i
          );
        }
        return [...atual, { ...item, quantidade }];
      });
    },
    []
  );

  const mudarQuantidade = useCallback(
    (produtoId: number, dosagem: string | null, delta: number) => {
      setItens((atual) =>
        atual
          .map((i) =>
            mesmaLinha(i, produtoId, dosagem)
              ? { ...i, quantidade: i.quantidade + delta }
              : i
          )
          .filter((i) => i.quantidade > 0)
      );
    },
    []
  );

  const remover = useCallback((produtoId: number, dosagem: string | null) => {
    setItens((atual) => atual.filter((i) => !mesmaLinha(i, produtoId, dosagem)));
  }, []);

  const limpar = useCallback(() => setItens([]), []);

  const valor = useMemo<ContextoCarrinho>(() => {
    const totalItens = itens.reduce((soma, i) => soma + i.quantidade, 0);
    const totalCentavos = itens.reduce((soma, i) => soma + i.precoCentavos * i.quantidade, 0);
    return { itens, totalItens, totalCentavos, adicionar, mudarQuantidade, remover, limpar };
  }, [itens, adicionar, mudarQuantidade, remover, limpar]);

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useCarrinho(): ContextoCarrinho {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useCarrinho precisa estar dentro de <CarrinhoProvider>");
  }
  return contexto;
}
