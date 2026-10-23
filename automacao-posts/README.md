# Automação de Posts Jurídicos — Instagram

Sistema semi-automatizado para pesquisar temas jurídicos em alta,
curar os mais relevantes para o escritório, e produzir os posts
semanalmente — sempre com duas aprovações manuais do advogado antes
da publicação.

## Como funciona

```
┌─────────────────────────────────────────────────────────────┐
│  SEGUNDA 8h — Trigger dispara                               │
│  ↓                                                           │
│  Agente lê CLAUDE.md + config.yaml + fontes-pesquisa.md    │
│  ↓                                                           │
│  Pesquisa 7 temas (WebSearch + Legal_Data_Hunter)           │
│  ↓                                                           │
│  Filtra e seleciona top 5                                   │
│  ↓                                                           │
│  Produz curadoria-{data}.md                                 │
│  ↓                                                           │
│  Envia para advogado (sessão + e-mail)                      │
│  ↓                                                           │
│  🟡 APROVAÇÃO 1 — advogado escolhe 3 dos 5                  │
│  ↓                                                           │
│  Agente produz 3 posts (texto + legenda + design artifact)  │
│  ↓                                                           │
│  🟡 APROVAÇÃO 2 — advogado aprova ou pede ajustes           │
│  ↓                                                           │
│  Entrega pacote pronto (manual) OU agenda (futuro)          │
└─────────────────────────────────────────────────────────────┘
```

## Estrutura

```
automacao-posts/
├── CLAUDE.md                   # Perfil do escritório (lido toda sessão)
├── config.yaml                 # Cadência, volume, formatos
├── README.md                   # Este arquivo
├── prompts/
│   ├── pesquisa-semanal.md     # Rodado pelo trigger de segunda 8h
│   ├── criar-posts.md          # Rodado após aprovação da curadoria
│   └── briefing-visual.md      # Identidade visual dos posts
├── fontes/
│   └── fontes-pesquisa.md      # Onde o agente pesquisa
├── templates/
│   ├── curadoria-semanal.md    # Template da entrega semanal
│   └── post-structure.md       # Estrutura de carrossel / feed
├── curadorias/                 # Curadorias semanais arquivadas
├── entregas/                   # Pacotes de posts prontos
└── historico/                  # Posts já publicados (evita repetição)
```

## O que falta configurar

- [ ] **E-mail do escritório** para envio da curadoria semanal
- [ ] **Trigger persistente** (via claude-code-remote `create_trigger`)
      para rodar segunda 8h — ainda não criado neste repo
- [ ] **Identidade visual real**: paleta/fonte/logo do escritório
      (hoje usando defaults sóbrios em `prompts/briefing-visual.md`)
- [ ] **Amostra de posts anteriores** para calibrar o estilo

## Como testar antes do primeiro trigger

Rodar manualmente nesta sessão:

```
Rode o prompt em automacao-posts/prompts/pesquisa-semanal.md
usando a data de hoje como referência.
```

O agente faz a pesquisa real, produz a curadoria, e o advogado
avalia se a qualidade está no nível esperado antes de ativar
o trigger semanal.

## Publicação no Instagram

**Modo atual**: entrega manual. O advogado recebe um pacote completo
(legenda + imagens + hashtags + hora sugerida) e posta/agenda à mão —
dura ~2 minutos por post no app do Instagram.

**Modo futuro (opcional)**:
- Via **Instagram Graph API** (requer conta Business + App Meta Developers)
- Via **Buffer / Later / Metricool** (requer conta paga + API)

Qualquer um desses só é desbloqueado depois do advogado validar que
o fluxo manual está produzindo posts bons.
