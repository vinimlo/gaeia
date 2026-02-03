# Especificacao de Schemas - Sistema Multi-Curso

> Definicoes de tipos e schemas JSON para o Universo de Aprendizado GAEIA

**Data:** 2026-02-03
**Versao:** 1.0

---

## Sumario

1. [Visao Geral](#visao-geral)
2. [Schema do Catalogo](#schema-do-catalogo)
3. [Schema de Curso](#schema-de-curso)
4. [Schema de Badges Globais](#schema-de-badges-globais)
5. [Schema de Progresso](#schema-de-progresso)
6. [Tipos TypeScript](#tipos-typescript)
7. [Validacao](#validacao)

---

## Visao Geral

### Arquivos de Configuracao

| Arquivo | Localizacao | Proposito |
|---------|-------------|-----------|
| `_catalog.json` | `universe/_catalog.json` | Catalogo central com sistemas e cursos |
| `course.json` | `universe/{sistema}/{curso}/course.json` | Metadados de cada curso |
| `global-badges.json` | `universe/shared/global-badges.json` | Badges cross-curso |

### Convencoes

- Todos os IDs usam `kebab-case`
- Datas seguem formato ISO 8601 (`YYYY-MM-DD`)
- Icones sao strings representando emoji ou nome de icone
- Cores sao hex codes (`#RRGGBB`)

---

## Schema do Catalogo

### `_catalog.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "UniverseCatalog",
  "description": "Catalogo central de sistemas solares e cursos do GAEIA",
  "type": "object",
  "required": ["version", "systems"],
  "properties": {
    "version": {
      "type": "string",
      "description": "Versao do schema",
      "pattern": "^\\d+\\.\\d+$",
      "examples": ["1.0", "1.1"]
    },
    "lastUpdated": {
      "type": "string",
      "format": "date",
      "description": "Data da ultima atualizacao"
    },
    "systems": {
      "type": "array",
      "description": "Lista de sistemas solares",
      "items": {
        "$ref": "#/$defs/SolarSystem"
      },
      "minItems": 1
    }
  },
  "$defs": {
    "SolarSystem": {
      "type": "object",
      "required": ["id", "name", "description", "icon", "order", "courses"],
      "properties": {
        "id": {
          "type": "string",
          "description": "Identificador unico do sistema",
          "pattern": "^[a-z][a-z0-9-]*$",
          "examples": ["fundamentos", "aplicacoes"]
        },
        "name": {
          "type": "string",
          "description": "Nome de exibicao do sistema",
          "minLength": 1,
          "maxLength": 50,
          "examples": ["Fundamentos", "Aplicacoes"]
        },
        "description": {
          "type": "string",
          "description": "Descricao breve do sistema",
          "minLength": 10,
          "maxLength": 200
        },
        "icon": {
          "type": "string",
          "description": "Icone do sistema (emoji ou nome)",
          "examples": ["sun", "rocket", "star"]
        },
        "order": {
          "type": "integer",
          "description": "Ordem de exibicao (menor = primeiro)",
          "minimum": 1
        },
        "courses": {
          "type": "array",
          "description": "IDs dos cursos neste sistema",
          "items": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          },
          "minItems": 1
        }
      }
    }
  }
}
```

### Exemplo Completo

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
      "name": "Aplicacoes",
      "description": "Aplique IA em projetos praticos do mundo real",
      "icon": "rocket",
      "order": 2,
      "courses": ["ia-llms-pratico"]
    },
    {
      "id": "especializacoes",
      "name": "Especializacoes",
      "description": "Aprofunde-se em areas especificas de IA",
      "icon": "star",
      "order": 3,
      "courses": []
    }
  ]
}
```

---

## Schema de Curso

### `course.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Course",
  "description": "Metadados de um curso individual",
  "type": "object",
  "required": [
    "id",
    "name",
    "system",
    "description",
    "difficulty",
    "estimatedHours",
    "unitName",
    "unitNamePlural",
    "totalUnits",
    "contentPattern",
    "badges"
  ],
  "properties": {
    "id": {
      "type": "string",
      "description": "Identificador unico do curso",
      "pattern": "^[a-z][a-z0-9-]*$",
      "examples": ["llm-do-zero", "ia-llms-pratico"]
    },
    "name": {
      "type": "string",
      "description": "Nome completo do curso",
      "minLength": 5,
      "maxLength": 100,
      "examples": ["Construa sua LLM do Zero"]
    },
    "shortName": {
      "type": "string",
      "description": "Nome curto para exibicao em espacos limitados",
      "maxLength": 30,
      "examples": ["LLM do Zero"]
    },
    "system": {
      "type": "string",
      "description": "ID do sistema solar ao qual pertence",
      "pattern": "^[a-z][a-z0-9-]*$"
    },
    "description": {
      "type": "string",
      "description": "Descricao curta do curso",
      "minLength": 20,
      "maxLength": 200
    },
    "longDescription": {
      "type": "string",
      "description": "Descricao detalhada do curso",
      "maxLength": 1000
    },
    "difficulty": {
      "type": "string",
      "description": "Nivel de dificuldade do curso",
      "enum": ["beginner", "intermediate", "advanced"]
    },
    "estimatedHours": {
      "type": "integer",
      "description": "Horas estimadas para completar o curso",
      "minimum": 1,
      "maximum": 500
    },
    "unitName": {
      "type": "string",
      "description": "Nome da unidade no singular",
      "examples": ["Bloco", "Semana", "Modulo", "Capitulo"]
    },
    "unitNamePlural": {
      "type": "string",
      "description": "Nome da unidade no plural",
      "examples": ["Blocos", "Semanas", "Modulos", "Capitulos"]
    },
    "totalUnits": {
      "type": "integer",
      "description": "Numero total de unidades no curso",
      "minimum": 1,
      "maximum": 100
    },
    "contentPattern": {
      "type": "string",
      "description": "Padrao glob para encontrar arquivos de unidade",
      "examples": ["Bloco-{n}-*.md", "Semana-{n}-*.md"]
    },
    "icon": {
      "type": "string",
      "description": "Icone do curso",
      "examples": ["brain", "zap", "book"]
    },
    "color": {
      "type": "string",
      "description": "Cor tema do curso em hex",
      "pattern": "^#[0-9A-Fa-f]{6}$",
      "examples": ["#a371f7", "#58a6ff"]
    },
    "tags": {
      "type": "array",
      "description": "Tags para categorizacao e busca",
      "items": {
        "type": "string",
        "pattern": "^[a-z][a-z0-9-]*$"
      },
      "maxItems": 10
    },
    "prerequisites": {
      "type": "array",
      "description": "IDs de cursos pre-requisitos (sugestoes)",
      "items": {
        "type": "string",
        "pattern": "^[a-z][a-z0-9-]*$"
      }
    },
    "badges": {
      "type": "array",
      "description": "Badges especificos deste curso",
      "items": {
        "$ref": "#/$defs/CourseBadge"
      }
    }
  },
  "$defs": {
    "CourseBadge": {
      "type": "object",
      "required": ["id", "name", "description", "icon", "rarity", "criteria"],
      "properties": {
        "id": {
          "type": "string",
          "description": "Identificador unico do badge",
          "pattern": "^[a-z][a-z0-9-]*$"
        },
        "name": {
          "type": "string",
          "description": "Nome de exibicao do badge",
          "minLength": 3,
          "maxLength": 50
        },
        "description": {
          "type": "string",
          "description": "Descricao de como obter o badge",
          "minLength": 10,
          "maxLength": 200
        },
        "icon": {
          "type": "string",
          "description": "Icone do badge (emoji ou nome)"
        },
        "rarity": {
          "type": "string",
          "description": "Raridade do badge",
          "enum": ["common", "rare", "epic", "legendary"]
        },
        "criteria": {
          "$ref": "#/$defs/BadgeCriteria"
        }
      }
    },
    "BadgeCriteria": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": {
          "type": "string",
          "description": "Tipo de criterio",
          "enum": [
            "unit_complete",
            "units_complete",
            "course_complete",
            "progress",
            "streak"
          ]
        },
        "unitNumber": {
          "type": "integer",
          "description": "Numero da unidade (para unit_complete)",
          "minimum": 1
        },
        "value": {
          "type": "integer",
          "description": "Valor numerico do criterio",
          "minimum": 1
        }
      },
      "allOf": [
        {
          "if": {
            "properties": { "type": { "const": "unit_complete" } }
          },
          "then": {
            "required": ["unitNumber"]
          }
        },
        {
          "if": {
            "properties": { "type": { "enum": ["units_complete", "progress", "streak"] } }
          },
          "then": {
            "required": ["value"]
          }
        }
      ]
    }
  }
}
```

### Exemplo Completo

```json
{
  "id": "llm-do-zero",
  "name": "Construa sua LLM do Zero",
  "shortName": "LLM do Zero",
  "system": "fundamentos",
  "description": "Aprenda a construir uma LLM do zero, desde o neuronio ate o GPT",
  "longDescription": "Curso completo de 9 blocos que guia voce desde os conceitos basicos de redes neurais ate a implementacao de um modelo GPT funcional. Inclui teoria, pratica e projetos hands-on.",
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
      "id": "matrix-master",
      "name": "Mestre das Matrizes",
      "description": "Complete o bloco de MLP e Matrizes",
      "icon": "grid",
      "rarity": "common",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 2
      }
    },
    {
      "id": "backprop-hero",
      "name": "Heroi do Backprop",
      "description": "Domine Backpropagation",
      "icon": "arrow-left",
      "rarity": "rare",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 4
      }
    },
    {
      "id": "attention-master",
      "name": "Mestre da Atencao",
      "description": "Domine Self-Attention",
      "icon": "eye",
      "rarity": "epic",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 6
      }
    },
    {
      "id": "transformer-builder",
      "name": "Construtor de Transformer",
      "description": "Construa um Transformer completo",
      "icon": "cpu",
      "rarity": "epic",
      "criteria": {
        "type": "unit_complete",
        "unitNumber": 7
      }
    },
    {
      "id": "gpt-builder",
      "name": "Construtor de GPT",
      "description": "Construa seu proprio GPT",
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
    },
    {
      "id": "halfway-llm",
      "name": "Meio Caminho LLM",
      "description": "Atinja 50% de progresso no curso",
      "icon": "target",
      "rarity": "rare",
      "criteria": {
        "type": "progress",
        "value": 50
      }
    }
  ]
}
```

---

## Schema de Badges Globais

### `global-badges.json`

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "GlobalBadges",
  "description": "Badges cross-curso do GAEIA",
  "type": "object",
  "required": ["version", "badges"],
  "properties": {
    "version": {
      "type": "string",
      "pattern": "^\\d+\\.\\d+$"
    },
    "badges": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/GlobalBadge"
      }
    }
  },
  "$defs": {
    "GlobalBadge": {
      "type": "object",
      "required": ["id", "name", "description", "icon", "rarity", "criteria"],
      "properties": {
        "id": {
          "type": "string",
          "pattern": "^[a-z][a-z0-9-]*$"
        },
        "name": {
          "type": "string",
          "minLength": 3,
          "maxLength": 50
        },
        "description": {
          "type": "string",
          "minLength": 10,
          "maxLength": 200
        },
        "icon": {
          "type": "string"
        },
        "rarity": {
          "type": "string",
          "enum": ["common", "rare", "epic", "legendary"]
        },
        "criteria": {
          "$ref": "#/$defs/GlobalBadgeCriteria"
        }
      }
    },
    "GlobalBadgeCriteria": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "courses_started",
            "courses_completed",
            "global_streak",
            "total_badges",
            "all_courses_completed",
            "systems_completed"
          ]
        },
        "value": {
          "type": "integer",
          "minimum": 1
        },
        "courseIds": {
          "type": "array",
          "items": {
            "type": "string",
            "pattern": "^[a-z][a-z0-9-]*$"
          }
        },
        "systemId": {
          "type": "string",
          "pattern": "^[a-z][a-z0-9-]*$"
        }
      }
    }
  }
}
```

