# Publicar na internet (Vercel) — passo a passo

Este guia coloca o app **inteiro** no ar (totem + painel administrativo),
com link público fixo, sem depender do seu computador ligado.

Tempo estimado: ~15 minutos. Tudo que é usado aqui tem plano gratuito.

> **Por que não GitHub Pages?** O GitHub Pages só serve arquivos estáticos.
> Este projeto precisa de servidor (login, cadastro de produtos, upload de
> fotos, banco de dados), então o painel administrativo não funcionaria lá.

---

## Passo 1 — Subir o código para o GitHub

O repositório local já está pronto e com todos os commits feitos.
Só falta autenticar e enviar:

```bash
cd "C:\Users\ABJ PUBLICIDADE\Desktop\ABJ\EXTRA\NK\ANTES E DEPOIS\viverbem-app"
gh auth login          # escolha: GitHub.com > HTTPS > autenticar pelo navegador
git push -u origin main
```

Confira em: https://github.com/abalduinojose-cmd/app_viverbem

---

## Passo 2 — Criar o banco de dados (Postgres)

O SQLite guarda os dados num arquivo, e servidores em nuvem apagam esse
arquivo a cada publicação. Por isso a versão online usa **PostgreSQL**.

1. Crie uma conta gratuita no [Neon](https://neon.tech) (ou Supabase).
2. Crie um projeto e copie a **connection string**. Ela se parece com:
   ```
   postgresql://usuario:senha@ep-xxxx.sa-east-1.aws.neon.tech/neondb?sslmode=require
   ```

Agora prepare o projeto e crie as tabelas:

```bash
npm run db:postgres                 # troca o schema para PostgreSQL
# edite o .env e cole a connection string em DATABASE_URL
npx prisma db push                  # cria as tabelas no Postgres
npm run db:seed                     # cria os usuários e os produtos
```

> Para voltar a trabalhar localmente com SQLite depois:
> `npm run db:sqlite` e devolva `DATABASE_URL="file:./dev.db"` no `.env`.

---

## Passo 3 — Publicar no Vercel

1. Entre em [vercel.com](https://vercel.com) com a sua conta do GitHub.
2. **Add New → Project** e escolha o repositório `app_viverbem`.
3. Em **Environment Variables**, cadastre:

   | Nome | Valor |
   |---|---|
   | `DATABASE_URL` | a connection string do Neon (Passo 2) |
   | `SESSION_SECRET` | um texto aleatório com **32+ caracteres** |

   Para gerar um `SESSION_SECRET` seguro:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

4. Clique em **Deploy**.

O Vercel usa automaticamente o script `vercel-build`, que já roda o
`prisma generate` antes de compilar.

---

## Passo 4 — Ativar o envio de fotos

Em servidores serverless o disco é temporário, então as fotos enviadas
pelo painel precisam ir para um armazenamento externo.

1. No painel do Vercel: **Storage → Create → Blob**.
2. Conecte o Blob ao projeto. O Vercel cria sozinho a variável
   `BLOB_READ_WRITE_TOKEN`.
3. Refaça o deploy (**Deployments → Redeploy**).

O código detecta essa variável automaticamente
(`src/lib/armazenamento.ts`): com ela, as fotos vão para a nuvem; sem ela,
continuam sendo gravadas em `public/uploads/` como no seu computador.

---

## Passo 5 — Usar

O Vercel dará um endereço como `https://app-viverbem.vercel.app`.

| Tela | Endereço |
|---|---|
| **Totem (clientes)** | `https://SEU-APP.vercel.app` |
| **Painel administrativo** | `https://SEU-APP.vercel.app/admin` |

No tablet do balcão, abra o endereço do totem e use "Adicionar à tela
inicial" para rodar em tela cheia.

### ⚠️ Troque as senhas

As senhas iniciais (`viverbem123` e `operador123`) estão no código e
**precisam ser trocadas** antes de usar de verdade:

```bash
node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA_NOVA', 10))"
```

Cole o resultado no campo `senhaHash` do usuário, usando `npm run db:studio`
(apontando para o banco de produção).

---

## Publicações seguintes

Depois de configurado, é automático: todo `git push` para a branch `main`
publica a nova versão sozinho.

```bash
git add -A
git commit -m "descrição da mudança"
git push
```
