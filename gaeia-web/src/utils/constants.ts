/**
 * Centralized constants for GAEIA-Web
 * Single source of truth for configuration values
 */

import { existsSync } from 'fs';
import { join } from 'path';

// ============================================
// Vault Configuration
// ============================================

/**
 * Root path to the Obsidian vault
 * In Docker: /vault
 * Locally: parent directory of gaeia-web
 */
export const VAULT_ROOT = existsSync('/vault/universe')
  ? '/vault'
  : join(process.cwd(), '..');

// ============================================
// Universe Configuration
// ============================================

/**
 * Universe directory relative to vault root
 */
export const UNIVERSE_DIR = 'universe';

/**
 * Full path to universe directory
 */
export const UNIVERSE_PATH = join(VAULT_ROOT, UNIVERSE_DIR);

/**
 * Path to universe catalog file
 */
export const CATALOG_FILE = '_catalog.json';

/**
 * Path to shared assets (global badges, etc)
 */
export const SHARED_DIR = 'shared';

// ============================================
// Regex Patterns
// ============================================

/**
 * Pattern for parsing checkbox items in markdown
 * Matches: - [ ] text, - [x] text, - [X] text
 * Groups: (indent)(checkChar)(text)
 */
export const CHECKBOX_PATTERN = /^(\s*)-\s*\[([ xX])\]\s*(.+)$/;

/**
 * Global version of checkbox pattern for replacements
 */
export const CHECKBOX_PATTERN_GLOBAL = /^(\s*-\s*\[)([ xX])(\]\s*.+)$/gm;

/**
 * Pattern for parsing YAML frontmatter
 */
export const FRONTMATTER_PATTERN = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;

/**
 * Pattern for matching H1 headings
 */
export const H1_PATTERN = /^#\s+(.+)$/m;

/**
 * Pattern for markdown headers (any level)
 */
export const HEADER_PATTERN = /^(#{1,6})\s+(.+)$/;

// ============================================
// Storage Keys (re-exported from storageKeys.ts)
// ============================================

// NOTE: Storage keys are defined in storageKeys.ts to avoid
// importing Node.js dependencies in client-side code.
// Import directly from './storageKeys' for client-side usage.
export { STORAGE_KEYS, STORAGE_PREFIX } from './storageKeys';

// ============================================
// Difficulty Levels
// ============================================

/**
 * Difficulty level configuration
 */
export const DIFFICULTY_LEVELS = {
  iniciante: { label: 'Iniciante', color: 'green' },
  intermediario: { label: 'Intermediario', color: 'amber' },
  avancado: { label: 'Avancado', color: 'orange' },
} as const;