### Exemplo Completo

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
      "id": "multi-tasker",
      "name": "Multi-Tarefa",
      "description": "Tenha progresso ativo em 3 cursos simultaneamente",
      "icon": "layers",
      "rarity": "rare",
      "criteria": {
        "type": "courses_started",
        "value": 3
      }
    },
    {
      "id": "full-stack-ai",
      "name": "Engenheiro Full-Stack AI",
      "description": "Complete Fundamentos e Aplicacoes",
      "icon": "award",
      "rarity": "legendary",
      "criteria": {
        "type": "courses_completed",
        "courseIds": ["llm-do-zero", "ia-llms-pratico"]
      }
    },
    {
      "id": "fundamentos-master",
      "name": "Mestre dos Fundamentos",
      "description": "Complete todos os cursos do sistema Fundamentos",
      "icon": "sun",
      "rarity": "epic",
      "criteria": {
        "type": "systems_completed",
        "systemId": "fundamentos"
      }
    },
    {
      "id": "week-warrior",
      "name": "Guerreiro da Semana",
      "description": "Mantenha uma sequencia de 7 dias",
      "icon": "flame",
      "rarity": "common",
      "criteria": {
        "type": "global_streak",
        "value": 7
      }
    },
    {
      "id": "marathonist",
      "name": "Maratonista",
      "description": "Mantenha uma sequencia de 30 dias",
      "icon": "zap",
      "rarity": "rare",
      "criteria": {
        "type": "global_streak",
        "value": 30
      }
    },
    {
      "id": "centurion",
      "name": "Centuriao",
      "description": "Mantenha uma sequencia de 100 dias",
      "icon": "crown",
      "rarity": "legendary",
      "criteria": {
        "type": "global_streak",
        "value": 100
      }
    },
    {
      "id": "collector-10",
      "name": "Colecionador",
      "description": "Obtenha 10 badges de qualquer tipo",
      "icon": "bookmark",
      "rarity": "rare",
      "criteria": {
        "type": "total_badges",
        "value": 10
      }
    },
    {
      "id": "collector-25",
      "name": "Grande Colecionador",
      "description": "Obtenha 25 badges de qualquer tipo",
      "icon": "star",
      "rarity": "epic",
      "criteria": {
        "type": "total_badges",
        "value": 25
      }
    },
    {
      "id": "completionist",
      "name": "Completista Total",
      "description": "Complete todos os cursos disponiveis",
      "icon": "trophy",
      "rarity": "legendary",
      "criteria": {
        "type": "all_courses_completed"
      }
    }
  ]
}
```

---

## Schema de Progresso

### localStorage Keys

```
gaeia_global_activity_dates    -> string[]     (datas ISO)
gaeia_global_badges            -> BadgeRecord  (badges globais earned)
gaeia_{courseId}_progress      -> UnitProgress[] (progresso das unidades)
gaeia_{courseId}_badges        -> BadgeRecord  (badges do curso earned)
gaeia_migration_v2             -> boolean      (flag de migracao)
gaeia_view_preference          -> "map" | "catalog"
```

### Tipos de Progresso

```typescript
// Progresso de uma unidade
interface UnitProgress {
  unitNumber: number;
  completed: boolean;
  percentage: number;
  checklistState: ChecklistState;
  lastUpdated: string; // ISO date
}

