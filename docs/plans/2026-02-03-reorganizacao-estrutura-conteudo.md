# Reorganização da Estrutura de Conteúdo - GAEIA

**Data:** 2026-02-03
**Status:** Documentado para implementação futura

---

## Princípio Fundamental

> **O site é APENAS um espelho perfeito do vault Obsidian.**
>
> Toda estrutura, organização e metadados vivem no vault.
> O site apenas descobre e renderiza o que existe lá.

---

## 1. Contexto e Problemas

### Cursos Disponíveis
| Curso | Descrição | Público |
|-------|-----------|---------|
| **LLM do Zero** | Entender como LLMs funcionam (teoria) | Iniciantes, curiosos |
| **IA Prática** | Aplicar em projetos reais (hands-on) | Desenvolvedores |

Os cursos são **complementares com sobreposição** - tópicos como embeddings, RAG, transformers aparecem em ambos.

### Problemas Atuais
1. **Conteúdos espalhados** - `01-Guia-de-Estudos/`, `02-Roadmap-AI-Engineer/`, `universe/`
2. **Rotas duplicadas** - `/guia`, `/roadmap`, `/[sistema]/[curso]` apontam para conteúdos similares
3. **Sem conexão entre cursos** - Não há indicação de tópicos relacionados
4. **Duplicação de conteúdo** - Mesmo assunto escrito múltiplas vezes

---

## 2. Solução: Biblioteca de Tópicos + Trilhas

### Conceitos

| Conceito | Definição |
|----------|-----------|
| **Tópico** | Unidade atômica de conteúdo (um arquivo .md sobre um assunto) |
| **Trilha** | Curso que define sequência de tópicos organizados em módulos |
| **Módulo** | Agrupamento lógico de tópicos dentro de uma trilha |

### Benefícios
- **Zero duplicação** - Um tópico, múltiplas trilhas
- **Manutenção simples** - Atualizar tópico reflete em todas as trilhas
- **Escalável** - Fácil adicionar novas trilhas reusando tópicos
- **Conexões claras** - Tópicos linkam entre si

---

## 3. Estrutura do Vault (Fonte Única de Verdade)

```
AI-Engineer/                          # Raiz do vault Obsidian
│
├── universe/                         # Nova estrutura organizada
│   │
│   ├── _catalog.json                 # Catálogo geral (sistemas, metadados)
│   │
│   ├── topicos/                      # 📚 Biblioteca de conteúdos atômicos
│   │   ├── _index.json               # Índice de todos os tópicos
│   │   ├── neuronio-e-vetores.md
│   │   ├── mlp-e-matrizes.md
│   │   ├── loss-e-derivadas.md
│   │   ├── backpropagation.md
│   │   ├── embeddings-texto.md
│   │   ├── self-attention.md
│   │   ├── transformer.md
│   │   ├── tokenizacao.md
│   │   ├── seu-gpt.md
│   │   ├── prompt-engineering.md
│   │   ├── rag-fundamentos.md
│   │   ├── vector-databases.md
│   │   └── ... (outros tópicos)
│   │
│   └── trilhas/                      # 🛤️ Cursos como sequências de tópicos
│       │
│       ├── llm-do-zero/
│       │   ├── course.json           # Metadados + sequência de tópicos
│       │   └── extras/               # Conteúdo exclusivo (opcional)
│       │
│       └── ia-pratica/
│           ├── course.json
│           └── extras/
│
├── 01-Guia-de-Estudos/               # ⚠️ LEGADO - migrar para universe/topicos
├── 02-Roadmap-AI-Engineer/           # ⚠️ LEGADO - migrar para universe/topicos
└── ...
```

---

## 4. Formatos de Arquivo

### 4.1 Catálogo Geral (`universe/_catalog.json`)

```json
{
  "version": "2.0",
  "nome": "GAEIA - Grupo Autônomo de Estudos em IA",
  "descricao": "Sua jornada em IA começa aqui",

  "trilhas": [
    {
      "id": "llm-do-zero",
      "path": "trilhas/llm-do-zero"
    },
    {
      "id": "ia-pratica",
      "path": "trilhas/ia-pratica"
    }
  ],

  "topicos": {
    "path": "topicos",
    "indexFile": "_index.json"
  }
}
```

