# Como colocar o app da família no ar

É o mesmo app que já usamos no Claude, com as mesmas telas, figuras e regras. Só muda onde os dados ficam guardados (no **Supabase**, num servidor em Frankfurt) e que cada um entra com e-mail e senha. O site fica no **Netlify**. As duas contas são gratuitas.

Leva uns 20 minutos, uma vez só.

---

## 1. Antes de começar: baixe o backup

No app atual (no Claude), vá em **Ajustes → Baixar backup**. Guarde o arquivo `familia-backup-....json`. Com ele, tudo o que já foi feito (tarefas, pontos, receitas, cardápios, lembretes) vai para o app novo.

## 2. Supabase (onde os dados ficam guardados)

1. Entre em https://supabase.com e crie a conta (pode ser com o GitHub).
2. Clique em **New project**:
   - Name: `familia`
   - Database password: crie uma senha forte e guarde (quase nunca vai precisar).
   - Region: **Central EU (Frankfurt)**, para os dados ficarem na Alemanha.
   - Clique em **Create new project** e espere uns 2 minutos.
3. No menu da esquerda, abra **SQL Editor** e clique em **New query**.
4. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql) deste repositório, copie **tudo**, cole lá e clique em **Run**. Deve aparecer "Success".
5. No menu da esquerda, abra **Project Settings → API** (ou **Connect**) e copie duas coisas:
   - **Project URL**, algo como `https://abcd1234.supabase.co`
   - a chave **anon public** (ou **publishable key**), um texto comprido.

   Essa chave pode ficar no site, porque a segurança está nas regras do passo 4: só quem é da família vê os dados da família.

   Nunca use a chave **service_role** (ou **secret**) no site.
6. Opcional, mas mais fácil: em **Authentication → Sign In / Providers → Email**, desligue **Confirm email**. Assim a conta funciona na hora, sem precisar abrir o e-mail de confirmação.

   Se deixar ligado, tudo funciona igual, só que cada um precisa clicar no link do e-mail na primeira vez.
7. Em **Authentication → URL Configuration**, coloque em **Site URL** o endereço do site, que você recebe no passo 3. Isso faz o link de "Esqueci a senha" voltar para o app.

## 3. Netlify (onde o site fica)

1. Entre em https://netlify.com e crie a conta **com o GitHub**.
2. Clique em **Add new site → Import an existing project → GitHub** e escolha o repositório `casa`.
3. Preencha:
   - Branch to deploy: `claude/vibrant-pascal-p9a5u7` (ou a branch principal, quando existir)
   - **Base directory: `app`**
   - Build command: `npm run build`
   - Publish directory: `app/build`
4. Em **Environment variables** (pode ser em **Add environment variables** nessa mesma tela, ou depois em **Site configuration → Environment variables**), crie:

   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | o Project URL do passo 2.5 |
   | `VITE_SUPABASE_ANON_KEY` | a chave anon public do passo 2.5 |

5. Clique em **Deploy**. Em 1 ou 2 minutos aparece o endereço, algo como `https://familia-xyz.netlify.app`.

   Dá para trocar o nome em **Site configuration → Change site name**.
6. Volte ao Supabase (passo 2.7) e coloque esse endereço em **Site URL**.

Se você mudou as variáveis depois do primeiro deploy, vá em **Deploys → Trigger deploy → Deploy site** para elas valerem.

## 4. Primeira vez no app (você)

1. Abra o endereço no tablet.
2. Clique em **Criar conta**, coloque seu e-mail e uma senha.
3. Clique em **Criar a família**. O app abre com a rotina inicial.
4. Vá em **Ajustes**, entre com o PIN (o mesmo de antes: **1234**, se você não trocou) e clique em **Restaurar backup**. Escolha o arquivo do passo 1. Pronto: fica tudo como estava.
5. Para virar "aplicativo" no tablet:
   - **Android (Chrome):** menu ⋮ → **Adicionar à tela inicial**
   - **iPad (Safari):** botão de compartilhar → **Adicionar à Tela de Início**

O tablet fica conectado. Não precisa entrar de novo toda vez.

## 5. Bruno

1. No app, em **Ajustes → Conta da família → Convidar alguém**, aparece o **código da família** (6 letras e números).
2. O Bruno abre o mesmo endereço no celular, clica em **Criar conta** com o e-mail dele e depois em **Entrar com código**, e digita o código.
3. Ele vê e muda tudo, ao vivo: o que um marca aparece no aparelho do outro.

## Bom saber

- **Custo:** os dois planos gratuitos sobram para uma família.

  O Supabase gratuito **pausa o projeto se ninguém usar por 7 dias seguidos**. Como o tablet abre todo dia, não acontece. Se acontecer (ex.: nas férias), entre em supabase.com e clique em **Restore project**: nada se perde.
- **Backup:** continue baixando um backup uma vez por mês, em **Ajustes → Baixar backup**.
- **Mudanças no app:** o que for alterado aqui no repositório (no app.js, icons.js, seed.js, styles.css da raiz) vale para os dois: a versão do Claude e esta. O Netlify publica sozinho a cada mudança na branch.
- **Precisa de internet** para abrir e salvar (como no Claude).

## Para testar no computador (opcional, para quem programa)

```bash
cd app
cp .env.example .env   # e coloque a URL e a chave
npm install
npm run dev
```