// Estado do checklist
interface ChecklistState {
  totalItems: number;
  completedItems: number;
  items: {
    id: string;      // hash do texto do item
    checked: boolean;
  }[];
}

// Registro de badges earned
interface BadgeRecord {
  [badgeId: string]: string; // badgeId -> ISO date earned
}

// Progresso completo de um curso
interface CourseProgress {
  courseId: string;
  units: UnitProgress[];
  completed: boolean;
  percentage: number;
  startedAt: string;    // ISO date
  completedAt?: string; // ISO date
}
```

### Exemplo de Dados no localStorage

```json
// gaeia_global_activity_dates
["2026-01-15", "2026-01-16", "2026-01-18", "2026-02-01", "2026-02-02", "2026-02-03"]

// gaeia_global_badges
{
  "explorer": "2026-01-20",
  "week-warrior": "2026-01-22"
}

// gaeia_llm-do-zero_progress
{
  "courseId": "llm-do-zero",
  "units": [
    {
      "unitNumber": 1,
      "completed": true,
      "percentage": 100,
      "checklistState": {
        "totalItems": 7,
        "completedItems": 7,
        "items": [
          { "id": "a1b2c3", "checked": true },
          { "id": "d4e5f6", "checked": true }
        ]
      },
      "lastUpdated": "2026-01-15"
    },
    {
      "unitNumber": 2,
      "completed": false,
      "percentage": 57,
      "checklistState": {
        "totalItems": 7,
        "completedItems": 4,
        "items": []
      },
      "lastUpdated": "2026-02-03"
    }
  ],
  "completed": false,
  "percentage": 17,
  "startedAt": "2026-01-15"
}