### 4.2 Índice de Tópicos (`universe/topicos/_index.json`)

```json
{
  "topicos": [
    {
      "id": "neuronio-e-vetores",
      "arquivo": "neuronio-e-vetores.md",
      "tags": ["fundamentos", "matematica", "neural"]
    },
    {
      "id": "embeddings-texto",
      "arquivo": "embeddings-texto.md",
      "tags": ["nlp", "vetores", "representacao"]
    },
    {
      "id": "rag-fundamentos",
      "arquivo": "rag-fundamentos.md",
      "tags": ["rag", "retrieval", "aplicacao"]
    }
  ]
}
```

### 4.3 Definição de Trilha (`universe/trilhas/llm-do-zero/course.json`)

```json
{
  "id": "llm-do-zero",
  "nome": "LLM do Zero",
  "descricao": "Entenda como LLMs funcionam por dentro, construindo um do zero",
  "icone": "🧠",
  "nivel": "iniciante",
  "horasEstimadas": 80,

  "modulos": [
    {
      "id": "fundamentos-matematicos",
      "nome": "Fundamentos Matemáticos",
      "descricao": "A base necessária para entender redes neurais",
      "topicos": [
        "neuronio-e-vetores",
        "mlp-e-matrizes",
        "loss-e-derivadas",
        "backpropagation"
      ]
    },
    {
      "id": "arquitetura-transformer",
      "nome": "Arquitetura Transformer",
      "descricao": "Como a atenção revolucionou NLP",
      "topicos": [
        "embeddings-texto",
        "self-attention",
        "transformer",
        "tokenizacao"
      ]
    },
    {
      "id": "construindo-gpt",
      "nome": "Construindo seu GPT",
      "descricao": "Colocando tudo junto",
      "topicos": [
        "seu-gpt"
      ]
    }
  ],

  "badges": [
    {
      "id": "primeiro-neuronio",
      "nome": "Primeiro Neurônio",
      "descricao": "Completou o primeiro tópico",
      "icone": "🔬",
      "condicao": { "topicosCompletos": 1 }
    },
    {
      "id": "arquiteto-transformer",
      "nome": "Arquiteto Transformer",
      "descricao": "Dominou a arquitetura transformer",
      "icone": "🏗️",
      "condicao": { "moduloCompleto": "arquitetura-transformer" }
    },
    {
      "id": "mestre-llm",
      "nome": "Mestre LLM",
      "descricao": "Completou toda a trilha",
      "icone": "🎓",
      "condicao": { "trilhaCompleta": true }
    }
  ]
}
```

### 4.4 Formato de Tópico (`.md` com frontmatter)

```markdown
---
titulo: "Embeddings de Texto"
tags: ["nlp", "vetores", "representacao"]
prerequisitos: ["neuronio-e-vetores"]
nivel: "intermediario"
tempoEstimado: 45
autor: "GAEIA"
ultimaAtualizacao: "2026-02-03"
---

# Embeddings de Texto

## Introdução

Embeddings são representações vetoriais densas que capturam significado semântico...

## O que você vai aprender

- Como textos são convertidos em vetores
- Por que embeddings são melhores que one-hot encoding
- Como visualizar e interpretar embeddings

## Conteúdo Principal

### O Problema da Representação

[Conteúdo detalhado...]

### De One-Hot para Embeddings Densos

[Conteúdo detalhado...]

### Word2Vec e além

[Conteúdo detalhado...]

## Checklist de Aprendizado

- [ ] Entendi a diferença entre one-hot e embeddings densos
- [ ] Sei explicar por que dimensionalidade menor captura mais significado
- [ ] Consegui visualizar embeddings em 2D/3D
- [ ] Implementei um embedding simples em código

## Recursos Adicionais

- 📹 [Vídeo: Word2Vec Explained](url)
- 📄 [Paper: Efficient Estimation of Word Representations](url)
- 💻 [Notebook: Explorando Embeddings](url)

## Conexões

> 🔬 **Fundamento:** Este tópico usa conceitos de [[neuronio-e-vetores]]
>
> 🚀 **Na prática:** Veja como usar embeddings com LangChain em [[embeddings-aplicado]]
>
> ➡️ **Próximo passo:** Entenda como atenção usa embeddings em [[self-attention]]
```

