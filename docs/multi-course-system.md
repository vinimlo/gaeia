# Arquitetura Técnica - Sistema Multi-Curso

> Especificação técnica para transformação da plataforma GAEIA em sistema multi-curso

**Data:** 2026-02-03
**Versão:** 1.0

---

## Sumário

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Estrutura de Diretórios](#estrutura-de-diretórios)
3. [Arquivos de Configuração](#arquivos-de-configuração)
4. [Modificações em Arquivos Existentes](#modificações-em-arquivos-existentes)
5. [Novos Componentes](#novos-componentes)
6. [Sistema de Rotas](#sistema-de-rotas)
7. [Fluxo de Dados](#fluxo-de-dados)
8. [Considerações de Performance](#considerações-de-performance)

---

## Visão Geral da Arquitetura

### Diagrama de Alto Nível

```
┌─────────────────────────────────────────────────────────────────────┐
│                          GAEIA Platform                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────┐  │
│  │   universe/      │    │   gaeia-web/     │    │   Browser     │  │
│  │                  │    │                  │    │               │  │
│  │  _catalog.json   │───▶│  content.ts      │───▶│  localStorage │  │
│  │  course.json(s)  │    │  progressStore   │    │  (progresso)  │  │
│  │  global-badges   │    │  badges.ts       │    │               │  │
│  │  *.md content    │    │                  │    │               │  │
│  └──────────────────┘    └──────────────────┘    └───────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### Princípios Arquiteturais

1. **Configuração Centralizada:** Todo metadado de cursos vem de arquivos JSON
2. **Conteúdo Descentralizado:** Markdown permanece na estrutura do vault
3. **Progresso no Cliente:** localStorage com namespace por curso
4. **Build Estático:** Astro gera HTML estático, sem servidor

---

## Estrutura de Diretórios

### Estrutura Proposta

```
AI-Engineer/                          # Vault raiz
├── universe/                         # NOVO: Organização multi-curso
│   ├── _catalog.json                 # Catálogo central de cursos
│   │
│   ├── fundamentos/                  # Sistema Solar: Fundamentos
│   │   └── llm-do-zero/              # Planeta: LLM do Zero
│   │       ├── course.json           # Metadados do curso
│   │       ├── _INDEX.md             # Índice do curso (opcional)
│   │       ├── Bloco-01-*.md         # Conteúdo
│   │       ├── Bloco-02-*.md
│   │       └── ...
│   │
│   ├── aplicacoes/                   # Sistema Solar: Aplicações
│   │   └── ia-llms-pratico/          # Planeta: IA & LLMs Prático
│   │       ├── course.json
│   │       ├── _INDEX.md
│   │       ├── Semana-01-*.md
│   │       └── ...
│   │
│   └── shared/                       # Recursos compartilhados
│       └── global-badges.json        # Badges cross-curso
│
├── 01-Guia-de-Estudos/               # LEGADO: Será migrado para universe/
├── 02-Roadmap-AI-Engineer/           # Mantido (não é curso gamificado)
├── 03-Recursos/                      # Mantido
├── 04-Projetos/                      # Mantido
│
├── gaeia-web/                        # Aplicação Astro
│   ├── src/
│   │   ├── components/
│   │   │   ├── UniverseMap.astro     # NOVO
│   │   │   ├── CourseCatalog.astro   # NOVO
│   │   │   ├── CourseCard.astro      # NOVO
│   │   │   ├── SystemCard.astro      # NOVO
│   │   │   └── ViewToggle.astro      # NOVO
│   │   │
│   │   ├── pages/
│   │   │   ├── index.astro           # Refatorar: Entrada do universo
│   │   │   ├── universo.astro        # NOVO: Mapa visual completo
│   │   │   ├── [sistema]/
│   │   │   │   ├── index.astro       # NOVO: Página do sistema
│   │   │   │   └── [curso]/
│   │   │   │       ├── index.astro   # NOVO: Página do curso
│   │   │   │       └── [unidade].astro # NOVO: Página da unidade
│   │   │   │
│   │   │   └── guia/                 # LEGADO: Manter para compatibilidade
│   │   │       └── [slug].astro
│   │   │
│   │   └── utils/
│   │       ├── constants.ts          # Adicionar constantes multi-curso
│   │       ├── content.ts            # Refatorar para multi-curso
│   │       ├── badges.ts             # Adicionar badges globais
│   │       ├── progressStore.ts      # Namespace por curso
│   │       └── catalog.ts            # NOVO: Funções de catálogo
│   │
│   └── ...
│
└── docs/
    ├── plans/
    ├── architecture/
    ├── schemas/
    └── migration/
```

### Convenções de Nomenclatura

| Tipo | Padrão | Exemplo |
|------|--------|---------|
| Sistema Solar | `kebab-case` | `fundamentos`, `aplicacoes` |
| Curso (diretório) | `kebab-case` | `llm-do-zero`, `ia-llms-pratico` |
| Curso (ID) | `kebab-case` | `llm-do-zero` |
| Arquivo de unidade | `{Tipo}-{NN}-{Nome}.md` | `Bloco-01-Neuronio.md`, `Semana-01-Intro.md` |

---

## Arquivos de Configuração

### `_catalog.json` - Catálogo Central

```json
{
  "version": "1.0",
  "lastUpdated": "2026-02-03",
  "systems": [
    {
      "id": "fundamentos",
      "name": "Fundamentos",
      "description": "Construa seu conhecimento base em IA e Machine Learning",
      "icon": "sun",
      "order": 1,
      "courses": ["llm-do-zero"]
    },
    {
      "id": "aplicacoes",
      "name": "Aplicações",
      "description": "Aplique IA em projetos práticos do mundo real",
      "icon": "rocket",
      "order": 2,
      "courses": ["ia-llms-pratico"]
    }
  ]
}
```

### `course.json` - Metadados do Curso

**Exemplo: LLM do Zero**

```json
{
  "id": "llm-do-zero",
  "name": "Construa sua LLM do Zero",
  "shortName": "LLM do Zero",
  "system": "fundamentos",
  "description": "Aprenda a construir uma LLM do zero, desde o neurônio até o GPT",
  "longDescription": "Curso completo de 9 blocos que guia você desde os conceitos básicos de redes neurais até a implementação de um modelo GPT funcional.",
  "difficulty": "intermediate",
  "estimatedHours": 40,
  "unitName": "Bloco",
  "unitNamePlural": "Blocos",
  "totalUnits": 9,
  "contentPattern": "Bloco-{n}-*.md",
  "icon": "brain",
  "color": "#a371f7",
  "tags": ["deep-learning", "transformers", "nlp", "pytorch"],
  "prerequisites": [],
  "badges": [
    {
      "id": "first-steps",
      "name": "Primeiros Passos",
      "description": "Complete o primeiro bloco de estudos",
      "icon": "footprints",
      "rarity": "common",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 1
      }
    },
    {
      "id": "deep-diver",
      "name": "Mergulho Profundo",
      "description": "Complete o bloco de Deep Learning",
      "icon": "brain",
      "rarity": "rare",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 3
      }
    },
    {
      "id": "attention-master",
      "name": "Mestre da Atenção",
      "description": "Domine Self-Attention",
      "icon": "eye",
      "rarity": "epic",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 6
      }
    },
    {
      "id": "gpt-builder",
      "name": "Construtor de GPT",
      "description": "Construa seu próprio GPT",
      "icon": "rocket",
      "rarity": "legendary",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 9
      }
    },
    {
      "id": "llm-completionist",
      "name": "Completista LLM",
      "description": "Complete todos os 9 blocos",
      "icon": "trophy",
      "rarity": "legendary",
      "criteria": {
        "type": "course_complete"
      }
    }
  ]
}
```

**Exemplo: IA & LLMs Prático**

```json
{
  "id": "ia-llms-pratico",
  "name": "IA & LLMs na Prática",
  "shortName": "IA Prático",
  "system": "aplicacoes",
  "description": "Aplique IA e LLMs em projetos do mundo real",
  "longDescription": "Programa de 24 semanas cobrindo desde fundamentos até deploy em produção, com foco em aplicações práticas.",
  "difficulty": "beginner",
  "estimatedHours": 96,
  "unitName": "Semana",
  "unitNamePlural": "Semanas",
  "totalUnits": 24,
  "contentPattern": "Semana-{n}-*.md",
  "icon": "zap",
  "color": "#58a6ff",
  "tags": ["llms", "apis", "rag", "agents", "production"],
  "prerequisites": [],
  "badges": [
    {
      "id": "first-month",
      "name": "Primeiro Mês",
      "description": "Complete as 4 primeiras semanas",
      "icon": "calendar",
      "rarity": "common",
      "criteria": {
        "type": "units_complete",
        "value": 4
      }
    },
    {
      "id": "prompt-engineer",
      "name": "Engenheiro de Prompts",
      "description": "Complete a seção de Prompting",
      "icon": "message-square",
      "rarity": "rare",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 8
      }
    },
    {
      "id": "agent-smith",
      "name": "Agente Smith",
      "description": "Complete a seção de Agentes",
      "icon": "bot",
      "rarity": "epic",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 16
      }
    },
    {
      "id": "production-ready",
      "name": "Pronto para Produção",
      "description": "Complete a seção de Deploy",
      "icon": "server",
      "rarity": "epic",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 20
      }
    },
    {
      "id": "pratico-completionist",
      "name": "Mestre Prático",
      "description": "Complete todas as 24 semanas",
      "icon": "crown",
      "rarity": "legendary",
      "criteria": {
        "type": "course_complete"
      }
    }
  ]
}
```

### `global-badges.json` - Badges Cross-Curso

```json
{
  "version": "1.0",
  "badges": [
    {
      "id": "explorer",
      "name": "Explorador",
      "description": "Inicie 2 ou mais cursos",
      "icon": "compass",
      "rarity": "common",
      "criteria": {
        "type": "courses_started",
        "value": 2
      }
    },
    {
      "id": "full-stack-ai",
      "name": "Engenheiro Full-Stack AI",
      "description": "Complete Fundamentos + Aplicações",
      "icon": "layers",
      "rarity": "legendary",
      "criteria": {
        "type": "courses_completed",
        "courseIds": ["llm-do-zero", "ia-llms-pratico"]
      }
    },
    {
      "id": "marathonist",
      "name": "Maratonista",
      "description": "Mantenha uma sequência de 30 dias",
      "icon": "flame",
      "rarity": "rare",
      "criteria": {
        "type": "global_streak",
        "value": 30
      }
    },
    {
      "id": "centurion",
      "name": "Centurião",
      "description": "Mantenha uma sequência de 100 dias",
      "icon": "zap",
      "rarity": "legendary",
      "criteria": {
        "type": "global_streak",
        "value": 100
      }
    },
    {
      "id": "collector",
      "name": "Colecionador",
      "description": "Obtenha 10 badges de qualquer curso",
      "icon": "award",
      "rarity": "rare",
      "criteria": {
        "type": "total_badges",
        "value": 10
      }
    },
    {
      "id": "completionist",
      "name": "Completista Total",
      "description": "Complete todos os cursos disponíveis",
      "icon": "star",
      "rarity": "legendary",
      "criteria": {
        "type": "all_courses_completed"
      }
    }
  ]
}
```

---

## Modificações em Arquivos Existentes

### `src/utils/constants.ts`

**Adicionar:**

```typescript
// Multi-course constants
export const UNIVERSE_DIR = 'universe';
export const CATALOG_FILE = '_catalog.json';
export const COURSE_CONFIG_FILE = 'course.json';
export const GLOBAL_BADGES_FILE = 'shared/global-badges.json';

