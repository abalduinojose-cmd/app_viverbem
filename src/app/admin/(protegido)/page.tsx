// /admin — apenas redireciona para a listagem de produtos.
import { redirect } from "next/navigation";

export default function PaginaAdmin() {
  redirect("/admin/produtos");
}
