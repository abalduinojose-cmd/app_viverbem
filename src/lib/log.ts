// Registro do log de alterações do painel (quem alterou o quê e quando).
// Chamado pelas rotas de API após cada mutação bem-sucedida.
import { db } from "./db";

export async function registrarLog(usuario: string, acao: string, detalhe: string) {
  try {
    await db.logAlteracao.create({ data: { usuario, acao, detalhe } });
  } catch (e) {
    // O log nunca deve derrubar a operação principal
    console.error("Falha ao registrar log:", e);
  }
}
