# GAEIA Web - Documento de Design

> Site estático gamificado para o vault Obsidian do GAEIA

**Data:** 2026-02-02
**Status:** Aprovado
**Versão:** 1.0

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura](#arquitetura)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Sistema de Gamificação](#sistema-de-gamificação)
5. [Design Visual](#design-visual)
6. [Páginas e Rotas](#páginas-e-rotas)
7. [Sistema de Checklist](#sistema-de-checklist)
8. [Docker - Desenvolvimento e Produção](#docker---desenvolvimento-e-produção)
9. [Stack Técnica](#stack-técnica)
10. [Implementação](#implementação)

---

## Visão Geral

### Objetivo

Criar um site que transforma o vault Obsidian GAEIA em uma plataforma de estudos gamificada, mantendo o vault como única fonte de verdade.

### Princípios

- **Vault é a fonte de verdade** — toda informação vem dos arquivos `.md`
- **Zero backend** — apenas arquivos estáticos
- **Rebuild simples** — um comando regenera o site
- **Docker all-in-one** — ambientes de dev e prod isolados
- **Fácil manutenção** — edite no Obsidian, rebuild, pronto

### Público

- Acesso público (sem autenticação)
- Qualquer pessoa pode acessar e estudar

### Gamificação

- Progresso visual (barras, percentuais)
- Badges e conquistas
- Visualização em trilha
- Quizzes via NotebookLM (versão futura)

---

## Arquitetura

### Diagrama

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Container                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │   Vault     │───▶│   Astro     │───▶│   Nginx     │      │
│  │  (source)   │    │   (build)   │    │  (serve)    │      │
│  │   .md       │    │   → HTML    │    │   :80       │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Vault Obsidian** contém todo o conteúdo em Markdown com frontmatter YAML
2. **Astro** lê os arquivos, processa o frontmatter (status, progresso, badges) e gera HTML
3. **Nginx** serve os arquivos estáticos
4. **Usuário** navega no site, vê progresso e badges baseados no frontmatter
5. **Grupo GAEIA** atualiza o vault no Obsidian → rebuild → site atualizado

---

## Estrutura do Projeto

```
gaeia-web/
├── docker/
│   ├── Dockerfile.dev          # Desenvolvimento com hot reload
│   ├── Dockerfile.prod         # Produção otimizada
│   └── nginx.conf              # Configuração Nginx
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Layout principal (header, sidebar)
│   │   ├── GuideLayout.astro   # Layout para blocos de estudo
│   │   └── RoadmapLayout.astro # Layout para roadmap
│   ├── components/
│   │   ├── Sidebar.astro       # Navegação lateral
│   │   ├── ProgressBar.astro   # Barra de progresso
│   │   ├── ProgressRing.astro  # Anel circular de progresso
│   │   ├── BadgeDisplay.astro  # Exibição de badges
│   │   ├── BadgeShelf.astro    # Prateleira de badges
│   │   ├── BlockCard.astro     # Card de bloco com status
│   │   ├── Checklist.astro     # Renderização de checklist
│   │   ├── JourneyMap.astro    # Trilha visual dos 9 blocos
│   │   └── StreakCounter.astro # Contador de dias consecutivos
│   ├── pages/
│   │   ├── index.astro         # Home
│   │   ├── conquistas.astro    # Página de badges
│   │   ├── jornada.astro       # Visualização em trilha
│   │   └── [...slug].astro     # Rota dinâmica (lê do vault)
│   └── styles/
│       └── global.css          # Estilos globais + Tailwind
├── content/                    # ← Symlink para o vault GAEIA
│   ├── 00-Home/
│   ├── 01-Guia-de-Estudos/
│   ├── 02-Roadmap-AI-Engineer/
│   ├── 03-Recursos/
│   ├── 04-Projetos/
│   └── _data/
│       └── badges.yml          # Definição de badges
├── public/
│   └── favicon.svg
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── docker-compose.yml          # Desenvolvimento
├── docker-compose.prod.yml     # Produção
└── rebuild.sh                  # Script de rebuild
```

### Frontmatter para Gamificação

O vault já usa frontmatter YAML. Extensão para suportar progresso:

```yaml
---
title: "Bloco 4 - Backpropagation"
tags:
  - gaeia
  - bloco-4
status: in-progress          # draft | in-progress | complete
difficulty: intermediate     # beginner | intermediate | advanced
progress: 60                 # Calculado automaticamente dos checkboxes
badges:
  - marco-critico            # Badges conquistados neste bloco
  - primeiro-treino
started_at: 2024-02-01       # Data de início (opcional)
completed_at:                # Data de conclusão (opcional)
---
```

---

## Sistema de Gamificação

### Badges Disponíveis

Definidos em `content/_data/badges.yml`:

```yaml
badges:
  # Blocos do Guia
  - id: primeiro-neuronio
    nome: "Primeiro Neurônio"
    icone: "🧠"
    descricao: "Completou o Bloco 1 - Neurônio e Vetores"
    criterio: bloco-1-complete

  - id: matrizes-master
    nome: "Matrizes Master"
    icone: "📐"
    descricao: "Completou o Bloco 2 - Forward Pass e Matrizes"
    criterio: bloco-2-complete

  - id: loss-expert
    nome: "Loss Expert"
    icone: "📉"
    descricao: "Completou o Bloco 3 - Loss e Derivadas"
    criterio: bloco-3-complete

  - id: marco-critico
    nome: "Marco Crítico"
    icone: "🔴"
    descricao: "Dominou Backpropagation - Bloco 4"
    criterio: bloco-4-complete

  - id: embedder
    nome: "Embedder"
    icone: "📝"
    descricao: "Completou o Bloco 5 - Embeddings e Texto"
    criterio: bloco-5-complete

  - id: attention-master
    nome: "Attention Master"
    icone: "👁️"
    descricao: "Entendeu Self-Attention - Bloco 6"
    criterio: bloco-6-complete

  - id: transformer-builder
    nome: "Transformer Builder"
    icone: "🤖"
    descricao: "Construiu um Transformer - Bloco 7"
    criterio: bloco-7-complete

  - id: tokenizer
    nome: "Tokenizer"
    icone: "✂️"
    descricao: "Implementou BPE - Bloco 8"
    criterio: bloco-8-complete

  - id: gpt-builder
    nome: "GPT Builder"
    icone: "🚀"
    descricao: "Construiu seu próprio GPT - Bloco 9"
    criterio: bloco-9-complete

  # Especiais
  - id: speed-runner
    nome: "Speed Runner"
    icone: "⚡"
    descricao: "Completou 3 blocos em uma semana"
    criterio: special

  - id: completionist
    nome: "Completionist"
    icone: "🏆"
    descricao: "Completou todos os 9 blocos"
    criterio: all-complete

  - id: roadmap-explorer
    nome: "Roadmap Explorer"
    icone: "🗺️"
    descricao: "Explorou todo o Roadmap AI Engineer"
    criterio: roadmap-complete
```

### Componentes Visuais

| Componente | Descrição |
|------------|-----------|
| `ProgressRing` | Anel circular mostrando % geral do guia |
| `ProgressBar` | Barra horizontal de progresso |
| `BlockCard` | Card com status visual (cinza/amarelo/verde) |
| `BadgeShelf` | Prateleira com badges conquistados |
| `BadgeDisplay` | Badge individual com tooltip |
| `StreakCounter` | Contador de dias consecutivos (via datas) |
| `JourneyMap` | Visualização dos 9 blocos como trilha |
| `Checklist` | Lista de tarefas com checkboxes estilizados |

### Cálculo de Progresso

```javascript
// Progresso de um bloco = checkboxes marcados / total
const checkboxes = content.match(/- \[(x| )\]/g) || [];
const completed = checkboxes.filter(c => c.includes('x')).length;
const total = checkboxes.length;
const blockProgress = Math.round((completed / total) * 100);

// Progresso geral = média dos 9 blocos
const overallProgress = blocks.reduce((sum, b) => sum + b.progress, 0) / 9;
```

---

## Design Visual

### Paleta de Cores (Dark Mode)

| Elemento | Cor | Hex | Uso |
|----------|-----|-----|-----|
| Fundo principal | ![#0d1117](https://via.placeholder.com/15/0d1117/0d1117.png) | `#0d1117` | Background |
| Fundo secundário | ![#161b22](https://via.placeholder.com/15/161b22/161b22.png) | `#161b22` | Sidebar, cards |
| Fundo elevado | ![#21262d](https://via.placeholder.com/15/21262d/21262d.png) | `#21262d` | Hover, destaques |
| Borda | ![#30363d](https://via.placeholder.com/15/30363d/30363d.png) | `#30363d` | Divisórias |
| Texto principal | ![#e6edf3](https://via.placeholder.com/15/e6edf3/e6edf3.png) | `#e6edf3` | Títulos, corpo |
| Texto secundário | ![#8b949e](https://via.placeholder.com/15/8b949e/8b949e.png) | `#8b949e` | Descrições |
| Accent | ![#58a6ff](https://via.placeholder.com/15/58a6ff/58a6ff.png) | `#58a6ff` | Links, progresso |
| Success | ![#3fb950](https://via.placeholder.com/15/3fb950/3fb950.png) | `#3fb950` | Completo |
| Warning | ![#d29922](https://via.placeholder.com/15/d29922/d29922.png) | `#d29922` | Em progresso |
| Roxo destaque | ![#a371f7](https://via.placeholder.com/15/a371f7/a371f7.png) | `#a371f7` | Badges especiais |

### Tailwind Config

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0d1117',
        'bg-secondary': '#161b22',
        'bg-elevated': '#21262d',
        'border': '#30363d',
        'text-primary': '#e6edf3',
        'text-secondary': '#8b949e',
        'accent': '#58a6ff',
        'success': '#3fb950',
        'warning': '#d29922',
        'purple': '#a371f7',
      },
    },
  },
  plugins: [],
}
```

### Layout Principal

```
┌──────────────────────────────────────────────────────────────┐
│  🧠 GAEIA                              [Progresso: ████░ 67%] │
├────────────────┬─────────────────────────────────────────────┤
│                │                                             │
│  📚 Guia       │  # Bloco 4 - Backpropagation               │
│    ├ Bloco 1 ✓ │                                             │
│    ├ Bloco 2 ✓ │  ┌─────────┐ ┌─────────┐                   │
│    ├ Bloco 3 ✓ │  │🔴 Marco │ │⚡Speed  │  ← Badges         │
│    ├ Bloco 4 ● │  └─────────┘ └─────────┘                   │
│    └ ...       │                                             │
│                │  Teoria: Regra da cadeia...                 │
│  🗺️ Roadmap    │                                             │
│  📖 Recursos   │  [Conteúdo do bloco]                        │
│  🏆 Conquistas │                                             │
│  🛤️ Jornada    │  ─────────────────────────────────────────  │
│                │                                             │
│ ───────────────│  Checklist                      2/7 (29%)   │
│ Badges: 4/12   │  ✅ Assistir Karpathy micrograd             │
│ 🧠📐📉🔴       │  ✅ Assistir 3Blue1Brown                    │
│                │  ◻️ Ler CS231n notes                        │
└────────────────┴─────────────────────────────────────────────┘
```

### Responsividade

| Breakpoint | Layout |
|------------|--------|
| Desktop (>1024px) | Sidebar fixa + conteúdo |
| Tablet (768-1024px) | Sidebar colapsável |
| Mobile (<768px) | Menu hambúrguer, navegação bottom |

### Estilo Visual

- Cards com bordas sutis `#30363d` e fundo `#161b22`
- Glow suave nos elementos de progresso (accent com opacity)
- Gradientes sutis em badges conquistados
- Transições suaves em hover (0.2s ease)
- Tipografia: `Inter` para UI, `JetBrains Mono` para código

---

## Páginas e Rotas

### Mapa de Rotas

| Rota | Página | Descrição |
|------|--------|-----------|
| `/` | Home | Visão geral, próximos passos, progresso |
| `/guia` | Guia Index | Lista dos 9 blocos com status |
| `/guia/bloco-[1-9]` | Bloco | Conteúdo do bloco de estudo |
| `/roadmap` | Roadmap Index | 12 seções do AI Engineer |
| `/roadmap/[secao]` | Seção | Index da seção |
| `/roadmap/[secao]/[topico]` | Tópico | Conteúdo do tópico |
| `/recursos` | Recursos | Vídeos, papers, livros, ferramentas |
| `/recursos/[categoria]` | Categoria | Lista filtrada |
| `/projetos` | Projetos | Projetos do grupo |
| `/conquistas` | Conquistas | Badges e progresso geral |
| `/jornada` | Jornada | Trilha visual dos 9 blocos |

### Página de Conquistas

```
┌──────────────────────────────────────────────────────────────┐
│  🏆 Conquistas do GAEIA                                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Progresso Geral                                        │ │
│  │  ████████████████░░░░░░░░░░  67%  (6/9 blocos)          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Badges Conquistados (4/12)                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐               │
│  │   🧠   │ │   📐   │ │   📉   │ │   🔴   │               │
│  │Primeiro│ │Matrizes│ │  Loss  │ │ Marco  │               │
│  │Neurônio│ │Master  │ │ Expert │ │Crítico │               │
│  └────────┘ └────────┘ └────────┘ └────────┘               │
│                                                              │
│  Próximos Badges                                             │
│  ┌────────┐ ┌────────┐ ┌────────┐                          │
│  │   🔒   │ │   🔒   │ │   🔒   │                          │
│  │  📝    │ │  👁️    │ │  🚀    │                          │
│  │Embedder│ │Attention│ │  GPT   │                          │
│  └────────┘ └────────┘ └────────┘                          │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Página Jornada

```
┌──────────────────────────────────────────────────────────────┐
│  🛤️ Sua Jornada                                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ✅───✅───✅───✅───🔵───⚪───⚪───⚪───⚪                    │
│   1    2    3    4    5    6    7    8    9                  │
│                       ▲                                      │
│                  Você está aqui                              │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ Bloco 5 - Embeddings e Texto                            │ │
│  │ ████████████░░░░░░░░  45%                               │ │
│  │                                                         │ │
│  │ ✅ Assistir Karpathy makemore                           │ │
│  │ ✅ Ler Jay Alammar Word2Vec                             │ │
│  │ ◻️ Implementar embedding layer                          │ │
│  │ ◻️ Treinar modelo bigram                                │ │
│  │                                                         │ │
│  │ [Continuar Estudando →]                                 │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Sistema de Checklist

### No Vault (Markdown)

```markdown
## Checklist

- [x] Assistir Karpathy micrograd completo
- [x] Assistir 3Blue1Brown backpropagation
- [ ] Ler CS231n notes
- [ ] Fazer exercício do Matt Mazur no papel
- [ ] Implementar backprop no MLP
- [ ] Treinar em XOR
- [ ] Verificar que loss diminui
```

### Processamento (Astro)

```javascript
// src/utils/checklist.ts
export function parseChecklist(content: string) {
  const checkboxRegex = /- \[(x| )\] (.+)/g;
  const items = [];
  let match;

  while ((match = checkboxRegex.exec(content)) !== null) {
    items.push({
      completed: match[1] === 'x',
      text: match[2]
    });
  }

  const completed = items.filter(i => i.completed).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { items, completed, total, progress };
}
```

### Renderização (Site)

```
┌─────────────────────────────────────────────────────────────┐
│  Checklist                                    2/7 (29%)     │
├─────────────────────────────────────────────────────────────┤
│  ███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                             │
│  ✅ Assistir Karpathy micrograd completo                    │
│  ✅ Assistir 3Blue1Brown backpropagation                    │
│  ◻️ Ler CS231n notes                                        │
│  ◻️ Fazer exercício do Matt Mazur no papel                  │
│  ◻️ Implementar backprop no MLP                             │
│  ◻️ Treinar em XOR                                          │
│  ◻️ Verificar que loss diminui                              │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Atualização

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Membro    │───▶│  Obsidian   │───▶│   Rebuild   │───▶│    Site     │
│   estuda    │    │  marca [x]  │    │   Docker    │    │  atualizado │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

---

## Docker - Desenvolvimento e Produção

### Dockerfile.dev

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm ci

# Astro dev server com hot reload
EXPOSE 4321

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### Dockerfile.prod

```dockerfile
# ============================================
# Build stage
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm ci

# Copia source e content
COPY . .

# Build do Astro
RUN npm run build

# ============================================
# Production stage
# ============================================
FROM nginx:alpine

# Copia arquivos estáticos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração do Nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf

```nginx
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Gzip
        gzip on;
        gzip_types text/plain text/css application/json application/javascript text/xml;

        # SPA fallback
        location / {
            try_files $uri $uri/ $uri.html =404;
        }

        # Cache estático
        location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### docker-compose.yml (Desenvolvimento)

```yaml
version: "3.8"

services:
  gaeia-dev:
    build:
      context: .
      dockerfile: docker/Dockerfile.dev
    container_name: gaeia-dev
    ports:
      - "4321:4321"
    volumes:
      # Hot reload: mudanças refletem instantaneamente
      - .:/app
      - /app/node_modules
      # Vault como conteúdo (read-only)
      - ../:/app/content:ro
    environment:
      - NODE_ENV=development
```

### docker-compose.prod.yml (Produção)

```yaml
version: "3.8"

services:
  gaeia-prod:
    build:
      context: .
      dockerfile: docker/Dockerfile.prod
    container_name: gaeia-prod
    ports:
      - "3000:80"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

### Scripts de Conveniência

**rebuild.sh**
```bash
#!/bin/bash
set -e

echo "🔄 Rebuilding GAEIA Web (Production)..."
docker compose -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.prod.yml up -d
echo "✅ Site atualizado em http://localhost:3000"
```

**dev.sh**
```bash
#!/bin/bash
echo "🚀 Starting GAEIA Web (Development)..."
docker compose up
```

### Comandos

| Ambiente | Comando | URL |
|----------|---------|-----|
| **Dev** | `docker compose up` | http://localhost:4321 |
| **Dev** | `./dev.sh` | http://localhost:4321 |
| **Prod** | `docker compose -f docker-compose.prod.yml up -d` | http://localhost:3000 |
| **Prod** | `./rebuild.sh` | http://localhost:3000 |
| **Parar** | `docker compose down` | - |

### Comparação

| Aspecto | Desenvolvimento | Produção |
|---------|-----------------|----------|
| Hot reload | ✅ Instantâneo | ❌ Precisa rebuild |
| Source maps | ✅ Debug fácil | ❌ Minificado |
| Servidor | Astro dev server | Nginx otimizado |
| Imagem | ~300MB (node) | ~25MB (nginx alpine) |
| Performance | Normal | Otimizada |
| Porta | 4321 | 3000 |

---

## Stack Técnica

### Dependências

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Framework | Astro | 4.x |
| Estilização | Tailwind CSS | 3.x |
| Markdown | MDX (via Astro) | 2.x |
| Servidor (dev) | Astro dev server | - |
| Servidor (prod) | Nginx Alpine | 1.25 |
| Container | Docker | 24+ |
| Compose | Docker Compose | 2.x |
| Runtime | Node.js | 20 LTS |

### package.json

```json
{
  "name": "gaeia-web",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.0.0",
    "@astrojs/mdx": "^2.0.0",
    "@astrojs/tailwind": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "js-yaml": "^4.1.0"
  },
  "devDependencies": {
    "@types/js-yaml": "^4.0.9"
  }
}
```

### astro.config.mjs

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  integrations: [tailwind(), mdx()],
  content: {
    collections: {
      guia: {
        schema: {
          title: 'string',
          status: 'string',
          progress: 'number',
          badges: 'array',
        }
      }
    }
  }
});
```

### Requisitos do Sistema

- Docker e Docker Compose instalados
- ~500MB espaço em disco
- Porta 3000 (prod) e 4321 (dev) disponíveis
- Node.js 20+ (apenas para desenvolvimento local sem Docker)

---

## Implementação

### Fase 1: Setup Inicial

1. Criar estrutura de pastas do projeto
2. Configurar Astro + Tailwind
3. Configurar Docker (dev + prod)
4. Criar symlink para o vault
5. Testar build básico

### Fase 2: Layout e Navegação

1. Criar `BaseLayout.astro` com sidebar
2. Implementar navegação lateral
3. Criar rotas dinâmicas para conteúdo
4. Implementar responsividade
5. Aplicar paleta dark mode

### Fase 3: Renderização de Conteúdo

1. Configurar MDX para processar markdown
2. Renderizar frontmatter
3. Implementar `Checklist.astro`
4. Criar estilos para código e tabelas
5. Testar com conteúdo do vault

### Fase 4: Gamificação

1. Criar `badges.yml` no vault
2. Implementar `ProgressBar.astro`
3. Implementar `BadgeDisplay.astro`
4. Criar cálculo automático de progresso
5. Implementar `JourneyMap.astro`

### Fase 5: Páginas Especiais

1. Criar página `/conquistas`
2. Criar página `/jornada`
3. Implementar home com visão geral
4. Adicionar "próximos passos"
5. Testar fluxo completo

### Fase 6: Polimento

1. Otimizar performance
2. Adicionar transições
3. Testar responsividade
4. Documentar uso
5. Criar README do projeto

---

## Próximos Passos

Após aprovação deste documento:

1. **Criar repositório** `gaeia-web` ao lado do vault
2. **Implementar Fase 1** (setup inicial)
3. **Validar** ambiente Docker funcionando
4. **Iterar** nas fases seguintes

---

## Versões Futuras

### v1.1 - Quizzes NotebookLM
- Integração com quizzes gerados pelo NotebookLM
- Embed de áudios/podcasts gerados
- Tracking de quizzes completados

### v1.2 - Melhorias de UX
- Busca global
- Atalhos de teclado
- Modo de foco para leitura

### v1.3 - Social
- Comentários (via GitHub Discussions?)
- Perfis de membros
- Leaderboard opcional

---

*Documento gerado em 2026-02-02*
*GAEIA - Grupo Autônomo de Estudos em IA*
