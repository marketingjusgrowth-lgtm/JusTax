# Briefing visual dos posts — Dilnei Borges Advocacia

Identidade visual **extraída diretamente** do design-doc do escritório
(`Instagram+Advocacia+Dilnei+Borges.dc.html` do Claude Design).
Este arquivo é fonte da verdade para toda arte produzida pela automação.

---

## Formato técnico

- **Resolução**: 1080 × 1350 (vertical 4:5) — carrossel e feed
- **Variação de post único "quadrado"**: ainda assim 1080 × 1350 — manter
  consistência de proporção no feed

---

## Lógica das colunas no grid

- **Coluna esquerda (1/3 dos posts)**: fundo verde escuro `#0A3A2A`
- **Colunas meio + direita (2/3 dos posts)**: fundo bege `#EFE6D3`

A cor é escolha **estética** para manter o grid organizado — não semântica.
Qualquer conteúdo pode virar verde ou bege; a decisão fina acontece quando
distribuir os temas aprovados no cronograma semanal.

Distribuição semanal: **1 verde + 2 bege**.

---

## Tipografia (confirmada no design-doc)

- **Títulos e nome do escritório**: `'Cormorant Garamond', serif`
  - Pesos usados: 400, 500, 600 — regular e italic
  - Palavras-chave sempre em **italic** com cor contrastante
- **Captions, eyebrows, footer**: `'Jost', sans-serif`
  - Peso 300 (light) para corpo, 400 para labels
  - Letter-spacing generoso (0.2em até 0.44em) nos eyebrows

Via Google Fonts:
```
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Jost:wght@300;400;500&display=swap">
```

---

## Paleta completa (hex codes do design-doc)

### Verdes (fundos e profundidade)
| Cor | Uso |
|---|---|
| `#0A3A2A` | **verde principal** (fundo brand) |
| `#14563E` | highlight do gradiente radial |
| `#051D14` | fim do gradiente (profundidade) |
| `#062418` · `#04150E` | verdes mais profundos |
| `#0E4632` · `#12503A` | verdes médios |

### Dourados (tipografia e detalhes)
| Cor | Uso |
|---|---|
| `#C9A24B` | **dourado principal** — filetes, OAB, logo |
| `#9C7A33` | dourado dessaturado — eyebrows, "Dilnei Borges" sobre bege |
| `#E4C77E` | dourado claro — italic sobre verde, selos |
| `#E9D6A2` | dourado creme — chip identificador |
| `#8A6E2E` | dourado terroso — italic sobre bege |
| `#EBD79B` | dourado médio claro |

### Cremes / Beges (fundo claro e texto sobre verde)
| Cor | Uso |
|---|---|
| `#F1EBDD` | **creme principal** — texto sobre verde |
| `#EFE6D3` | **bege de fundo** |
| `#FBF6EA` | ponto mais claro do gradiente radial |
| `#E2D6BC` | fim do gradiente radial |
| `#F7F1E4` · `#F3EFE6` | variações |

### Verde-cinza (sage, texto secundário)
| Cor | Uso |
|---|---|
| `#CFDBD3` | sage claro — caption sobre verde |
| `#9FB3A8` | sage médio — footer sobre verde |
| `#8FA396` | sage escuro — áreas |
| `#4A5A52` · `#6B7A70` | cinzas esverdeados — texto sobre bege |
| `#3B4A42` | mais escuro — subtítulo |

### Variação "Preto profundo" (3ª cor pontual)
| Cor | Uso |
|---|---|
| `#0C0C0B` · `#060706` | pretos neutros |
| `#121513` · `#1D231F` | pretos esverdeados |

---

## Elementos recorrentes de composição

### 1. Fundo com gradiente radial
```css
/* Bege */
background: radial-gradient(95% 75% at 22% 14%,
  #FBF6EA 0%, #EFE6D3 52%, #E2D6BC 100%);

/* Verde */
background: radial-gradient(95% 75% at 22% 14%,
  #14563E 0%, #0A3A2A 50%, #051D14 100%);
```

### 2. Textura diagonal sutil (overlay)
```css
opacity: .14 a .30;
background: repeating-linear-gradient(115deg,
  rgba(COR, .5) 0px, rgba(COR, .5) 1px,
  transparent 1px, transparent 28px);
```
Sobre bege use `rgba(156,122,51,.22)` (dourado terroso).
Sobre verde use `rgba(233,214,162,.5)` (dourado creme).

