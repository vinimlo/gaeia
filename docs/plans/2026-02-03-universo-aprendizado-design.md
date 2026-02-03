# Universo de Aprendizado - Documento de Design

> Transformação da plataforma GAEIA em um sistema multi-curso

**Data:** 2026-02-03
**Status:** Proposto
**Versão:** 1.0

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Modelo Conceitual](#modelo-conceitual)
3. [Hierarquia e Navegação](#hierarquia-e-navegação)
4. [Decisões de Design](#decisões-de-design)
5. [Cursos Planejados](#cursos-planejados)
6. [Interface do Usuário](#interface-do-usuário)
7. [Fases de Implementação](#fases-de-implementação)
8. [Verificação](#verificação)

---

## Visão Geral

### Objetivo

Transformar a plataforma GAEIA de um único curso para um **Universo de Aprendizado** com múltiplos cursos organizados hierarquicamente usando metáfora astronômica.

### Motivação

- O curso atual "Construa sua LLM do Zero" é apenas o início
- Novos conteúdos estão sendo desenvolvidos (IA & LLMs Prático)
- Necessidade de organizar múltiplos cursos de forma escalável
- Manter a experiência gamificada existente

### Princípios

- **Backward compatible** — dados existentes são preservados
- **Progressão sequencial** — dentro de um curso, as unidades são sequenciais
- **Liberdade entre cursos** — usuários podem explorar cursos em paralelo
- **Gamificação híbrida** — badges por curso + badges globais
- **Vault como fonte de verdade** — conteúdo continua vindo do Obsidian

---

## Modelo Conceitual

### Metáfora Astronômica

```
🌌 UNIVERSO (Plataforma GAEIA)
│
├── ☀️ SISTEMA SOLAR: Fundamentos
│   │
│   └── 🪐 PLANETA: LLM do Zero
│       ├── 🌙 Órbita 1: Neurônio e Vetores
│       ├── 🌙 Órbita 2: MLP e Matrizes
│       ├── 🌙 Órbita 3: Loss e Derivadas
│       ├── 🌙 Órbita 4: Backpropagation
│       ├── 🌙 Órbita 5: Embeddings e Texto
│       ├── 🌙 Órbita 6: Self-Attention
│       ├── 🌙 Órbita 7: Transformer Completo
│       ├── 🌙 Órbita 8: Tokenização
│       └── 🌙 Órbita 9: Seu GPT
│
├── ☀️ SISTEMA SOLAR: Aplicações
│   │
│   └── 🪐 PLANETA: IA & LLMs Prático
│       ├── 🌙 Órbita 1-4: Fundamentos de IA
│       ├── 🌙 Órbita 5-8: LLMs e Prompting
│       ├── 🌙 Órbita 9-12: Aplicações Avançadas
│       ├── 🌙 Órbita 13-16: Agentes e Automação
│       ├── 🌙 Órbita 17-20: Produção e Deploy
│       └── 🌙 Órbita 21-24: Projeto Final
│
└── ☀️ SISTEMA SOLAR: Especializações (futuro)
    └── 🪐 [Cursos futuros]
```

### Mapeamento de Conceitos

| Conceito Astronômico | Conceito Educacional | Exemplo |
|----------------------|----------------------|---------|
| Universo | Plataforma completa | GAEIA |
| Sistema Solar | Categoria temática | Fundamentos, Aplicações |
| Planeta | Curso individual | LLM do Zero |
| Órbita | Unidade do curso | Bloco, Semana |

---

## Hierarquia e Navegação

### Níveis de Navegação

| Nível | Nome | Descrição | Navegação |
|-------|------|-----------|-----------|
| 1 | Universo | Toda a plataforma | Entrada principal |
| 2 | Sistema Solar | Categoria temática | Livre entre sistemas |
| 3 | Planeta | Curso individual | Livre entre planetas |
| 4 | Órbita | Unidade do curso | **Sequencial obrigatório** |

### Regras de Navegação

1. **Entre Sistemas/Planetas:** Navegação livre
   - Usuário pode iniciar múltiplos cursos em paralelo
   - Não há pré-requisitos obrigatórios entre cursos
   - Pré-requisitos são apenas sugestões

2. **Dentro de um Planeta (Órbitas):** Sequencial obrigatório
   - Órbita N só é desbloqueada quando Órbita N-1 estiver completa
   - Progresso é baseado no checklist completado
   - Primeira órbita sempre desbloqueada

### Exemplo de Fluxo

```
Usuário novo:
  1. Acessa homepage → Vê mapa do universo
  2. Clica em "Fundamentos" → Vê curso LLM do Zero
  3. Inicia Bloco 1 → Completa checklist
  4. Bloco 2 desbloqueia → Continua sequência

Usuário paralelo:
  1. Está no Bloco 5 do LLM do Zero
  2. Decide explorar "Aplicações"
  3. Inicia IA & LLMs Prático (Semana 1)
  4. Progresso de ambos cursos é independente
```

---

## Decisões de Design

### D1: Gamificação Híbrida

**Decisão:** Implementar dois níveis de badges

**Por curso:**
- Badges específicos para cada curso
- Baseados em blocos/semanas completados
- Critérios definidos no `course.json`

**Globais:**
- "Explorador" — Iniciar 2+ cursos
- "Engenheiro Full-Stack AI" — Completar Fundamentos + Aplicações
- "Maratonista" — Streak global de 30 dias
- "Colecionador" — Obter 10 badges de qualquer curso

**Razão:** Incentiva tanto profundidade (completar cursos) quanto amplitude (explorar múltiplos cursos)

### D2: UI com Toggle Mapa/Catálogo

**Decisão:** Oferecer duas visualizações

1. **Mapa Visual:** Representação astronômica interativa
   - Sistemas solares com planetas orbitando
   - Visual imersivo e gamificado
   - Melhor para descoberta

2. **Catálogo em Cards:** Grid tradicional
   - Cards com nome, descrição, progresso
   - Mais funcional e direto
   - Melhor para navegação rápida

**Razão:** Diferentes usuários têm preferências diferentes; toggle permite escolha

### D3: Migração Automática de Progresso

**Decisão:** Converter dados existentes automaticamente

- Detectar formato antigo no localStorage
- Mapear para novo formato namespaced
- Executar uma vez, marcar como completo
- Não perder nenhum dado do usuário

**Razão:** Backward compatibility é essencial; usuários não devem perder progresso

### D4: Nomenclatura Flexível de Unidades

**Decisão:** Cada curso define sua nomenclatura

- LLM do Zero: "Bloco" / "Blocos"
- IA & LLMs Prático: "Semana" / "Semanas"
- Definido no `course.json` como `unitName` / `unitNamePlural`

**Razão:** Diferentes cursos têm diferentes estruturas; flexibilidade é importante

### D5: Lazy Loading para Cursos Grandes

**Decisão:** Implementar carregamento sob demanda

- Catálogo carrega apenas metadados inicialmente
- Conteúdo do curso carrega ao abrir o curso
- Unidades carregam individualmente

**Razão:** Curso de 24 semanas pode ser pesado; performance importa

---

## Cursos Planejados

### Curso 1: Construa sua LLM do Zero

| Atributo | Valor |
|----------|-------|
| ID | `llm-do-zero` |
| Sistema | Fundamentos |
| Unidades | 9 Blocos |
| Dificuldade | Intermediário |
| Horas Estimadas | 40h |
| Status | **Existente** (migrar) |

**Estrutura:**
- Bloco 1-4: Fundamentos de redes neurais
- Bloco 5-6: Processamento de texto
- Bloco 7-9: Arquitetura Transformer e GPT

### Curso 2: IA & LLMs Prático

| Atributo | Valor |
|----------|-------|
| ID | `ia-llms-pratico` |
| Sistema | Aplicações |
| Unidades | 24 Semanas |
| Dificuldade | Iniciante → Avançado |
| Horas Estimadas | 96h |
| Status | **Novo** (criar estrutura) |

**Estrutura:**
- Semanas 1-4: Fundamentos de IA e APIs
- Semanas 5-8: LLMs e Prompt Engineering
- Semanas 9-12: RAG e Aplicações
- Semanas 13-16: Agentes e Automação
- Semanas 17-20: Produção e Deploy
- Semanas 21-24: Projeto Final

---

## Interface do Usuário

### Homepage (Entrada do Universo)

```
┌──────────────────────────────────────────────────────────────┐
│  🌌 GAEIA - Universo de Aprendizado                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Seu Progresso Global                                    │ │
│  │  ████████░░░░░░░░░░░░  35%                              │ │
│  │  2 cursos iniciados • 1 em andamento • 12 badges        │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  [🗺️ Mapa Visual] [📋 Catálogo]  ← Toggle de visualização   │
│                                                              │
│  ┌───────────────┐  ┌───────────────┐                       │
│  │ ☀️ Fundamentos │  │ ☀️ Aplicações  │                       │
│  │               │  │               │                       │
│  │ 🪐 LLM Zero   │  │ 🪐 IA Prático │                       │
│  │   56% ████░░  │  │   12% █░░░░░  │                       │
│  │               │  │               │                       │
│  │ [Continuar]   │  │ [Continuar]   │                       │
│  └───────────────┘  └───────────────┘                       │
│                                                              │
│  🔥 Streak: 7 dias • 🏆 Próximo badge: Dedicado (30 dias)   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Página do Curso

```
┌──────────────────────────────────────────────────────────────┐
│  ← Universo    🪐 Construa sua LLM do Zero                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  Progresso: 5/9 Blocos                                   │ │
│  │  █████████████████░░░░░░░  56%                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Badges do Curso: 🧠 📐 📉 🔴 📝 🔒 🔒 🔒 🔒                 │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ ✅ Bloco 1 - Neurônio e Vetores           [Revisar]     │ │
│  │ ✅ Bloco 2 - MLP e Matrizes               [Revisar]     │ │
│  │ ✅ Bloco 3 - Loss e Derivadas             [Revisar]     │ │
│  │ ✅ Bloco 4 - Backpropagation              [Revisar]     │ │
│  │ ✅ Bloco 5 - Embeddings e Texto           [Revisar]     │ │
│  │ 🔵 Bloco 6 - Self-Attention    45%        [Continuar]   │ │
│  │ 🔒 Bloco 7 - Transformer Completo                       │ │
│  │ 🔒 Bloco 8 - Tokenização                                │ │
│  │ 🔒 Bloco 9 - Seu GPT                                    │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Fases de Implementação

### Fase 1: Estrutura de Dados e Configuração

**Objetivo:** Criar a infraestrutura de configuração multi-curso

**Entregáveis:**
1. Criar estrutura de diretórios `universe/`
2. Implementar `_catalog.json`
3. Criar `course.json` para LLM do Zero
4. Preparar `course.json` para IA & LLMs Prático
5. Criar `global-badges.json`

**Documentação:** [architecture/multi-course-system.md](../architecture/multi-course-system.md)

### Fase 2: Refatoração do Sistema de Progresso

**Objetivo:** Adaptar o código existente para suportar múltiplos cursos

**Entregáveis:**
1. Atualizar `progressStore.ts` com namespace por curso
2. Atualizar `badges.ts` com badges globais
3. Atualizar `content.ts` com funções multi-curso
4. Implementar migração de dados

**Documentação:** [migration/progress-migration.md](../migration/progress-migration.md)

### Fase 3: Novas Páginas e Componentes

**Objetivo:** Criar interface para navegação do universo

**Entregáveis:**
1. Criar `UniverseMap.astro`
2. Criar `CourseCatalog.astro`
3. Criar `CourseCard.astro`
4. Refatorar `index.astro`
5. Criar rotas dinâmicas

### Fase 4: Migração de Conteúdo

**Objetivo:** Reorganizar conteúdo existente na nova estrutura

**Entregáveis:**
1. Mover conteúdo do LLM do Zero
2. Estruturar conteúdo do IA & LLMs Prático
3. Atualizar referências internas

### Fase 5: Migração de Dados de Usuário

**Objetivo:** Converter dados existentes para novo formato

**Entregáveis:**
1. Implementar script de migração
2. Testar preservação de dados
3. Marcar migração como completa

---

## Verificação

### Critérios de Aceitação

1. **Funcional:**
   - [ ] Navegação Universo → Sistema → Curso → Unidade funciona
   - [ ] Cursos em paralelo funcionam independentemente
   - [ ] Desbloqueio sequencial de unidades funciona

2. **Progresso:**
   - [ ] Checklist salva progresso corretamente
   - [ ] Progresso é isolado por curso
   - [ ] Streak global é calculado corretamente

3. **Badges:**
   - [ ] Badges de curso são concedidos corretamente
   - [ ] Badges globais são concedidos corretamente
   - [ ] Datas de conquista são preservadas

4. **Migração:**
   - [ ] Dados existentes são detectados
   - [ ] Migração preserva todo progresso
   - [ ] Migração executa apenas uma vez

5. **UI:**
   - [ ] Toggle mapa/catálogo funciona
   - [ ] Cards mostram informações corretas
   - [ ] Responsivo em mobile e desktop

---

## Documentos Relacionados

- [Arquitetura Técnica](../architecture/multi-course-system.md)
- [Especificação de Schemas](../schemas/catalog-schema.md)
- [Guia de Migração](../migration/progress-migration.md)
- [Design Original GAEIA Web](./2026-02-02-gaeia-web-design.md)

---

*Documento criado em 2026-02-03*
*GAEIA - Grupo Autônomo de Estudos em Inteligência Artificial*
