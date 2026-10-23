# Prompt — Criar posts (após aprovação da curadoria)

> Este prompt roda DEPOIS que o advogado escolheu quais temas aprovou
> na curadoria da semana.

---

O advogado aprovou {N} temas da curadoria desta semana. Agora produza os
posts.

## Passo 1 — Para cada tema aprovado

Decida o formato:
- **Carrossel** (3–8 slides) — se o tema precisa de passos, exemplos,
  comparações, "antes/depois", lista de direitos
- **Feed single** — se é um aviso curto, alerta de prazo, uma frase de
  impacto, uma pergunta provocativa

## Passo 2 — Produzir o conteúdo

Para cada post:

### Carrossel
Siga a estrutura em `automacao-posts/templates/post-structure.md`:

1. **Slide 1 — Capa**: título forte + subtítulo + nome do escritório
2. **Slide 2 — O que aconteceu**: resumo em linguagem simples
3. **Slide 3–N — Explicação em passos**: cada slide = 1 ideia
4. **Slide penúltimo — Impacto prático**: "o que isso muda para você"
5. **Slide final — CTA**: "ficou com dúvida? fale com o escritório"

### Feed single
1 imagem + legenda com:
- Hook forte na primeira linha
- Explicação em 2–3 parágrafos curtos
- CTA no final

### Em todos os formatos
- **Legenda** (pronta para colar no Instagram):
  - Hook na linha 1 (gera curiosidade)
  - Explicação em parágrafos curtos
  - 1 CTA no final
  - 10–15 hashtags (mix: nacional + nicho + localidade se aplicável)
- **Hora sugerida de publicação** (baseada em best practices de
  engajamento para público jurídico PF: terça/quarta/quinta,
  18h–20h)
- **Alt text** da imagem (acessibilidade)

## Passo 3 — Gerar o design

Use o **Artifact** (área de design do Claude) para criar as imagens:
- Formato quadrado 1080x1080 (feed) ou 1080x1350 (carrossel vertical)
- Siga o `briefing-visual.md` para paleta, tipografia e identidade
- Entregue um artifact por post (carrossel com múltiplos slides num só)

## Passo 4 — Montar o pacote de entrega

Para cada post, gere a pasta `automacao-posts/entregas/{YYYY-MM-DD}/post-{N}/`
com:
- `legenda.txt` — texto pronto para colar
- `hashtags.txt` — hashtags em uma linha
- `horario-sugerido.txt` — melhor hora/dia
- `alt-text.txt` — descrição para acessibilidade
- Link para o artifact de design (ou PNG exportado se possível)

## Passo 5 — Entregar para aprovação final

Mostre tudo ao advogado e pergunte:
- "Aprova para publicação?"
- "Quer ajustes em algum?"

Após aprovação, mova para `automacao-posts/historico/{YYYY-MM-DD}/` para
não repetir o tema futuramente.