### 3. Borda interna respirando
```css
position: absolute;
inset: 50px;
border: 1px solid rgba(201, 162, 75, .34);
```
Enquadra o conteúdo com um filete dourado 34% opaco.

### 4. Logo + wordmark (canto superior esquerdo)
```
[DB_LOGO 56-74px]  Dilnei Borges       ← Cormorant Garamond 24-26px, letter-spacing .06em
                   ━━━━━━━━━━━━         ← linha gradiente dourada
                   ADVOCACIA            ← Cormorant Garamond 22-31px, letter-spacing .34em
```

A linha divisória:
```css
background: linear-gradient(90deg,
  rgba(201,162,75,0), #C9A24B, rgba(201,162,75,0));
```

### 5. Marca-d'água do logo DB
Imagem do DB em opacidade `.09` a `.10`, posicionada à direita, dando
textura visual de fundo sem concorrer com o conteúdo.

### 6. OAB/SC
No footer, em caixa alta, letter-spacing aberto. **PENDENTE: confirmar número**
— o screenshot do perfil mostra 23.954, mas o design-doc tem 25.954. Perguntar
ao advogado qual é o correto.

---

## Formatos catalogados no design-doc

O escritório tem 5 formatos nomeados. A automação deve escolher UM por post
conforme o tipo de conteúdo:

### Formato A — "Manchete da decisão" (uso recomendado: notícias de STF/STJ)
- Eyebrow: "DIREITO EM PAUTA" em Jost dourado
- Título hero: nome do órgão + ação ("STJ decidiu.") em Cormorant uppercase 150px
- Subtítulo em italic: pergunta provocativa ("E agora?") em dourado claro 132px
- Linha dourada curta como separador
- Caption breve embaixo em Jost light 28px
- Footer: área · OAB

### Formato B — "Pergunta com foto" (uso recomendado: temas com apelo visual)
- Pergunta como título em Cormorant médio
- Palavra-chave em italic contrastante
- Foto fotográfica realista ocupando metade inferior
- Caption breve

### Formato C — "Lista / passo-a-passo" (uso recomendado: "o que fazer")
- Título mais contido
- Lista de itens com marcadores dourados
- Caption de contexto

### Formato D — "Dado em destaque" (uso recomendado: números-chave da notícia)
- Grande número ou valor centralizado em Cormorant
- Contexto curto embaixo

### Formato E — "Manifesto / frase-conceito" (uso recomendado: posts
institucionais verdes)
- Frase longa ocupando o slide inteiro
- Última palavra em italic dourado como "mic drop"
- Ex.: "O Direito exige mais do que respostas. *Exige estratégia.*"

---

## Elementos obrigatórios em TODO post

- Logo DB + "Dilnei Borges" + "ADVOCACIA" (canto superior esquerdo)
- OAB/SC [número] no footer
- Último slide (CTA, quando carrossel):
  - "Fale com o escritório"
  - @ do Instagram (confirmar o handle oficial)
  - Disclaimer: "Conteúdo informativo. Para o seu caso específico, consulte um advogado."

---

## O que a automação NUNCA deve fazer

- Usar fonte diferente de Cormorant Garamond para títulos
- Usar fonte diferente de Jost para captions/sans
- Trocar as cores oficiais por "aproximadas"
- Omitir a borda interna, o gradiente radial ou a textura diagonal — os três
  juntos definem a textura visual da marca
- Usar emojis no design (podem na legenda, moderadamente)
- Posicionar o logo em outro lugar que não o canto superior esquerdo
- Omitir a palavra-chave em italic no título

---

## Como a automação opera dentro desta identidade

O trabalho da automação **NÃO é refazer o design do zero**. Ela:

1. Entrega o **texto editorial** estruturado por slide (título, palavra-chave
   em italic, caption, footer line) no formato do briefing acima
2. Produz um **preview visual** (artifact HTML) que simula fielmente o
   padrão real, para o advogado conferir que o conteúdo encaixa no template
3. O advogado **aplica o conteúdo no template real** dele no Claude Design
   (que já tem as 5 artboards de formato prontas) e exporta como PNG
4. Publica no Instagram manualmente

Fluxo:
```
Pesquisa semanal → Curadoria → Aprovação temas →
Texto por slide + Preview artifact → Aprovação textos →
Advogado cola no template Claude Design → Exporta PNG → Posta
```