---

## 5. Como o Site Espelha o Vault

### Princípio de Descoberta Automática

O site **descobre** a estrutura do vault em tempo de build:

```
1. Lê universe/_catalog.json
   ↓
2. Para cada trilha em catalog.trilhas:
   - Lê course.json
   - Monta lista de tópicos
   ↓
3. Para cada tópico referenciado:
   - Lê arquivo .md de universe/topicos/
   - Parseia frontmatter + conteúdo
   ↓
4. Gera rotas estáticas
```

### Mapeamento Vault → Rotas

| Arquivo no Vault | Rota no Site |
|------------------|--------------|
| `universe/_catalog.json` | `/` (home) |
| `universe/trilhas/llm-do-zero/course.json` | `/trilhas/llm-do-zero` |
| `universe/topicos/embeddings-texto.md` | `/trilhas/*/embeddings-texto` e `/topicos/embeddings-texto` |
| `universe/topicos/_index.json` | `/topicos` (listagem) |

### O que o site NÃO faz

- ❌ Não define estrutura própria
- ❌ Não hardcoda nomes de trilhas/tópicos
- ❌ Não mantém metadados fora do vault
- ❌ Não duplica conteúdo

---

## 6. Rotas do Site

```
/                                    # Home: catálogo de trilhas + busca de tópicos

/trilhas                             # Lista todas as trilhas disponíveis
/trilhas/llm-do-zero                 # Página da trilha: módulos, progresso, badges
/trilhas/llm-do-zero/embeddings-texto # Tópico COM contexto de trilha (nav anterior/próximo)

/topicos                             # Biblioteca: todos os tópicos, busca por tags
/topicos/embeddings-texto            # Tópico SEM contexto de trilha (modo exploração)

/conquistas                          # Badges e progresso global
```

### Comportamento das Rotas

**`/trilhas/[trilha]/[topico]`**
- Mostra o tópico com navegação da trilha
- Barra lateral com módulos da trilha
- Botões "Anterior" / "Próximo" baseados na sequência do course.json
- Progresso no contexto da trilha

**`/topicos/[topico]`**
- Mostra o tópico de forma independente
- Sidebar com tópicos relacionados (por tags)
- Seção "Este tópico aparece nas trilhas: X, Y"
- Modo exploração/referência

---

## 7. Sistema de Progresso

### Regra Fundamental

> **Progresso é salvo por TÓPICO, não por trilha.**

```javascript
// localStorage structure
{
  "gaeia-progress": {
    "topicos": {
      "embeddings-texto": {
        "completo": true,
        "checklist": [true, true, true, false],
        "dataInicio": "2026-02-01",
        "dataConclusao": "2026-02-03"
      },
      "transformer": {
        "completo": false,
        "checklist": [true, false, false, false],
        "dataInicio": "2026-02-03"
      }
    },
    "streak": {
      "atual": 5,
      "maximo": 12,
      "ultimoDia": "2026-02-03"
    },
    "badges": ["primeiro-neuronio", "arquiteto-transformer"]
  }
}
```

### Comportamento

1. Usuário completa "embeddings-texto" na trilha "LLM do Zero"
2. Progresso salvo em `topicos["embeddings-texto"]`
3. Se "embeddings-texto" também está em "IA Prática":
   - Aparece como completo lá também ✓
   - Progresso da trilha recalcula automaticamente

### Benefício

Usuário que completou "LLM do Zero" e inicia "IA Prática" já tem tópicos compartilhados completos. Incentiva explorar ambas as trilhas.

---

## 8. Migração do Conteúdo Existente

### Fase 1: LLM do Zero (Migração Direta)

Os blocos já são tópicos bem definidos. Migração 1:1 preservando linearidade:

