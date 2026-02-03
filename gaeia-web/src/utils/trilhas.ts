/**
 * Trilhas (Learning Paths) utilities for GAEIA
 * Reads from the universe directory structure
 *
 * Architecture:
 * - Topics are atomic content units stored in universe/topicos/
 * - Trilhas are direct JSON files in universe/trilhas/ (e.g., llm-do-zero.json)
 * - Progress is tracked per topic (shared across trilhas)
 */

import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { VAULT_ROOT, UNIVERSE_DIR, FRONTMATTER_PATTERN } from './constants';
import { createLogger } from './logger';
import { parseChecklist, type ChecklistItem } from './checklist';
import type {
  TrilhasCatalog,
  Trilha,
  TrilhaModulo,
  Topico,
  TopicoFrontmatter,
  TopicosIndex,
  TopicoIndexEntry,
  TopicoNavigation,
  TopicoTrilhas,
  TrilhaWithTopicos,
  ModuloWithTopicos,
  TrilhasSummary,
} from '../types/trilhas';

const log = createLogger('trilhas');

// ============================================
// Cache
// ============================================

let catalogCache: TrilhasCatalog | null = null;
let trilhasCache: Map<string, Trilha> = new Map();
let topicosIndexCache: TopicosIndex | null = null;
let topicosCache: Map<string, Topico> = new Map();

/**
 * Clear all caches (useful for dev hot-reloading)
 */
export function clearTrilhasCaches(): void {
  catalogCache = null;
  trilhasCache.clear();
  topicosIndexCache = null;
  topicosCache.clear();
}

// ============================================
// Path Helpers
// ============================================

/**
 * Get the full path to the universe directory
 */
export function getUniversePath(): string {
  return join(VAULT_ROOT, UNIVERSE_DIR);
}

/**
 * Check if the new trilhas structure exists
 */
export function trilhasExist(): boolean {
  const catalogPath = join(getUniversePath(), '_catalog.json');
  if (!existsSync(catalogPath)) return false;

  try {
    const content = require('fs').readFileSync(catalogPath, 'utf-8');
    const catalog = JSON.parse(content);
    // Check if it's the new format with trilhas array
    return Array.isArray(catalog.trilhas);
  } catch {
    return false;
  }
}

// ============================================
// Catalog Functions
// ============================================

/**
 * Load the catalog
 */
export async function getCatalog(): Promise<TrilhasCatalog | null> {
  if (catalogCache) return catalogCache;

  const catalogPath = join(getUniversePath(), '_catalog.json');

  if (!existsSync(catalogPath)) {
    log.warn(`Catalog not found at: ${catalogPath}`);
    return null;
  }

  try {
    const content = await readFile(catalogPath, 'utf-8');
    catalogCache = JSON.parse(content) as TrilhasCatalog;
    return catalogCache;
  } catch (error) {
    log.error('Failed to read catalog:', error);
    return null;
  }
}

// ============================================
// Trilha Functions
// ============================================

/**
 * Get a trilha by ID
 */
export async function getTrilha(trilhaId: string): Promise<Trilha | null> {
  // Check cache
  if (trilhasCache.has(trilhaId)) {
    return trilhasCache.get(trilhaId)!;
  }

  const catalog = await getCatalog();
  if (!catalog) return null;

  const trilhaRef = catalog.trilhas.find(t => t.id === trilhaId);
  if (!trilhaRef) {
    log.warn(`Trilha not found in catalog: ${trilhaId}`);
    return null;
  }

  // The path now points directly to the JSON file (e.g., "trilhas/llm-do-zero.json")
  const trilhaPath = join(getUniversePath(), trilhaRef.path);

  if (!existsSync(trilhaPath)) {
    log.warn(`Trilha not found at: ${trilhaPath}`);
    return null;
  }

  try {
    const content = await readFile(trilhaPath, 'utf-8');
    const trilha = JSON.parse(content) as Trilha;
    trilhasCache.set(trilhaId, trilha);
    return trilha;
  } catch (error) {
    log.error(`Failed to read trilha ${trilhaId}:`, error);
    return null;
  }
}

/**
 * Get all trilhas
 */
export async function getAllTrilhas(): Promise<Trilha[]> {
  const catalog = await getCatalog();
  if (!catalog) return [];

  const trilhas: Trilha[] = [];
  for (const ref of catalog.trilhas) {
    const trilha = await getTrilha(ref.id);
    if (trilha) trilhas.push(trilha);
  }
  return trilhas;
}

/**
 * Get all topic IDs in a trilha (flattened from modules)
 */
export function getTrilhaTopicoIds(trilha: Trilha): string[] {
  return trilha.modulos.flatMap(m => m.topicos);
}

// ============================================
// Topico Functions
// ============================================

/**
 * Get the topicos index
 */
