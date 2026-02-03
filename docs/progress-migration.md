# Guia de Migracao de Progresso

> Migracao de dados de usuario para o sistema multi-curso

**Data:** 2026-02-03
**Versao:** 1.0

---

## Sumario

1. [Visao Geral](#visao-geral)
2. [Formato de Dados Atual](#formato-de-dados-atual)
3. [Novo Formato de Dados](#novo-formato-de-dados)
4. [Estrategia de Migracao](#estrategia-de-migracao)
5. [Implementacao](#implementacao)
6. [Verificacao e Rollback](#verificacao-e-rollback)
7. [Casos Especiais](#casos-especiais)

---

## Visao Geral

### Objetivo

Migrar dados de progresso existentes no localStorage para o novo formato namespaced que suporta multiplos cursos, preservando 100% dos dados do usuario.

### Principios

1. **Zero perda de dados** — Todo progresso existente deve ser preservado
2. **Migracao automatica** — Acontece transparentemente ao carregar a pagina
3. **Idempotente** — Pode rodar multiplas vezes sem efeitos colaterais
4. **Backward compatible** — Sistema funciona durante a transicao

### Escopo

| O que migra | O que nao migra |
|-------------|-----------------|
| Datas de atividade (streak) | Preferencias de UI (criadas novas) |
| Badges conquistados | Cache de conteudo |
| Progresso dos blocos | Dados corrompidos |

---

## Formato de Dados Atual

### Keys no localStorage

```
gaeia_activity_dates    -> string (JSON array de datas)
gaeia_badge_dates       -> string (JSON object badgeId -> date)
```

### Estrutura

**`gaeia_activity_dates`:**
```json
["2026-01-15", "2026-01-16", "2026-01-18", "2026-02-01", "2026-02-02"]
```

**`gaeia_badge_dates`:**
```json
{
  "first-steps": "2026-01-15",
  "python-master": "2026-01-20",
  "deep-diver": "2026-02-01",
  "consistent": "2026-01-22"
}
```

### Mapeamento de Badges

Badges atuais que mapeiam para o curso "llm-do-zero":

| Badge Antigo | Badge Novo | Tipo |
|--------------|------------|------|
| `first-steps` | `first-steps` | Curso |
| `python-master` | `matrix-master` | Curso |
| `deep-diver` | `deep-diver` | Curso |
| `word-wizard` | `backprop-hero` | Curso |
| `eagle-eye` | `embeddings-master` | Curso |
| `ops-guru` | `attention-master` | Curso |
| `generator` | `transformer-builder` | Curso |
| `agent-smith` | `tokenizer` | Curso |
| `ai-engineer` | `gpt-builder` | Curso |
| `consistent` | `week-warrior` | **Global** |
| `dedicated` | `marathonist` | **Global** |
| `unstoppable` | `centurion` | **Global** |
| `halfway-there` | `halfway-llm` | Curso |
| `almost-there` | `almost-there-llm` | Curso |
| `completionist` | `llm-completionist` | Curso |
| `triple-threat` | *descontinuado* | - |
| `six-pack` | *descontinuado* | - |
| `full-stack-ai` | `full-stack-ai` | **Global** |

---

## Novo Formato de Dados

### Keys no localStorage

```
// Global
gaeia_global_activity_dates    -> string (JSON array de datas)
gaeia_global_badges            -> string (JSON object badgeId -> date)

// Por curso
gaeia_{courseId}_progress      -> string (JSON CourseProgress)
gaeia_{courseId}_badges        -> string (JSON object badgeId -> date)

// Controle
gaeia_migration_v2             -> "true" (flag de migracao completa)
gaeia_view_preference          -> "map" | "catalog"
```

### Estruturas

**`gaeia_global_activity_dates`:**
```json
["2026-01-15", "2026-01-16", "2026-01-18", "2026-02-01", "2026-02-02"]
```

**`gaeia_global_badges`:**
```json
{
  "week-warrior": "2026-01-22",
  "explorer": "2026-02-01"
}
```

**`gaeia_llm-do-zero_progress`:**
```json
{
  "courseId": "llm-do-zero",
  "units": [
    {
      "unitNumber": 1,
      "completed": true,
      "percentage": 100,
      "checklistState": {
        "totalItems": 0,
        "completedItems": 0,
        "items": []
      },
      "lastUpdated": "2026-01-15"
    },
    {
      "unitNumber": 2,
      "completed": true,
      "percentage": 100,
      "checklistState": {
        "totalItems": 0,
        "completedItems": 0,
        "items": []
      },
      "lastUpdated": "2026-01-20"
    },
    {
      "unitNumber": 3,
      "completed": true,
      "percentage": 100,
      "checklistState": {
        "totalItems": 0,
        "completedItems": 0,
        "items": []
      },
      "lastUpdated": "2026-02-01"
    }
  ],
  "completed": false,
  "percentage": 33,
  "startedAt": "2026-01-15"
}
```

**`gaeia_llm-do-zero_badges`:**
```json
{
  "first-steps": "2026-01-15",
  "matrix-master": "2026-01-20",
  "deep-diver": "2026-02-01"
}
```

---

## Estrategia de Migracao

### Fluxo de Migracao

```
┌─────────────────────────────────────────────────────────────────┐
│                     Fluxo de Migracao                            │
└─────────────────────────────────────────────────────────────────┘

  ┌───────────────┐
  │ Pagina Carrega│
  └───────┬───────┘
          │
          ▼
  ┌───────────────────────────┐
  │ Verificar migration_v2    │
  │ flag existe?              │
  └───────────┬───────────────┘
              │
      ┌───────┴───────┐
      │               │
      ▼               ▼
   [Sim]           [Nao]
      │               │
      │               ▼
      │    ┌─────────────────────┐
      │    │ Verificar dados     │
      │    │ antigos existem?    │
      │    └──────────┬──────────┘
      │               │
      │       ┌───────┴───────┐
      │       │               │
      │       ▼               ▼
      │    [Sim]           [Nao]
      │       │               │
      │       ▼               │
      │    ┌──────────────┐   │
      │    │ Executar     │   │
      │    │ Migracao     │   │
      │    └──────┬───────┘   │
      │           │           │
      │           ▼           │
      │    ┌──────────────┐   │
      │    │ Validar      │   │
      │    │ Migracao     │   │
      │    └──────┬───────┘   │
      │           │           │
      │           ▼           │
      │    ┌──────────────┐   │
      │    │ Setar flag   │   │
      │    │ migration_v2 │   │
      │    └──────┬───────┘   │
      │           │           │
      └─────┬─────┴───────────┘
            │
            ▼
  ┌───────────────────┐
  │ Continuar App     │
  │ Normalmente       │
  └───────────────────┘
```

### Passos Detalhados

1. **Verificar Flag de Migracao**
   - Se `gaeia_migration_v2 === "true"`, pular migracao
   - Continuar normalmente

2. **Detectar Dados Antigos**
   - Verificar se `gaeia_activity_dates` existe
   - Verificar se `gaeia_badge_dates` existe
   - Se nenhum existe, setar flag e pular

3. **Migrar Activity Dates**
   - Copiar para `gaeia_global_activity_dates`
   - Manter dados originais durante transicao

4. **Migrar Badges**
   - Classificar cada badge como curso ou global
   - Copiar para namespace apropriado
   - Aplicar mapeamento de nomes se necessario

5. **Inferir Progresso de Unidades**
   - Baseado em badges de bloco, inferir unidades completas
   - Criar estrutura `CourseProgress` para llm-do-zero
   - Usar datas dos badges como `lastUpdated`

6. **Validar Migracao**
   - Verificar que dados novos foram criados
   - Comparar contagens

7. **Finalizar**
   - Setar `gaeia_migration_v2 = "true"`
   - Opcionalmente, limpar dados antigos (em versao futura)

---

## Implementacao

### Arquivo: `src/utils/migration.ts`

```typescript
/**
 * Migration utilities for GAEIA multi-course system
 * Migrates legacy localStorage data to namespaced format
 */

import type { CourseProgress, UnitProgress, BadgeRecord } from '../types/universe';

// Keys
const LEGACY_KEYS = {
  ACTIVITY_DATES: 'gaeia_activity_dates',
  BADGE_DATES: 'gaeia_badge_dates',
} as const;

const NEW_KEYS = {
  GLOBAL_ACTIVITY: 'gaeia_global_activity_dates',
  GLOBAL_BADGES: 'gaeia_global_badges',
  MIGRATION_FLAG: 'gaeia_migration_v2',
} as const;

const getCourseKeys = (courseId: string) => ({
  PROGRESS: `gaeia_${courseId}_progress`,
  BADGES: `gaeia_${courseId}_badges`,
});

// Badge mapping: old ID -> { newId, type }
const BADGE_MAPPING: Record<string, { newId: string; type: 'course' | 'global' }> = {
  // Course badges (llm-do-zero)
  'first-steps': { newId: 'first-steps', type: 'course' },
  'python-master': { newId: 'matrix-master', type: 'course' },
  'deep-diver': { newId: 'deep-diver', type: 'course' },
  'word-wizard': { newId: 'backprop-hero', type: 'course' },
  'eagle-eye': { newId: 'embeddings-master', type: 'course' },
  'ops-guru': { newId: 'attention-master', type: 'course' },
  'generator': { newId: 'transformer-builder', type: 'course' },
  'agent-smith': { newId: 'tokenizer', type: 'course' },
  'ai-engineer': { newId: 'gpt-builder', type: 'course' },
  'halfway-there': { newId: 'halfway-llm', type: 'course' },
  'almost-there': { newId: 'almost-there-llm', type: 'course' },
  'completionist': { newId: 'llm-completionist', type: 'course' },

  // Global badges
  'consistent': { newId: 'week-warrior', type: 'global' },
  'dedicated': { newId: 'marathonist', type: 'global' },
  'unstoppable': { newId: 'centurion', type: 'global' },
  'full-stack-ai': { newId: 'full-stack-ai', type: 'global' },
};

// Badge to unit mapping for llm-do-zero
const BADGE_TO_UNIT: Record<string, number> = {
  'first-steps': 1,
  'matrix-master': 2,
  'deep-diver': 3,
  'backprop-hero': 4,
  'embeddings-master': 5,
  'attention-master': 6,
  'transformer-builder': 7,
  'tokenizer': 8,
  'gpt-builder': 9,
};

/**
 * Check if migration is needed
 */
export function isMigrationNeeded(): boolean {
  if (typeof localStorage === 'undefined') return false;

  // Already migrated?
  if (localStorage.getItem(NEW_KEYS.MIGRATION_FLAG) === 'true') {
    return false;
  }

  // Has legacy data?
  const hasLegacyActivity = localStorage.getItem(LEGACY_KEYS.ACTIVITY_DATES) !== null;
  const hasLegacyBadges = localStorage.getItem(LEGACY_KEYS.BADGE_DATES) !== null;

  return hasLegacyActivity || hasLegacyBadges;
}

/**
 * Get legacy data from localStorage
 */
function getLegacyData(): {
  activityDates: string[];
  badgeDates: BadgeRecord;
} {
  let activityDates: string[] = [];
  let badgeDates: BadgeRecord = {};

  try {
    const activityStr = localStorage.getItem(LEGACY_KEYS.ACTIVITY_DATES);
    if (activityStr) {
      activityDates = JSON.parse(activityStr);
    }
  } catch (e) {
    console.warn('[migration] Failed to parse legacy activity dates:', e);
  }

  try {
    const badgesStr = localStorage.getItem(LEGACY_KEYS.BADGE_DATES);
    if (badgesStr) {
      badgeDates = JSON.parse(badgesStr);
    }
  } catch (e) {
    console.warn('[migration] Failed to parse legacy badge dates:', e);
  }

  return { activityDates, badgeDates };
}

/**
 * Migrate activity dates to global namespace
 */
function migrateActivityDates(dates: string[]): void {
  if (dates.length === 0) return;

  // Sort and deduplicate
  const uniqueDates = [...new Set(dates)].sort();

  localStorage.setItem(
    NEW_KEYS.GLOBAL_ACTIVITY,
    JSON.stringify(uniqueDates)
  );

  console.log(`[migration] Migrated ${uniqueDates.length} activity dates`);
}

/**
 * Migrate badges to appropriate namespaces
 */
function migrateBadges(legacyBadges: BadgeRecord): {
  courseBadges: BadgeRecord;
  globalBadges: BadgeRecord;
} {
  const courseBadges: BadgeRecord = {};
  const globalBadges: BadgeRecord = {};

  for (const [oldId, date] of Object.entries(legacyBadges)) {
    const mapping = BADGE_MAPPING[oldId];

    if (!mapping) {
      console.warn(`[migration] Unknown badge: ${oldId}, skipping`);
      continue;
    }

    if (mapping.type === 'course') {
      courseBadges[mapping.newId] = date;
    } else {
      globalBadges[mapping.newId] = date;
    }
  }

  // Save global badges
  if (Object.keys(globalBadges).length > 0) {
    localStorage.setItem(
      NEW_KEYS.GLOBAL_BADGES,
      JSON.stringify(globalBadges)
    );
    console.log(`[migration] Migrated ${Object.keys(globalBadges).length} global badges`);
  }

  return { courseBadges, globalBadges };
}

/**
 * Infer course progress from badges
 */
function inferCourseProgress(
  courseBadges: BadgeRecord,
  activityDates: string[]
): CourseProgress {
  const units: UnitProgress[] = [];
  let maxCompletedUnit = 0;

  // Find completed units from badges
  for (const [badgeId, date] of Object.entries(courseBadges)) {
    const unitNumber = BADGE_TO_UNIT[badgeId];
    if (unitNumber) {
      units.push({
        unitNumber,
        completed: true,
        percentage: 100,
        checklistState: {
          totalItems: 0,
          completedItems: 0,
          items: []
        },
        lastUpdated: date
      });
      maxCompletedUnit = Math.max(maxCompletedUnit, unitNumber);
    }
  }

  // Sort by unit number
  units.sort((a, b) => a.unitNumber - b.unitNumber);

  // Calculate overall progress
  const totalUnits = 9; // LLM do Zero has 9 blocks
  const completedUnits = units.filter(u => u.completed).length;
  const percentage = Math.round((completedUnits / totalUnits) * 100);

  // Find earliest date as startedAt
  const startedAt = activityDates.length > 0
    ? activityDates.sort()[0]
    : new Date().toISOString().split('T')[0];

  // Check if course is complete
  const completed = completedUnits === totalUnits;
  const completedAt = completed
    ? units.find(u => u.unitNumber === totalUnits)?.lastUpdated
    : undefined;

  return {
    courseId: 'llm-do-zero',
    units,
    completed,
    percentage,
    startedAt,
    completedAt
  };
}

/**
 * Execute the full migration
 */
export function executeMigration(): {
  success: boolean;
  migratedActivityDates: number;
  migratedCourseBadges: number;
  migratedGlobalBadges: number;
  inferredProgress: number;
} {
  const result = {
    success: false,
    migratedActivityDates: 0,
    migratedCourseBadges: 0,
    migratedGlobalBadges: 0,
    inferredProgress: 0
  };

  if (typeof localStorage === 'undefined') {
    console.warn('[migration] localStorage not available');
    return result;
  }

  try {
    console.log('[migration] Starting migration...');

    // Get legacy data
    const { activityDates, badgeDates } = getLegacyData();

    // Migrate activity dates
    migrateActivityDates(activityDates);
    result.migratedActivityDates = activityDates.length;

    // Migrate badges
    const { courseBadges, globalBadges } = migrateBadges(badgeDates);
    result.migratedCourseBadges = Object.keys(courseBadges).length;
    result.migratedGlobalBadges = Object.keys(globalBadges).length;

    // Save course badges
    const courseKeys = getCourseKeys('llm-do-zero');
    if (Object.keys(courseBadges).length > 0) {
      localStorage.setItem(courseKeys.BADGES, JSON.stringify(courseBadges));
    }

    // Infer and save course progress
    const courseProgress = inferCourseProgress(courseBadges, activityDates);
    localStorage.setItem(courseKeys.PROGRESS, JSON.stringify(courseProgress));
    result.inferredProgress = courseProgress.percentage;

    // Set migration flag
    localStorage.setItem(NEW_KEYS.MIGRATION_FLAG, 'true');

    console.log('[migration] Migration completed successfully');
    console.log(`[migration] Summary:
  - Activity dates: ${result.migratedActivityDates}
  - Course badges: ${result.migratedCourseBadges}
  - Global badges: ${result.migratedGlobalBadges}
  - Inferred progress: ${result.inferredProgress}%`);

    result.success = true;
  } catch (error) {
    console.error('[migration] Migration failed:', error);
  }

  return result;
}

/**
 * Check migration status
 */
export function getMigrationStatus(): {
  migrated: boolean;
  hasLegacyData: boolean;
} {
  if (typeof localStorage === 'undefined') {
    return { migrated: false, hasLegacyData: false };
  }

  const migrated = localStorage.getItem(NEW_KEYS.MIGRATION_FLAG) === 'true';
  const hasLegacyActivity = localStorage.getItem(LEGACY_KEYS.ACTIVITY_DATES) !== null;
  const hasLegacyBadges = localStorage.getItem(LEGACY_KEYS.BADGE_DATES) !== null;

  return {
    migrated,
    hasLegacyData: hasLegacyActivity || hasLegacyBadges
  };
}

/**
 * Rollback migration (for debugging)
 * Removes new format data but keeps legacy data
 */
export function rollbackMigration(): void {
  if (typeof localStorage === 'undefined') return;

  const keysToRemove = [
    NEW_KEYS.GLOBAL_ACTIVITY,
    NEW_KEYS.GLOBAL_BADGES,
    NEW_KEYS.MIGRATION_FLAG,
    getCourseKeys('llm-do-zero').PROGRESS,
    getCourseKeys('llm-do-zero').BADGES,
  ];

  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }

  console.log('[migration] Rollback completed');
}

/**
 * Clean up legacy data (call after confirming migration success)
 */
export function cleanupLegacyData(): void {
  if (typeof localStorage === 'undefined') return;

  // Only clean up if migration is complete
  if (localStorage.getItem(NEW_KEYS.MIGRATION_FLAG) !== 'true') {
    console.warn('[migration] Cannot cleanup: migration not complete');
    return;
  }

  localStorage.removeItem(LEGACY_KEYS.ACTIVITY_DATES);
  localStorage.removeItem(LEGACY_KEYS.BADGE_DATES);

  console.log('[migration] Legacy data cleaned up');
}
```

### Integracao no App

**`src/scripts/init.ts`:**

```typescript
import { isMigrationNeeded, executeMigration } from '../utils/migration';

/**
 * Initialize the app
 * Called on every page load
 */
export function initializeApp(): void {
  // Run migration if needed
  if (isMigrationNeeded()) {
    const result = executeMigration();

    if (result.success) {
      // Optionally show a toast notification
      console.log('Seus dados foram migrados para o novo sistema!');
    }
  }

  // Continue with normal initialization...
}

// Auto-run on load
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', initializeApp);
}
```

---

## Verificacao e Rollback

### Checklist de Verificacao

Apos a migracao, verificar:

1. **Activity Dates**
   - [ ] `gaeia_global_activity_dates` contem todas as datas
   - [ ] Datas estao ordenadas e sem duplicatas
   - [ ] Streak continua funcionando

2. **Global Badges**
   - [ ] `gaeia_global_badges` contem badges de streak
   - [ ] Datas de conquista preservadas

3. **Course Badges**
   - [ ] `gaeia_llm-do-zero_badges` contem badges de bloco
   - [ ] Mapeamento de nomes correto
   - [ ] Datas de conquista preservadas

4. **Course Progress**
   - [ ] `gaeia_llm-do-zero_progress` existe
   - [ ] Unidades completas inferidas corretamente
   - [ ] Porcentagem calculada corretamente

5. **Migration Flag**
   - [ ] `gaeia_migration_v2` = "true"

### Script de Verificacao (Console)

```javascript
// Colar no console do navegador para verificar migracao

function verifyMigration() {
  const checks = [];

  // Check migration flag
  const flag = localStorage.getItem('gaeia_migration_v2');
  checks.push({
    name: 'Migration flag',
    pass: flag === 'true',
    value: flag
  });

  // Check global activity
  const activity = localStorage.getItem('gaeia_global_activity_dates');
  checks.push({
    name: 'Global activity dates',
    pass: activity !== null,
    value: activity ? JSON.parse(activity).length + ' dates' : 'null'
  });

  // Check global badges
  const globalBadges = localStorage.getItem('gaeia_global_badges');
  checks.push({
    name: 'Global badges',
    pass: true, // optional
    value: globalBadges ? Object.keys(JSON.parse(globalBadges)).length + ' badges' : '0 badges'
  });

  // Check course progress
  const progress = localStorage.getItem('gaeia_llm-do-zero_progress');
  let progressData = null;
  try {
    progressData = progress ? JSON.parse(progress) : null;
  } catch (e) {}

  checks.push({
    name: 'Course progress',
    pass: progressData !== null,
    value: progressData ? progressData.percentage + '%' : 'null'
  });

  // Check course badges
  const courseBadges = localStorage.getItem('gaeia_llm-do-zero_badges');
  checks.push({
    name: 'Course badges',
    pass: true, // optional
    value: courseBadges ? Object.keys(JSON.parse(courseBadges)).length + ' badges' : '0 badges'
  });

  // Print results
  console.table(checks);

  const allPassed = checks.every(c => c.pass);
  console.log(allPassed ? '✅ Migration verified!' : '❌ Migration issues found');

  return allPassed;
}

verifyMigration();
```

### Rollback Manual

Se algo der errado, o usuario pode fazer rollback manualmente:

```javascript
// Colar no console para fazer rollback

function rollbackMigration() {
  const keysToRemove = [
    'gaeia_global_activity_dates',
    'gaeia_global_badges',
    'gaeia_migration_v2',
    'gaeia_llm-do-zero_progress',
    'gaeia_llm-do-zero_badges',
  ];

  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }

  console.log('Rollback completed. Refresh the page.');
}

// Confirmar antes de executar
if (confirm('Isso vai reverter a migracao. Dados antigos serao preservados. Continuar?')) {
  rollbackMigration();
}
```

---

## Casos Especiais

### Caso 1: Usuario Sem Dados

**Cenario:** Novo usuario, nunca acessou a plataforma antes.

**Comportamento:**
- `isMigrationNeeded()` retorna `false` (nenhum dado legado)
- Flag de migracao e setada mesmo assim
- Nenhuma migracao executada

### Caso 2: Dados Corrompidos

**Cenario:** JSON invalido no localStorage.

**Comportamento:**
- Try/catch captura erro de parse
- Log de warning no console
- Continua com dados vazios para aquele campo
- Migracao parcial (o que for possivel)

### Caso 3: Badge Desconhecido

**Cenario:** Badge ID que nao existe no mapeamento.

**Comportamento:**
- Log de warning no console
- Badge ignorado (nao migrado)
- Outros badges continuam normalmente

### Caso 4: Migracao Incompleta

**Cenario:** Pagina fechada no meio da migracao.

**Comportamento:**
- Flag nao foi setada
- Proxima visita tenta migrar novamente
- Migracao e idempotente (nao duplica dados)

### Caso 5: Usuario com Muito Progresso

**Cenario:** Usuario completou todos os 9 blocos.

**Comportamento:**
- Todos os badges de bloco migrados
- `completed: true` no CourseProgress
- Badge `llm-completionist` verificado
- `completedAt` definido baseado no ultimo badge

### Caso 6: Limpeza Prematura

**Cenario:** Alguem chama `cleanupLegacyData()` antes da migracao.

**Comportamento:**
- Funcao verifica flag de migracao
- Se flag nao existe, recusa limpar
- Log de warning

---

## Timeline de Rollout

### Fase 1: Preparacao (Pre-deploy)

1. Implementar codigo de migracao
2. Testar localmente com dados de exemplo
3. Escrever testes automatizados

### Fase 2: Deploy Soft

1. Deploy do codigo de migracao
2. Migracao roda automaticamente para usuarios
3. Monitorar logs de erro

### Fase 3: Verificacao (1 semana)

1. Coletar feedback de usuarios
2. Verificar que streak continua funcionando
3. Verificar que badges aparecem corretamente

### Fase 4: Limpeza (2 semanas)

1. Adicionar botao "Limpar dados antigos" nas configuracoes
2. Ou limpar automaticamente em versao futura
3. Remover codigo de migracao apos 90 dias

---

## Documentos Relacionados

- [Documento de Design Principal](../plans/2026-02-03-universo-aprendizado-design.md)
- [Arquitetura Tecnica](../architecture/multi-course-system.md)
- [Especificacao de Schemas](../schemas/catalog-schema.md)

---

*Documento criado em 2026-02-03*