| Origem | Destino |
|--------|---------|
| `01-Guia-de-Estudos/Bloco-01-Neuronio-Vetores.md` | `universe/topicos/neuronio-e-vetores.md` |
| `01-Guia-de-Estudos/Bloco-02-MLP-Matrizes.md` | `universe/topicos/mlp-e-matrizes.md` |
| `01-Guia-de-Estudos/Bloco-03-Loss-Derivadas.md` | `universe/topicos/loss-e-derivadas.md` |
| `01-Guia-de-Estudos/Bloco-04-Backpropagation.md` | `universe/topicos/backpropagation.md` |
| `01-Guia-de-Estudos/Bloco-05-Embeddings-Texto.md` | `universe/topicos/embeddings-texto.md` |
| `01-Guia-de-Estudos/Bloco-06-Self-Attention.md` | `universe/topicos/self-attention.md` |
| `01-Guia-de-Estudos/Bloco-07-Transformer.md` | `universe/topicos/transformer.md` |
| `01-Guia-de-Estudos/Bloco-08-Tokenizacao.md` | `universe/topicos/tokenizacao.md` |
| `01-Guia-de-Estudos/Bloco-09-Seu-GPT.md` | `universe/topicos/seu-gpt.md` |

**Ações necessárias:**
1. Copiar conteúdo
2. Adicionar/padronizar frontmatter
3. Adicionar seção "Conexões"
4. Verificar checklist existe

### Fase 2: IA Prática (Consolidação)

O Roadmap tem arquivos fragmentados. Consolidar em tópicos coesos:

| Origem (múltiplos arquivos) | Destino |
|-----------------------------|---------|
| `02-Roadmap-AI-Engineer/03-Prompt-Engineering/*.md` | `universe/topicos/prompt-engineering.md` |
| `02-Roadmap-AI-Engineer/06-AI-Safety-and-Ethics/what-are-embeddings.md` + relacionados | `universe/topicos/embeddings-aplicado.md` |
| `02-Roadmap-AI-Engineer/07-Handling-User-Input/vector-databases.md` + `09-Vector-Databases/*` | `universe/topicos/vector-databases.md` |
| `02-Roadmap-AI-Engineer/10-RAG-Fundamentals/*` | `universe/topicos/rag-fundamentos.md` |
| `02-Roadmap-AI-Engineer/09-Vector-Databases/ai-agents.md` + `99-Extras/ai-agents.md` | `universe/topicos/ai-agents.md` |
| ... | ... |

**Ações necessárias:**
1. Analisar arquivos relacionados
2. Mesclar em tópico único e coeso
3. Remover duplicações
4. Padronizar frontmatter
5. Criar checklist se não existir

### Fase 3: Limpeza

Após migração completa e verificação:
1. Backup das pastas antigas
2. Remover `01-Guia-de-Estudos/`
3. Remover `02-Roadmap-AI-Engineer/`
4. Manter apenas `universe/`

---

## 9. Página Inicial

```
┌─────────────────────────────────────────────────────────────────┐
│                          GAEIA                                  │
│              Sua jornada em IA começa aqui                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📘 Trilhas de Aprendizado                                      │
│                                                                 │
│  ┌─────────────────────────┐  ┌─────────────────────────┐      │
│  │  🧠 LLM do Zero         │  │  🚀 IA Prática          │      │
│  │                         │  │                         │      │
│  │  Entenda como LLMs      │  │  Aplique IA em          │      │
│  │  funcionam por dentro   │  │  projetos reais         │      │
│  │                         │  │                         │      │
│  │  ░░░░░░░░░░ 30%        │  │  ░░░░░░░░░░ 0%         │      │
│  │  80h · 9 tópicos        │  │  200h · 24 tópicos      │      │
│  │                         │  │                         │      │
│  │  [Continuar]            │  │  [Começar]              │      │
│  └─────────────────────────┘  └─────────────────────────┘      │
│                                                                 │
│  📚 Explorar Tópicos                                            │
│                                                                 │
│  [embeddings] [RAG] [transformers] [prompt-engineering]         │
│  [vector-databases] [attention] [tokenização] [ver todos →]    │
│                                                                 │
│  🔥 Streak: 5 dias                         🏆 3 badges          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 10. Implementação no Site

### Arquivos a Criar/Modificar

**Utilitários (`src/utils/`):**
```
trilhas.ts      # Funções para carregar e navegar trilhas
topicos.ts      # Funções para carregar tópicos
catalog.ts      # Atualizar para nova estrutura
progress.ts     # Atualizar para progresso por tópico
```

**Páginas (`src/pages/`):**
```
index.astro                    # Atualizar home
trilhas/
  index.astro                  # Lista de trilhas
  [trilha]/
    index.astro                # Página da trilha
    [topico].astro             # Tópico no contexto da trilha