// gaeia_llm-do-zero_badges
{
  "first-steps": "2026-01-15"
}
```

---

## Tipos TypeScript

### Arquivo: `types/universe.ts`

```typescript
// ============================================
// Catalog Types
// ============================================

export interface UniverseCatalog {
  version: string;
  lastUpdated?: string;
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

// ============================================
// Course Types
// ============================================

export interface Course {
  id: string;
  name: string;
  shortName?: string;
  system: string;
  description: string;
  longDescription?: string;
  difficulty: CourseDifficulty;
  estimatedHours: number;
  unitName: string;
  unitNamePlural: string;
  totalUnits: number;
  contentPattern: string;
  icon?: string;
  color?: string;
  tags?: string[];
  prerequisites?: string[];
  badges: CourseBadge[];
}

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

// ============================================
// Badge Types
// ============================================

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface BaseBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: BadgeRarity;
}

export interface CourseBadge extends BaseBadge {
  criteria: CourseBadgeCriteria;
}

export interface GlobalBadge extends BaseBadge {
  criteria: GlobalBadgeCriteria;
}

export interface CourseBadgeCriteria {
  type: 'unit_complete' | 'units_complete' | 'course_complete' | 'progress' | 'streak';
  unitNumber?: number;
  value?: number;
}

export interface GlobalBadgeCriteria {
  type: 'courses_started' | 'courses_completed' | 'global_streak' | 'total_badges' | 'all_courses_completed' | 'systems_completed';
  value?: number;
  courseIds?: string[];
  systemId?: string;
}