// Course content patterns
export const UNIT_PATTERN_PLACEHOLDER = '{n}';

// localStorage namespace prefixes
export const STORAGE_PREFIX = 'gaeia';
export const GLOBAL_STORAGE_PREFIX = `${STORAGE_PREFIX}_global`;
export const COURSE_STORAGE_PREFIX = `${STORAGE_PREFIX}_course`;

// Migration flag
export const MIGRATION_FLAG_KEY = `${STORAGE_PREFIX}_migration_v2`;
```

### `src/utils/progressStore.ts`

**Modificar para suportar namespace por curso:**

```typescript
// Novo: Keys com namespace
const getStorageKeys = (courseId?: string) => {
  if (courseId) {
    return {
      PROGRESS: `gaeia_${courseId}_progress`,
      BADGES: `gaeia_${courseId}_badges`,
      ACTIVITY: `gaeia_${courseId}_activity`,
    };
  }
  return {
    ACTIVITY_DATES: 'gaeia_global_activity_dates',
    GLOBAL_BADGES: 'gaeia_global_badges',
  };
};

// Novo: Funções para progresso por curso
export function getCourseProgress(courseId: string): CourseProgress {
  const keys = getStorageKeys(courseId);
  // ... implementação
}

export function saveCourseProgress(courseId: string, progress: CourseProgress): void {
  const keys = getStorageKeys(courseId);
  // ... implementação
}

