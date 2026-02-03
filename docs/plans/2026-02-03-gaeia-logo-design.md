# Design da Logo GAEIA

**Data:** 2026-02-03
**Projeto:** GAEIA - Grupo Autônomo de Estudos em Inteligência Artificial
**Tipo:** Identidade Visual - Logotipo

---

## 1. Resumo Executivo

### Decisões de Design

| Aspecto | Decisão |
|---------|---------|
| Estilo | Neural/Científico |
| Formato | Símbolo isolado (sem texto) |
| Estrutura | Forma geométrica baseada na letra "G" |
| Elementos | Rede neural com nós interconectados |
| Paleta | Gradiente Cyan (#00d4ff) → Violet (#a78bfa) |
| Complexidade | Moderada (7-10 nós) |

### Conceito

A logo do GAEIA é uma fusão da letra "G" com uma rede neural. A forma geométrica da letra serve como estrutura base, enquanto os nós e conexões da rede neural são integrados organicamente, criando uma dualidade visual: é simultaneamente uma letra reconhecível e uma representação de inteligência artificial.

---

## 2. Conceito Visual Detalhado

### 2.1 A Estrutura do "G"

A logo é construída sobre a letra "G" em formato geométrico moderno:

- **Arco principal**: Aproximadamente 270° formando o corpo da letra
- **Barra horizontal**: Entra para o centro, característica distintiva do "G"
- **Abordagem**: Forma construída por arcos e linhas retas que sugerem a letra sem ser literal

### 2.2 Integração Neural

Os nós são posicionados estrategicamente ao longo da estrutura:

- **3-4 nós ao longo do arco externo** - seguindo a curvatura do "G"
- **2-3 nós na região central** - onde a barra horizontal encontra o arco
- **1-2 nós nas extremidades** - marcando início e fim da forma

As conexões entre os nós formam a própria estrutura do "G", criando a dualidade letra/rede neural.

### 2.3 Proporções

- Canvas quadrado (1:1)
- O "G" ocupa aproximadamente 80% do espaço
- Margem de respiro de 10% em cada borda

---

## 3. Especificação de Cores

### 3.1 Paleta Principal

| Elemento | Nome | Hex | RGB | Uso |
|----------|------|-----|-----|-----|
| Gradiente Início | Synapse Cyan | `#00d4ff` | 0, 212, 255 | Topo/esquerda |
| Gradiente Fim | Dendrite Violet | `#a78bfa` | 167, 139, 250 | Base/direita |
| Glow dos Nós | Branco | `#ffffff` | 255, 255, 255 | Centro dos nós |
| Fundo Escuro | Void | `#080c14` | 8, 12, 20 | Versão com fundo |

### 3.2 Aplicação do Gradiente

```
Direção: 135° (diagonal)
Início: Canto superior esquerdo (Cyan #00d4ff)
Fim: Canto inferior direito (Violet #a78bfa)
```

**Significado simbólico:**
- Sensação de movimento e progressão
- Profundidade visual na forma
- Representação da evolução do aprendizado

### 3.3 Estrutura Visual dos Nós

Cada nó possui três camadas:

1. **Núcleo**
   - Círculo sólido pequeno
   - Cor: posição correspondente no gradiente

2. **Glow Interno**
   - Halo suave branco
   - Opacidade: 30%
   - Raio: 1.5x o núcleo

3. **Glow Externo**
   - Halo maior na cor do gradiente
   - Opacidade: 15%
   - Raio: 2x o núcleo

---

## 4. Conexões e Efeitos Visuais

### 4.1 Tipos de Conexões

| Tipo | Espessura | Opacidade | Função |
|------|-----------|-----------|--------|
| Primária | 2-3px | 100% | Contorno do "G" (estrutural) |
| Secundária | 1-2px | 60% | Conexões internas da rede |
| Terciária | 0.5-1px | 30% | Profundidade (versões grandes) |

### 4.2 Hierarquia de Conexões

```
Primárias:  Ligam nós do perímetro → formam o "G"
Secundárias: Cruzam o interior → criam a "rede"
Terciárias: Opcionais → complexidade adicional
```

### 4.3 Efeitos de Glow (versão digital)

| Efeito | Especificação | Aplicação |
|--------|---------------|-----------|
| Drop Shadow | `0 0 20px [cor] 40%` | Forma geral |
| Glow dos Nós | Raio 4-6px, cor local | Cada nó |
| Linha Glow | `0 0 4px [cor]` sutil | Conexões primárias |

### 4.4 Versão Estática (impressão)

Para materiais impressos:
- Gradiente sólido nas linhas (sem glow)
- Nós como círculos preenchidos
- Sem efeitos de brilho
- Considerar versão monocromática para fundos coloridos

---

## 5. Especificações Técnicas

### 5.1 Dimensões e Grid

| Especificação | Valor |
|---------------|-------|
| Proporção | 1:1 (quadrado) |
| Grid base | 64x64 unidades |
| Área segura | 80% do canvas |
| Margem | 10% cada lado |
| Tamanho mínimo digital | 24x24px |
| Tamanho mínimo impresso | 10mm x 10mm |

### 5.2 Mapa de Posicionamento dos Nós

Grid de referência: 64x64 unidades, origem (0,0) no canto superior esquerdo.

```
        (24,8)
         N7
           \
            \     (52,12)
             \      N1
    (8,24)    \    /
      N6-------\--/
       \        \/
        \    (32,32)-----(44,32)-----(52,32)
         \     N8          N9          N2
          \    |
           \   |
    (12,44) \  |
      N5     \ |
        \     \|
         \  (32,56)
          \   N4
           \ /
         (52,52)
           N3
```

### 5.3 Coordenadas dos Nós

| Nó | Posição (x, y) | Função | Tamanho |
|----|----------------|--------|---------|
| N1 | (52, 12) | Extremidade superior do arco | Normal |
| N2 | (52, 32) | Lado direito do arco | Normal |
| N3 | (52, 52) | Extremidade inferior do arco | Normal |
| N4 | (32, 56) | Base do "G" | Normal |
| N5 | (12, 44) | Lado esquerdo inferior | Normal |
| N6 | (8, 24) | Lado esquerdo superior | Normal |
| N7 | (24, 8) | Topo do "G" | Normal |
| N8 | (32, 32) | Centro (ponto focal) | **Maior** |
| N9 | (44, 32) | Ponta da barra horizontal | Normal |

### 5.4 Raios dos Elementos

| Elemento | Raio (unidades) |
|----------|-----------------|
| Nós normais | 3-4 |
| Nó central (N8) | 4-5 |
| Glow interno | 6-8 |
| Glow externo | 10-12 |

### 5.5 Conexões (de → para)

**Primárias (estrutura do "G"):**
```
N7 → N1 → N2 → N3 → N4 → N5 → N6 → N7  (arco)
N8 → N9 → N2  (barra horizontal)
```

**Secundárias (rede interna):**
```
N6 → N8  (diagonal superior)
N5 → N8  (diagonal inferior)
N8 → N3  (vertical)
N7 → N8  (diagonal topo)
```

**Terciárias (opcional):**
```
N1 → N8
N4 → N8
N6 → N4
```

---

## 6. Formatos de Exportação

### 6.1 Arquivos Necessários

| Formato | Tamanhos | Uso Principal |
|---------|----------|---------------|
| SVG | Vetorial | Web, escalável, código |
| PNG (fundo transparente) | 512, 1024, 2048px | Apps, redes sociais |
| PNG (fundo escuro) | 512, 1024, 2048px | Previews, apresentações |
| ICO | 16, 32, 48, 64, 128, 256px | Favicon browser |
| PDF | Vetorial | Impressão profissional |
| PNG @2x @3x | Múltiplos | Mobile (iOS/Android) |

### 6.2 Nomenclatura de Arquivos

```
gaeia-logo.svg              # Versão principal vetorial
gaeia-logo-512.png          # PNG 512x512 transparente
gaeia-logo-1024.png         # PNG 1024x1024 transparente
gaeia-logo-dark-512.png     # PNG com fundo escuro
gaeia-logo-dark-1024.png    # PNG com fundo escuro
gaeia-logo-mono-white.svg   # Monocromática branca
gaeia-logo-mono-black.svg   # Monocromática preta
gaeia-favicon.ico           # Favicon multi-resolução
gaeia-logo-print.pdf        # Versão para impressão
```

---

## 7. Variações da Logo

### 7.1 Versão Principal
- Gradiente cyan → violet
- Com efeitos de glow
- Fundo transparente

### 7.2 Versão Fundo Escuro
- Mesma logo principal
- Sobre fundo Void (#080c14)
- Glow mais pronunciado

### 7.3 Versão Monocromática
- Branca: para fundos escuros/coloridos
- Preta: para fundos claros
- Sem gradiente, cor sólida

### 7.4 Versão Simplificada (favicon)
- Reduzir para 5-6 nós
- Conexões apenas primárias
- Sem glow externo
- Para tamanhos < 32px

---

## 8. Guia de Uso

### 8.1 Área de Proteção

Manter área livre ao redor da logo equivalente a **20% da largura** da logo em todos os lados.

```
┌─────────────────────┐
│                     │
│   ┌───────────┐     │
│   │           │     │
│   │   LOGO    │     │
│   │           │     │
│   └───────────┘     │
│         ↑           │
│    20% padding      │
└─────────────────────┘
```

### 8.2 Usos Corretos

✅ Usar versão com gradiente em fundos neutros/escuros
✅ Usar versão monocromática em fundos coloridos
✅ Manter proporções 1:1
✅ Respeitar área de proteção
✅ Usar versão simplificada em tamanhos pequenos

### 8.3 Usos Incorretos

❌ Não distorcer proporções
❌ Não rotacionar a logo
❌ Não alterar as cores do gradiente
❌ Não adicionar contornos ou sombras extras
❌ Não usar sobre fundos que comprometam legibilidade

---

## 9. Contexto do Projeto

### 9.1 Sobre o GAEIA

O GAEIA (Grupo Autônomo de Estudos em Inteligência Artificial) é uma plataforma de aprendizado gamificada que transforma conteúdo educacional em uma experiência interativa com tema astronômico/neural.

### 9.2 Identidade Visual Existente

A logo se integra ao sistema de design existente:

- **Cores primárias**: Cyan, Violet, Amber
- **Tema**: Astronômico + Neural
- **Tipografia**: Outfit (display), IBM Plex Sans (body)
- **Estética**: Futurista, científica, com efeitos de glow

### 9.3 Aplicações Previstas

- Favicon do site gaeia-web
- Avatar em redes sociais
- Cabeçalho da plataforma
- Materiais de divulgação
- Certificados e badges

---

## 10. Ferramentas Recomendadas para Criação

### 10.1 Design Vetorial

| Ferramenta | Indicação | Custo |
|------------|-----------|-------|
| **Figma** | Recomendada, colaborativa | Grátis/Pago |
| Adobe Illustrator | Profissional completo | Pago |
| Inkscape | Open source | Grátis |
| Affinity Designer | Alternativa acessível | Pago único |

### 10.2 Exportação e Otimização

| Ferramenta | Uso |
|------------|-----|
| SVGO | Otimização de SVG |
| TinyPNG | Compressão de PNG |
| RealFaviconGenerator | Geração de favicons |

### 10.3 Implementação Web (SVG inline)

A logo pode ser implementada diretamente como SVG no código:

```html
<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gaeia-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00d4ff"/>
      <stop offset="100%" stop-color="#a78bfa"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Conexões e nós aqui -->
</svg>
```

---

## 11. Checklist de Entrega

- [x] SVG vetorial principal (`public/logo.svg`)
- [ ] PNGs em múltiplas resoluções
- [x] Versão com fundo escuro (`public/favicon.svg` - 32x32 com fundo #080c14)
- [ ] Versões monocromáticas (branco e preto)
- [x] Favicon multi-resolução (`public/favicon.svg`)
- [x] Versão simplificada para tamanhos pequenos (`public/favicon.svg` - 8 nodes)
- [ ] PDF para impressão
- [x] Componente Astro reutilizável (`src/components/GaeiaLogo.astro`)

---

## 12. Referências Visuais

### Conceitos-chave para inspiração:

1. **Redes neurais artificiais** - visualizações de deep learning
2. **Tipografia geométrica** - letras construídas com formas básicas
3. **Logos tech com gradiente** - Instagram, Firefox, etc.
4. **Constelações** - pontos conectados formando padrões
5. **Circuit boards** - trilhas e nós eletrônicos

---

## 13. Implementação Realizada (2026-02-03)

### Arquivos Criados

| Arquivo | Descrição |
|---------|-----------|
| `public/logo.svg` | Logo principal 64x64, 9 nodes formando "G" |
| `public/favicon.svg` | Favicon 32x32 com fundo escuro |
| `src/components/GaeiaLogo.astro` | Componente Astro reutilizável |

### Integração

O logo foi integrado ao `Sidebar.astro`, substituindo o ícone de lâmpada anterior.

```astro
import GaeiaLogo from './GaeiaLogo.astro';

<GaeiaLogo size={32} animated={true} />
```

### Características Implementadas

- **9 nodes** formando a estrutura do "G"
- **Gradiente** cyan (#00d4ff) → violet (#a78bfa)
- **Glow effect** via SVG filter
- **Animação pulsante** no node central
- **IDs únicos** para múltiplas instâncias na mesma página
- **Props configuráveis**: size, class, animated

### Coordenadas dos Nodes (conforme spec)

- N1: (52, 12) - Cyan
- N2: (52, 32) - Mid-blend
- N3: (52, 52) - Violet
- N4: (32, 56) - Violet
- N5: (12, 44) - Violet
- N6: (8, 24) - Mid-blend
- N7: (24, 8) - Cyan
- N8: (32, 32) - Gradient (central, animado)
- N9: (44, 32) - Cyan (barra horizontal)

---

*Documento criado em: 2026-02-03*
*Última atualização: 2026-02-03*
*Versão: 1.1 - Implementação concluída*
