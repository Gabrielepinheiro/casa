# Família Pinheiro Bernt Eymael

Quadro da família para o tablet: a rotina do Arthur e da Sophie com figuras (para quem ainda não lê), a rotina da casa, lembretes, o controle da semana e os prêmios.

## Como funciona

- **Dia** – colunas lado a lado: **Casa**, Gabriele, Bruno, Arthur e Sophie.
  - Crianças: cada tarefa tem uma figura. É só tocar para marcar.
  - Casa: tarefas que a Gabriele ou o Bruno fazem. Ao tocar, o app pergunta **quem fez**; a tarefa aparece em “Fez na casa” na coluna de quem fez e os pontos vão para essa pessoa.
  - ◀ ▶ muda o dia. **Editar** (PIN) permite, só para aquele dia: escrever uma nota, repassar para outra pessoa, marcar que não precisa ou mudar de dia.
- **Casa** – o panorama da semana: escolha o dia e veja tudo o que precisa ser feito, com o cômodo de foco do dia (seg: roupas e escritório · ter: cozinha · qua: quartos · qui: banheiros · sex: sala e geladeira · sáb: carro e compras).
- **Saúde da casa** – uma barra por cômodo, de verde a vermelho conforme as tarefas atrasam; tocando, aparece o que atrasou.
- **Tempo estimado** – cada tarefa tem um tempo médio; a coluna Casa e os dias da semana mostram o total e quanto falta.
- **Cronômetro** – 5 a 30 minutos, com o tucano e um aviso sonoro no fim.
- **Aprovação dos pais** – tarefas das crianças ficam esperando até a Gabriele ou o Bruno aprovarem (com PIN); só aí os pontos contam.
- **Recados** – mural rápido entre a família.
- **Prioridades da semana** – o que acumulou (ex.: vidro da sala). Fica no topo até alguém marcar como feito.
- **Cardápio** – jantar todo dia e almoço quando tiver; receitas com ingredientes, link e foto; cardápios prontos para reaproveitar; lista de compras que soma os ingredientes iguais.
- **Agenda** – lembretes e compromissos (ex.: “amanhã não precisa levar lancheira”). O tucano mostra no topo o que tem hoje e amanhã.
- **Semana** – o que foi feito em cada dia, por pessoa e na casa, mais as notas da semana.
- **Pontos** – ranking da semana e troca de pontos por prêmios (pede o PIN).
- **Repetição das tarefas** – toda semana em dias fixos, a cada X dias/semanas/meses (conta da última vez que foi feita) ou tarefa única. Tarefa atrasada volta no próximo dia do cômodo dela (ou aparece hoje, se não tiver dia fixo) até ser feita.
- **Ajustes** (PIN, padrão **1234**) – pessoas (com foto), tarefas com figura, prêmios, pontos extras.

## Onde ficam os dados

- **Aberto pelo claude.ai** (link da página): os dados ficam salvos na própria página e aparecem em todos os aparelhos. Para o Bruno editar e colocar lembretes pelo celular, compartilhe a página com ele como **Editor**.
- **App próprio** (pasta `app/`, SvelteKit + Supabase em Frankfurt, site no Render): cada um entra com e-mail e senha, a família tem um código de convite e os dados aparecem ao vivo em todos os aparelhos. Passo a passo em [`app/GUIA.md`](app/GUIA.md).
- **Aberto como arquivo** (`index.html` direto): os dados ficam só naquele aparelho; use *Ajustes → Baixar backup*.

## Arquivos

- `index.html` – página
- `styles.css` – visual
- `app.js` – funcionamento
- `icons.js` – figuras das tarefas (desenhos próprios)
- `seed.js` – rotina inicial da família
- `app/` – app próprio (SvelteKit): usa os mesmos arquivos acima, só troca onde os dados ficam (`app/src/lib/supabaseDb.js`) e acrescenta a tela de entrar
- `app/supabase/schema.sql` – tabelas e regras de segurança do Supabase
- `tools/build-artifact.py` – junta tudo num arquivo só para publicar no claude.ai
