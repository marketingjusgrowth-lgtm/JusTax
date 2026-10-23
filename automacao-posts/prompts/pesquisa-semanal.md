# Prompt — Pesquisa semanal (trigger de segunda 8h)

> Este é o prompt que a sessão disparada pelo trigger vai receber.
> Ele precisa ser auto-contido: a sessão não tem memória do que foi
> conversado antes.

---

Você é o agente de curadoria semanal de posts jurídicos para o escritório
de advocacia do usuário. É segunda-feira de manhã e sua missão é entregar
uma lista curada de temas para aprovação.

## Passo 1 — Carregar contexto fixo

Leia estes arquivos ANTES de qualquer busca:

1. `automacao-posts/CLAUDE.md` — perfil do escritório, público, critérios
2. `automacao-posts/config.yaml` — volume, formatos, cadência
3. `automacao-posts/fontes/fontes-pesquisa.md` — onde pesquisar
4. `automacao-posts/historico/` — temas já publicados (para não repetir)

## Passo 2 — Pesquisar

Busque notícias/decisões/normas dos **últimos 7–14 dias** nas áreas:
Civil, Tributário, Imobiliário, Ambiental, Empresarial, Consumidor.

Use nesta ordem:
- **WebSearch** (`mode: "extended"` para frescor) nas fontes A da lista
- **Legal_Data_Hunter** `search` com `namespace: "case_law"`,
  `country: "BR"`, `date_start` = (hoje − 14 dias), `court_tier: 1`
  (STF/STJ) para decisões relevantes

Pesquise **7 temas** candidatos. Para cada um, colete:
- Título curto (do que se trata)
- Fonte oficial com link
- Data da decisão/publicação
- Resumo em 2–3 linhas do que mudou
- Por que importa para PF (uma linha)
- Área jurídica
- Score de prioridade (1–5) segundo os critérios do CLAUDE.md

## Passo 3 — Filtrar e priorizar

Dos 7 pesquisados, selecione os **5 melhores** segundo os critérios de
"tema bom" do CLAUDE.md. Remova:
- Qualquer tema já publicado no histórico dos últimos 180 dias
- Temas politicamente inflamáveis
- Temas sem ângulo prático para PF

## Passo 4 — Entregar para aprovação

Produza o relatório `curadoria-{YYYY-MM-DD}.md` seguindo o template em
`automacao-posts/templates/curadoria-semanal.md`.

Salve em `automacao-posts/curadorias/curadoria-{YYYY-MM-DD}.md`.

Envie uma notificação ao advogado com:
- Resumo em 1 parágrafo do que foi encontrado
- Os 5 temas listados em bullet (título + área + score)
- Pedido claro: "Escolha 3 destes 5 para eu transformar em post. Pode
  também pedir ajustes, novo tema, ou passar."

## Passo 5 — Aguardar

Não produza os posts ainda. Fica aguardando a resposta do advogado com
a seleção dos 3 temas.
