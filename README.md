# 🏡 Tarefas da Casa

App para o tablet da família: cada pessoa tem suas tarefas (rotina das crianças e tarefas da casa), marca quando termina e ganha pontos ⭐ que podem ser trocados por prêmios.

## O que tem

- **Hoje** – um cartão por pessoa com as tarefas do dia, separadas por manhã / tarde / noite / qualquer hora. É só tocar para marcar (e tocar de novo para desmarcar). Dá para filtrar por *Rotina* ou *Casa* e por pessoa.
- **Placar** – ranking da semana (começa na segunda) e histórico das últimas atividades.
- **Prêmios** – troca de pontos por recompensas (pede o PIN dos pais).
- **Ajustes** (protegido por PIN, padrão **1234**) – cadastrar pessoas, tarefas (pontos, dias da semana, período, quem faz), prêmios, dar/tirar pontos extras, trocar o PIN e fazer backup.

Os dados ficam salvos **no próprio tablet** (no navegador). Use *Ajustes → Baixar backup* de vez em quando para não perder nada.

## Como colocar no tablet

1. Publique esta pasta em algum endereço `https://`. O jeito mais simples:
   - **GitHub Pages**: no repositório, *Settings → Pages → Branch: `main` / root → Save*. O app fica em `https://<usuario>.github.io/casa/`. (Em repositório privado, o Pages exige plano pago do GitHub.)
   - ou **Netlify Drop** (https://app.netlify.com/drop): arraste a pasta com estes arquivos.
2. Abra o endereço no navegador do tablet.
3. Instale na tela inicial:
   - **Android (Chrome)**: menu ⋮ → *Adicionar à tela inicial* / *Instalar app*.
   - **iPad (Safari)**: botão compartilhar → *Adicionar à Tela de Início*.
4. Opcional: para deixar o tablet "travado" no app, use *Fixar app* (Android) ou *Acesso Guiado* (iPad).

Para testar no computador, basta abrir o `index.html` no navegador.