// Manter funções existentes para backward compatibility
// mas marcar como @deprecated
```

### `src/utils/badges.ts`

**Adicionar suporte a badges globais:**

```typescript
import globalBadgesData from '../../universe/shared/global-badges.json';

export interface GlobalBadge extends Badge {
  criteria: GlobalBadgeCriteria;
}

export interface GlobalBadgeCriteria {
  type: 'courses_started' | 'courses_completed' | 'global_streak' | 'total_badges' | 'all_courses_completed';
  value?: number;
  courseIds?: string[];
}

export const GLOBAL_BADGE_DEFINITIONS: Omit<GlobalBadge, 'earned' | 'earnedDate'>[] = globalBadgesData.badges;

export function checkGlobalBadgeCriteria(
  criteria: GlobalBadgeCriteria,
  coursesProgress: Map<string, CourseProgress>,
  globalStreak: number,
  totalBadgesEarned: number
): boolean {
  switch (criteria.type) {
    case 'courses_started':
      return coursesProgress.size >= (criteria.value || 0);

    case 'courses_completed':
      if (criteria.courseIds) {
        return criteria.courseIds.every(id =>
          coursesProgress.get(id)?.completed === true
        );
      }
      return false;

    case 'global_streak':
      return globalStreak >= (criteria.value || 0);

    case 'total_badges':
      return totalBadgesEarned >= (criteria.value || 0);

    case 'all_courses_completed':
      // Verificar contra catálogo
      return Array.from(coursesProgress.values()).every(p => p.completed);

    default:
      return false;
  }
}
```

### `src/utils/content.ts`

**Adicionar funções multi-curso:**

```typescript
import { readFile } from 'fs/promises';
import { join } from 'path';
import { UNIVERSE_DIR, CATALOG_FILE, COURSE_CONFIG_FILE } from './constants';