export async function getTopicosIndex(): Promise<TopicosIndex | null> {
  if (topicosIndexCache) return topicosIndexCache;

  const catalog = await getCatalog();
  if (!catalog) return null;

  const indexPath = join(
    getUniversePath(),
    catalog.topicos.path,
    catalog.topicos.indexFile
  );

  if (!existsSync(indexPath)) {
    log.warn(`Topicos index not found at: ${indexPath}`);
    return null;
  }

  try {
    const content = await readFile(indexPath, 'utf-8');
    topicosIndexCache = JSON.parse(content) as TopicosIndex;
    return topicosIndexCache;
  } catch (error) {
    log.error('Failed to read topicos index:', error);
    return null;
  }
}

/**
 * Parse frontmatter from markdown content
 */
function parseFrontmatter(content: string): {
  frontmatter: Record<string, unknown>;
  body: string;
} {
  const match = content.match(FRONTMATTER_PATTERN);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const [, yamlContent, body] = match;
  const frontmatter: Record<string, unknown> = {};

  // Simple YAML parsing
  const lines = yamlContent.split('\n');
  let currentKey: string | null = null;
  let arrayValue: string[] = [];
  let inArray = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Array item
    if (trimmed.startsWith('- ') && inArray && currentKey) {
      arrayValue.push(trimmed.slice(2).replace(/^["']|["']$/g, ''));
      continue;
    }

    // End of array
    if (inArray && currentKey && !trimmed.startsWith('-') && trimmed !== '') {
      frontmatter[currentKey] = arrayValue;
      inArray = false;
      arrayValue = [];
      currentKey = null;
    }

    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      const rawValue = line.slice(colonIndex + 1).trim();

      // Check if starting an array
      if (rawValue === '' || rawValue === '[]') {
        currentKey = key;
        inArray = true;
        arrayValue = [];
        continue;
      }

      // Parse inline array
      if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
        const items = rawValue
          .slice(1, -1)
          .split(',')
          .map(s => s.trim().replace(/^["']|["']$/g, ''))
          .filter(s => s);
        frontmatter[key] = items;
        continue;
      }

      // Parse value
      let value: unknown = rawValue;
      if (rawValue === 'true') value = true;
      else if (rawValue === 'false') value = false;
      else if (!isNaN(Number(rawValue)) && rawValue !== '') value = Number(rawValue);
      else if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
        value = rawValue.slice(1, -1);
      }

      frontmatter[key] = value;
    }
  }

  // Handle trailing array
  if (inArray && currentKey) {
    frontmatter[currentKey] = arrayValue;
  }

  return { frontmatter, body };
}

/**
 * Get a single topic by ID
 */
export async function getTopico(topicoId: string): Promise<Topico | null> {
  // Check cache
  if (topicosCache.has(topicoId)) {
    return topicosCache.get(topicoId)!;
  }

  const catalog = await getCatalog();
  if (!catalog) return null;

  const topicoPath = join(
    getUniversePath(),
    catalog.topicos.path,
    `${topicoId}.md`
  );

  if (!existsSync(topicoPath)) {
    log.warn(`Topico not found at: ${topicoPath}`);
    return null;
  }

  try {
    const content = await readFile(topicoPath, 'utf-8');
    const { frontmatter, body } = parseFrontmatter(content);

    const topico: Topico = {
      id: topicoId,
      titulo: (frontmatter.titulo as string) || topicoId,
      tags: (frontmatter.tags as string[]) || [],
      prerequisitos: (frontmatter.prerequisitos as string[]) || [],
      nivel: (frontmatter.nivel as 'iniciante' | 'intermediario' | 'avancado') || 'iniciante',
      tempoEstimado: (frontmatter.tempoEstimado as number) || 60,
      autor: (frontmatter.autor as string) || 'GAEIA',
      ultimaAtualizacao: (frontmatter.ultimaAtualizacao as string) || '',
      content: body,
      checklistItems: parseChecklist(body),
    };

    topicosCache.set(topicoId, topico);
    return topico;
  } catch (error) {
    log.error(`Failed to read topico ${topicoId}:`, error);
    return null;
  }
}

/**
 * Get all topics from the index
 */
export async function getAllTopicos(): Promise<Topico[]> {
  const index = await getTopicosIndex();
  if (!index) return [];

  const topicos: Topico[] = [];
  for (const entry of index.topicos) {
    const topico = await getTopico(entry.id);
    if (topico) topicos.push(topico);
  }
  return topicos;
}

/**
 * Get topics for a trilha (in order)
 */
export async function getTrilhaTopicos(trilhaId: string): Promise<Topico[]> {
  const trilha = await getTrilha(trilhaId);
  if (!trilha) return [];

  const topicoIds = getTrilhaTopicoIds(trilha);
  const topicos: Topico[] = [];

  for (const id of topicoIds) {
    const topico = await getTopico(id);
    if (topico) topicos.push(topico);
  }

  return topicos;
}

/**
 * Get topics by tag
 */
export async function getTopicosByTag(tag: string): Promise<Topico[]> {
  const index = await getTopicosIndex();
  if (!index) return [];

  const matching = index.topicos.filter(entry => entry.tags.includes(tag));
  const topicos: Topico[] = [];

  for (const entry of matching) {
    const topico = await getTopico(entry.id);
    if (topico) topicos.push(topico);
  }

  return topicos;
}

// ============================================
// Navigation Functions
// ============================================

/**
 * Get navigation context for a topic within a trilha
 */
export async function getTopicoNavigation(
  trilhaId: string,
  topicoId: string
): Promise<TopicoNavigation | null> {
  const trilha = await getTrilha(trilhaId);
  if (!trilha) return null;

  const allTopicoIds = getTrilhaTopicoIds(trilha);
  const posicaoNaTrilha = allTopicoIds.indexOf(topicoId);

  if (posicaoNaTrilha === -1) {
    log.warn(`Topico ${topicoId} not found in trilha ${trilhaId}`);
    return null;
  }

  // Find the module containing this topic
  let modulo: TrilhaModulo | null = null;
  let posicaoNoModulo = -1;

  for (const m of trilha.modulos) {
    const idx = m.topicos.indexOf(topicoId);
    if (idx !== -1) {
      modulo = m;
      posicaoNoModulo = idx;
      break;
    }
  }

  if (!modulo) return null;

  return {
    trilha,
    modulo,
    anterior: posicaoNaTrilha > 0 ? allTopicoIds[posicaoNaTrilha - 1] : null,
    proximo: posicaoNaTrilha < allTopicoIds.length - 1 ? allTopicoIds[posicaoNaTrilha + 1] : null,
    posicaoNoModulo,
    posicaoNaTrilha,
    totalNaTrilha: allTopicoIds.length,
  };
}

/**
 * Get all trilhas that contain a topic
 */
export async function getTopicoTrilhas(topicoId: string): Promise<TopicoTrilhas> {
  const trilhas = await getAllTrilhas();
  const result: TopicoTrilhas = {
    topicoId,
    trilhas: [],
  };

  for (const trilha of trilhas) {
    for (const modulo of trilha.modulos) {
      if (modulo.topicos.includes(topicoId)) {
        result.trilhas.push({ trilha, modulo });
        break; // Only add each trilha once
      }
    }
  }

  return result;
}

// ============================================
// Summary Functions
// ============================================

/**
 * Get summary of all trilhas for home page
 */
export async function getTrilhasSummary(): Promise<TrilhasSummary> {
  const trilhas = await getAllTrilhas();
  const allTopicoIds = new Set<string>();

  const summary: TrilhasSummary = {
    trilhas: [],
    totalTopicos: 0,
    topicosUnicos: 0,
  };

  for (const trilha of trilhas) {
    const topicoIds = getTrilhaTopicoIds(trilha);
    topicoIds.forEach(id => allTopicoIds.add(id));

    summary.trilhas.push({
      trilha,
      progresso: 0, // Will be calculated client-side with progress data
      topicosCompletos: 0,
      totalTopicos: topicoIds.length,
    });

    summary.totalTopicos += topicoIds.length;
  }

  summary.topicosUnicos = allTopicoIds.size;
  return summary;
}

/**
 * Get a trilha with all topics loaded
 */
export async function getTrilhaWithTopicos(trilhaId: string): Promise<TrilhaWithTopicos | null> {
  const trilha = await getTrilha(trilhaId);
  if (!trilha) return null;

  const topicos = await getTrilhaTopicos(trilhaId);

  return {
    ...trilha,
    topicosCarregados: topicos.map(t => ({
      ...t,
      completo: false,
      progresso: 0,
    })),
    progresso: 0,
    topicosCompletos: 0,
    totalTopicos: topicos.length,
  };
}

/**
 * Get a module with all topics loaded
 */
export async function getModuloWithTopicos(
  trilhaId: string,
  moduloId: string
): Promise<ModuloWithTopicos | null> {
  const trilha = await getTrilha(trilhaId);
  if (!trilha) return null;

  const modulo = trilha.modulos.find(m => m.id === moduloId);
  if (!modulo) return null;

  const topicos: Topico[] = [];
  for (const id of modulo.topicos) {
    const topico = await getTopico(id);
    if (topico) topicos.push(topico);
  }

  return {
    ...modulo,
    topicosCarregados: topicos.map(t => ({
      ...t,
      completo: false,
      progresso: 0,
    })),
    progresso: 0,
    completo: false,
  };
}

// ============================================
// Utility Functions
// ============================================

/**
 * Get all unique tags from all topics
 */
export async function getAllTags(): Promise<string[]> {
  const index = await getTopicosIndex();
  if (!index) return [];

  const tags = new Set<string>();
  for (const entry of index.topicos) {
    entry.tags.forEach(tag => tags.add(tag));
  }

  return Array.from(tags).sort();
}

/**
 * Calculate total estimated hours for a trilha
 */
export async function getTrilhaHours(trilhaId: string): Promise<number> {
  const topicos = await getTrilhaTopicos(trilhaId);
  return topicos.reduce((sum, t) => sum + t.tempoEstimado, 0);
}
