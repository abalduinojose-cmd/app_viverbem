// O antigo /catalogo virou /produtos. Este redirecionamento mantém
// funcionando qualquer link antigo que já tenha sido divulgado.
import { redirect } from "next/navigation";

export default function PaginaCatalogoAntiga() {
  redirect("/produtos");
}
