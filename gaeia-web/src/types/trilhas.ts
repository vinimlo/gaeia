/**
 * Type definitions for the GAEIA Trilhas (Learning Paths) System
 * Topics-based architecture with shared content across multiple paths
 */

// ============================================
// Checklist Types
// ============================================

/**
 * Checklist item from markdown
 */
export interface ChecklistItem {
  text: string;
  checked: boolean;
  indent: number;
}

// ============================================
// Catalog Types
// ============================================

/**
 * Root catalog for trilhas and topicos
 */
export interface TrilhasCatalog {
  version: string;
  nome: string;
  descricao: string;
  trilhas: TrilhaReference[];
  topicos: {
    path: string;
    indexFile: string;
  };
}

/**
 * Reference to a trilha in the catalog
 */
export interface TrilhaReference {
  id: string;
  path: string;
}

// ============================================
// Topico Types
// ============================================

/**
 * Topic index entry (from _index.json)
 */
export interface TopicoIndexEntry {
  id: string;
  arquivo: string;
  tags: string[];
}

/**
 * Topic index file structure
 */
export interface TopicosIndex {
  topicos: TopicoIndexEntry[];
}

/**
 * Topic frontmatter
 */
export interface TopicoFrontmatter {
  titulo: string;
  tags: string[];
  prerequisitos: string[];
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  tempoEstimado: number;
  autor: string;
  ultimaAtualizacao: string;
}

/**
 * Full topic with content
 */
export interface Topico extends TopicoFrontmatter {
  id: string;
  content: string;
  checklistItems: ChecklistItem[];
}

/**
 * Topic with progress info
 */
export interface TopicoWithProgress extends Topico {
  completo: boolean;
  progresso: number;
  dataInicio?: string;
  dataConclusao?: string;
}

// ============================================
// Trilha (Learning Path) Types
// ============================================

/**
 * Module within a trilha
 */
export interface TrilhaModulo {
  id: string;
  nome: string;
  descricao: string;
  topicos: string[]; // Topic IDs
}

/**
 * Badge condition types
 */
export interface BadgeCondicao {
  topicosCompletos?: number;
  moduloCompleto?: string;
  trilhaCompleta?: boolean;
}

/**
 * Badge definition for a trilha
 */
export interface TrilhaBadge {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  condicao: BadgeCondicao;
}

/**
 * Trilha definition (from course.json)
 */
export interface Trilha {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  nivel: 'iniciante' | 'intermediario' | 'avancado';
  horasEstimadas: number;
  modulos: TrilhaModulo[];
  badges: TrilhaBadge[];
}

/**
 * Trilha with fully loaded topics
 */
export interface TrilhaWithTopicos extends Trilha {
  topicosCarregados: TopicoWithProgress[];
  progresso: number;
  topicosCompletos: number;
  totalTopicos: number;
}

/**
 * Module with loaded topics
 */
export interface ModuloWithTopicos extends TrilhaModulo {
  topicosCarregados: TopicoWithProgress[];
  progresso: number;
  completo: boolean;
}

// ============================================
// Navigation Types
// ============================================

/**
 * Navigation context for a topic within a trilha
 */
export interface TopicoNavigation {
  trilha: Trilha;
  modulo: TrilhaModulo;
  anterior: string | null;
  proximo: string | null;
  posicaoNoModulo: number;
  posicaoNaTrilha: number;
  totalNaTrilha: number;
}

/**
 * Trilhas that contain a specific topic
 */
export interface TopicoTrilhas {
  topicoId: string;
  trilhas: {
    trilha: Trilha;
    modulo: TrilhaModulo;
  }[];
}

// ============================================
// Progress Types
// ============================================

/**
 * Progress for a single topic (stored in localStorage)
 */
export interface TopicoProgress {
  completo: boolean;
  checklist: boolean[];
  dataInicio?: string;
  dataConclusao?: string;
}

/**
 * Global progress data (stored in localStorage)
 */
export interface GaeiaProgressData {
  topicos: Record<string, TopicoProgress>;
  streak: {
    atual: number;
    maximo: number;
    ultimoDia: string;
  };
  badges: string[];
}

// ============================================
// API Response Types
// ============================================

/**
 * Summary of all trilhas for the home page
 */
export interface TrilhasSummary {
  trilhas: {
    trilha: Trilha;
    progresso: number;
    topicosCompletos: number;
    totalTopicos: number;
  }[];
  totalTopicos: number;
  topicosUnicos: number;
}

/**
 * Topic search result
 */
export interface TopicoSearchResult {
  topico: Topico;
  relevance: number;
  matchedTags: string[];
  trilhas: string[];
}