// Interfaces
export interface UniverseCatalog {
  version: string;
  systems: SolarSystem[];
}

export interface SolarSystem {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  courses: string[];
}

export interface Course {
  id: string;
  name: string;
  shortName: string;
  system: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedHours: number;
  unitName: string;
  unitNamePlural: string;
  totalUnits: number;
  contentPattern: string;
  icon: string;
  color: string;
  tags: string[];
  prerequisites: string[];
  badges: CourseBadge[];
}

// Funções
export async function getCatalog(): Promise<UniverseCatalog> {
  const catalogPath = join(VAULT_ROOT, UNIVERSE_DIR, CATALOG_FILE);
  const content = await readFile(catalogPath, 'utf-8');
  return JSON.parse(content);
}

export async function getSystems(): Promise<SolarSystem[]> {
  const catalog = await getCatalog();
  return catalog.systems.sort((a, b) => a.order - b.order);
}

export async function getSystemById(systemId: string): Promise<SolarSystem | null> {
  const systems = await getSystems();
  return systems.find(s => s.id === systemId) || null;
}

export async function getCourse(systemId: string, courseId: string): Promise<Course | null> {
  const coursePath = join(VAULT_ROOT, UNIVERSE_DIR, systemId, courseId, COURSE_CONFIG_FILE);
  try {
    const content = await readFile(coursePath, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export async function getCourseUnits(course: Course): Promise<UnitInfo[]> {
  // Descobrir unidades baseado no contentPattern
  const coursePath = join(VAULT_ROOT, UNIVERSE_DIR, course.system, course.id);
  // ... implementação similar a discoverBlocks()
}

// Manter funções existentes para backward compatibility
// @deprecated - usar getCourse() e getCourseUnits()
export async function discoverBlocks(): Promise<BlockInfo[]> {
  // Implementação existente permanece
}
```

---

## Novos Componentes

### `UniverseMap.astro`

Visualização interativa do universo com sistemas solares e planetas.

```astro
---
import type { SolarSystem, Course } from '../utils/content';

interface Props {
  systems: SolarSystem[];
  coursesProgress: Map<string, number>;
}

const { systems, coursesProgress } = Astro.props;
---

<div class="universe-map">
  <div class="universe-center">
    <span class="universe-icon">🌌</span>
    <span class="universe-label">GAEIA</span>
  </div>

  {systems.map((system, index) => (
    <div
      class="solar-system"
      style={`--orbit-index: ${index}`}
    >
      <a href={`/${system.id}`} class="system-sun">
        <span class="system-icon">☀️</span>
        <span class="system-name">{system.name}</span>
      </a>

      <!-- Planetas orbitando -->
      <div class="planets-orbit">
        {/* Renderizar cursos como planetas */}
      </div>
    </div>
  ))}
</div>

<style>
  .universe-map {
    position: relative;
    width: 100%;
    height: 600px;
    /* Animações CSS para órbitas */
  }

  .solar-system {
    position: absolute;
    /* Posicionamento baseado em --orbit-index */
  }
</style>
```

### `CourseCatalog.astro`

Grid de cards para visualização em lista.

```astro
---
import CourseCard from './CourseCard.astro';
import type { SolarSystem, Course } from '../utils/content';

interface Props {
  systems: SolarSystem[];
  courses: Map<string, Course>;
  progress: Map<string, number>;
}

const { systems, courses, progress } = Astro.props;
---

<div class="course-catalog">
  {systems.map(system => (
    <section class="system-section">
      <h2 class="system-title">
        <span class="system-icon">☀️</span>
        {system.name}
      </h2>
      <p class="system-description">{system.description}</p>

      <div class="courses-grid">
        {system.courses.map(courseId => {
          const course = courses.get(courseId);
          const courseProgress = progress.get(courseId) || 0;

          return course && (
            <CourseCard
              course={course}
              progress={courseProgress}
            />
          );
        })}
      </div>
    </section>
  ))}
</div>

<style>
  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
</style>
```

### `CourseCard.astro`

Card individual de curso.

```astro
---
import ProgressBar from './ProgressBar.astro';
import type { Course } from '../utils/content';

interface Props {
  course: Course;
  progress: number;
}

const { course, progress } = Astro.props;
const href = `/${course.system}/${course.id}`;
---

<a href={href} class="course-card">
  <div class="card-header">
    <span class="course-icon">{course.icon}</span>
    <span class={`difficulty-badge ${course.difficulty}`}>
      {course.difficulty}
    </span>
  </div>

  <h3 class="course-name">{course.name}</h3>
  <p class="course-description">{course.description}</p>

  <div class="card-footer">
    <ProgressBar percentage={progress} />
    <span class="progress-label">
      {progress}% • {course.totalUnits} {course.unitNamePlural}
    </span>
  </div>
</a>

<style>
  .course-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.2s ease;
  }

  .course-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }
</style>
```

### `ViewToggle.astro`

Toggle entre visualizações mapa/catálogo.

```astro
---
interface Props {
  currentView: 'map' | 'catalog';
}

const { currentView } = Astro.props;
---

<div class="view-toggle" role="tablist">
  <button
    role="tab"
    aria-selected={currentView === 'map'}
    class:list={['toggle-btn', { active: currentView === 'map' }]}
    data-view="map"
  >
    🗺️ Mapa Visual
  </button>
  <button
    role="tab"
    aria-selected={currentView === 'catalog'}
    class:list={['toggle-btn', { active: currentView === 'catalog' }]}
    data-view="catalog"
  >
    📋 Catálogo
  </button>
</div>

<script>
  // Client-side toggle logic
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      // Salvar preferência e atualizar UI
      localStorage.setItem('gaeia_view_preference', view);
      document.querySelector('.universe-map')?.classList.toggle('hidden', view !== 'map');
      document.querySelector('.course-catalog')?.classList.toggle('hidden', view !== 'catalog');
    });
  });