topicos/
  index.astro                  # Biblioteca de tópicos
  [topico].astro               # Tópico avulso
```

**Remover:**
```
guia/                          # Substituído por trilhas/llm-do-zero
roadmap/                       # Conteúdo migrado para topicos
[sistema]/                     # Simplificado para trilhas/
```

### Lógica de Descoberta

```typescript
// src/utils/trilhas.ts

import { UNIVERSE_DIR } from './constants';

export async function getCatalog() {
  const catalogPath = path.join(UNIVERSE_DIR, '_catalog.json');
  return JSON.parse(await fs.readFile(catalogPath, 'utf-8'));
}

export async function getTrilha(trilhaId: string) {
  const catalog = await getCatalog();
  const trilhaRef = catalog.trilhas.find(t => t.id === trilhaId);
  const coursePath = path.join(UNIVERSE_DIR, trilhaRef.path, 'course.json');
  return JSON.parse(await fs.readFile(coursePath, 'utf-8'));
}

export async function getTopico(topicoId: string) {
  const topicoPath = path.join(UNIVERSE_DIR, 'topicos', `${topicoId}.md`);
  const content = await fs.readFile(topicoPath, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(content);
  return { ...frontmatter, content: body, id: topicoId };
}

export async function getTrilhaTopicos(trilhaId: string) {
  const trilha = await getTrilha(trilhaId);
  const topicoIds = trilha.modulos.flatMap(m => m.topicos);
  return Promise.all(topicoIds.map(getTopico));
}
```

---

## 11. Checklist de Verificação

### Estrutura do Vault
- [ ] `universe/_catalog.json` existe e é válido
- [ ] `universe/topicos/_index.json` lista todos os tópicos
- [ ] Cada trilha tem `course.json` válido
- [ ] Todos os tópicos referenciados existem em `universe/topicos/`
- [ ] Todos os tópicos têm frontmatter padronizado
- [ ] Todos os tópicos têm checklist

### Site
- [ ] Home mostra trilhas e tópicos
- [ ] `/trilhas` lista todas as trilhas
- [ ] `/trilhas/[trilha]` mostra módulos e progresso
- [ ] `/trilhas/[trilha]/[topico]` renderiza conteúdo com navegação
- [ ] `/topicos` lista todos os tópicos com busca
- [ ] `/topicos/[topico]` renderiza conteúdo sem contexto de trilha

### Progresso
- [ ] Progresso salvo por tópico funciona
- [ ] Completar tópico em uma trilha reflete em outras
- [ ] Badges são concedidos corretamente
- [ ] Streak funciona

### Migração
- [ ] Todo conteúdo de 01-Guia-de-Estudos migrado
- [ ] Todo conteúdo relevante de 02-Roadmap migrado
- [ ] Progresso antigo migrado (se aplicável)
- [ ] Rotas antigas removidas ou redirecionam

---

## 12. Notas para Implementação Futura

1. **Comece pelo vault** - Crie a estrutura de arquivos primeiro, depois adapte o site
2. **Migre LLM do Zero primeiro** - É mais simples (1:1) e valida a estrutura
3. **Teste descoberta automática** - O site deve funcionar só lendo o vault
4. **Preserve progresso existente** - Script de migração localStorage
5. **IA Prática pode esperar** - Consolidação é mais trabalhosa, faça depois

### Ordem Sugerida de Implementação

```
1. Criar estrutura universe/topicos e universe/trilhas
2. Migrar 9 blocos do LLM do Zero
3. Criar course.json para LLM do Zero
4. Atualizar site para nova estrutura
5. Testar trilha LLM do Zero funcionando
6. Consolidar conteúdo IA Prática
7. Criar course.json para IA Prática
8. Migrar progresso antigo
9. Remover rotas e conteúdo legado
```
