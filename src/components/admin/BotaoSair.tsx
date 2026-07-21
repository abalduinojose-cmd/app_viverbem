"use client";
// Botão de logout do painel.
import { useRouter } from "next/navigation";

export function BotaoSair() {
  const router = useRouter();

  async function sair() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={sair}
      className="w-full text-left rounded-xl px-4 py-3 font-medium bg-white/10 hover:bg-escarlate transition-colors"
    >
      ⬅️ Sair
    </button>
  );
}