</script>

<style>
  .view-toggle {
    display: flex;
    gap: 0.5rem;
    background: var(--bg-elevated);
    padding: 0.25rem;
    border-radius: 8px;
  }

  .toggle-btn {
    padding: 0.5rem 1rem;
    border: none;
    background: transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .toggle-btn.active {
    background: var(--accent);
    color: white;
  }
</style>
```

---

## Sistema de Rotas

### Mapa de Rotas

| Rota | Arquivo | Descrição |
|------|---------|-----------|
| `/` | `index.astro` | Homepage com overview |
| `/universo` | `universo.astro` | Mapa visual completo |
| `/[sistema]` | `[sistema]/index.astro` | Página do sistema solar |
| `/[sistema]/[curso]` | `[sistema]/[curso]/index.astro` | Página do curso |
| `/[sistema]/[curso]/[unidade]` | `[sistema]/[curso]/[unidade].astro` | Conteúdo da unidade |
| `/guia/[slug]` | `guia/[slug].astro` | **LEGADO:** Redireciona para nova rota |
| `/conquistas` | `conquistas.astro` | Badges (atualizar para global) |
| `/jornada` | `jornada.astro` | Manter ou deprecar |

### Rotas Dinâmicas

**`[sistema]/index.astro`:**

```astro
---
import { getSystems, getSystemById, getCourse } from '../../utils/content';

export async function getStaticPaths() {
  const systems = await getSystems();
  return systems.map(system => ({
    params: { sistema: system.id },
    props: { system }
  }));
}

const { system } = Astro.props;
---
```

**`[sistema]/[curso]/index.astro`:**

```astro
---
import { getSystems, getCourse, getCourseUnits } from '../../../utils/content';

export async function getStaticPaths() {
  const systems = await getSystems();
  const paths = [];

  for (const system of systems) {
    for (const courseId of system.courses) {
      const course = await getCourse(system.id, courseId);
      if (course) {
        paths.push({
          params: { sistema: system.id, curso: course.id },
          props: { system, course }
        });
      }
    }
  }

  return paths;
}

const { system, course } = Astro.props;
const units = await getCourseUnits(course);
---
```

### Redirecionamentos de Compatibilidade

Para manter URLs antigas funcionando:

```javascript
// src/pages/guia/[slug].astro
---
const { slug } = Astro.params;

// Mapear slug antigo para nova rota
const redirectMap = {
  'bloco-1': '/fundamentos/llm-do-zero/bloco-1',
  'bloco-2': '/fundamentos/llm-do-zero/bloco-2',
  // ...
};

const newUrl = redirectMap[slug];
if (newUrl) {
  return Astro.redirect(newUrl, 301);
}
---
```

---

## Fluxo de Dados

### Carregamento de Configuração (Build Time)

```
1. Astro inicia build
2. content.ts lê _catalog.json
3. Para cada sistema:
   3.1 Lê course.json de cada curso
   3.2 Descobre unidades pelo contentPattern
   3.3 Parseia markdown de cada unidade
4. Gera páginas estáticas
```

### Carregamento de Progresso (Runtime)

```
1. Usuário acessa página
2. Client-side script executa
3. progressStore.ts lê localStorage:
   - gaeia_global_activity_dates
   - gaeia_{courseId}_progress
   - gaeia_{courseId}_badges
4. Atualiza UI com progresso
5. badges.ts calcula badges earned
```

### Atualização de Progresso

```
1. Usuário marca item no checklist
2. InteractiveChecklist.ts detecta mudança
3. Calcula novo progresso da unidade
4. progressStore.ts salva:
   - Progresso da unidade
   - Data de atividade (streak)
5. badges.ts verifica novos badges
6. Se badge novo: exibe notificação
```

---

## Considerações de Performance

### Build Time

1. **Cache de configuração:** Carregar `_catalog.json` uma vez
2. **Processamento paralelo:** Parsear cursos em paralelo
3. **Lazy discovery:** Descobrir unidades sob demanda

### Runtime

1. **Código splitting:** Carregar scripts por página
2. **localStorage eficiente:** Serializar apenas dados necessários
3. **Prefetch:** Prefetch de páginas prováveis

### Métricas Alvo

| Métrica | Alvo |
|---------|------|
| Build time (total) | < 30s |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Bundle size (JS) | < 50KB |

---

## Documentos Relacionados

- [Documento de Design Principal](../plans/2026-02-03-universo-aprendizado-design.md)
- [Especificação de Schemas](../schemas/catalog-schema.md)
- [Guia de Migração](../migration/progress-migration.md)

---

*Documento criado em 2026-02-03*
