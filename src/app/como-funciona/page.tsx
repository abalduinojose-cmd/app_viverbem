// A antiga página /como-funciona virou a página /sobre do site.
// Este redirecionamento mantém funcionando qualquer link antigo.
import { redirect } from "next/navigation";

export default function PaginaComoFunciona() {
  redirect("/sobre");
}