// ============================================
// Progress Types
// ============================================

export interface UnitProgress {
  unitNumber: number;
  completed: boolean;
  percentage: number;
  checklistState: ChecklistState;
  lastUpdated: string;
}

export interface ChecklistState {
  totalItems: number;
  completedItems: number;
  items: ChecklistItemState[];
}

export interface ChecklistItemState {
  id: string;
  checked: boolean;
}

export interface CourseProgress {
  courseId: string;
  units: UnitProgress[];
  completed: boolean;
  percentage: number;
  startedAt: string;
  completedAt?: string;
}

export interface BadgeRecord {
  [badgeId: string]: string; // ISO date
}

export interface GlobalProgress {
  activityDates: string[];
  globalBadges: BadgeRecord;
  coursesProgress: Map<string, CourseProgress>;
}

// ============================================
// Earned Badge (for UI)
// ============================================

export interface EarnedBadge extends BaseBadge {
  earned: boolean;
  earnedDate?: string;
  criteria: CourseBadgeCriteria | GlobalBadgeCriteria;
}

// ============================================
// Unit Info (from content)
// ============================================

export interface UnitInfo {
  number: number;
  title: string;
  description?: string;
  path: string;
  slug: string;
}
```

---

## Validacao

### Script de Validacao

```typescript
// scripts/validate-schemas.ts
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import catalogSchema from '../schemas/catalog.schema.json';
import courseSchema from '../schemas/course.schema.json';
import globalBadgesSchema from '../schemas/global-badges.schema.json';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

// Compilar schemas
const validateCatalog = ajv.compile(catalogSchema);
const validateCourse = ajv.compile(courseSchema);
const validateGlobalBadges = ajv.compile(globalBadgesSchema);

export function validateCatalogFile(data: unknown): { valid: boolean; errors?: string[] } {
  const valid = validateCatalog(data);
  return {
    valid,
    errors: valid ? undefined : validateCatalog.errors?.map(e => `${e.instancePath}: ${e.message}`)
  };
}

export function validateCourseFile(data: unknown): { valid: boolean; errors?: string[] } {
  const valid = validateCourse(data);
  return {
    valid,
    errors: valid ? undefined : validateCourse.errors?.map(e => `${e.instancePath}: ${e.message}`)
  };
}

export function validateGlobalBadgesFile(data: unknown): { valid: boolean; errors?: string[] } {
  const valid = validateGlobalBadges(data);
  return {
    valid,
    errors: valid ? undefined : validateGlobalBadges.errors?.map(e => `${e.instancePath}: ${e.message}`)
  };
}
```

### Uso no Build

```typescript
// astro.config.mjs ou script de build
import { validateCatalogFile, validateCourseFile } from './scripts/validate-schemas';

// Durante o build, validar todos os arquivos de configuracao
async function validateConfigs() {
  const catalog = await import('./universe/_catalog.json');
  const catalogResult = validateCatalogFile(catalog);

  if (!catalogResult.valid) {
    throw new Error(`Invalid _catalog.json:\n${catalogResult.errors?.join('\n')}`);
  }

  // Validar cada course.json
  for (const system of catalog.systems) {
    for (const courseId of system.courses) {
      const course = await import(`./universe/${system.id}/${courseId}/course.json`);
      const courseResult = validateCourseFile(course);

      if (!courseResult.valid) {
        throw new Error(`Invalid course.json for ${courseId}:\n${courseResult.errors?.join('\n')}`);
      }
    }
  }
}
```

---

## Documentos Relacionados

- [Documento de Design Principal](../plans/2026-02-03-universo-aprendizado-design.md)
- [Arquitetura Tecnica](../architecture/multi-course-system.md)
- [Guia de Migracao](../migration/progress-migration.md)

---

*Documento criado em 2026-02-03*
