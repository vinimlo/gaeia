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

