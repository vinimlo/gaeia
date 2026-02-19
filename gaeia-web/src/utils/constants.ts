/**
 * Centralized constants for Cosmos
 * Single source of truth for configuration values
 */

import { existsSync } from 'fs';
import { join } from 'path';

// ============================================
// Universe Path Resolution
// ============================================

/**
 * Resolve the universe content directory using a fallback chain:
 * 1. COSMOS_UNIVERSE_PATH env var (explicit override)
 * 2. Docker mount (/vault/universe)
 * 3. Sibling directory (../universe — submodule layout)
 * 4. Child directory (./universe — monorepo layout)
 */
function resolveUniversePath(): string {
  if (process.env.COSMOS_UNIVERSE_PATH) {
    return process.env.COSMOS_UNIVERSE_PATH;
  }

  if (existsSync('/vault/universe')) {
    return '/vault/universe';
  }

  const siblingPath = join(process.cwd(), '..', 'universe');
  if (existsSync(siblingPath)) {
    return siblingPath;
  }

  const childPath = join(process.cwd(), 'universe');
  if (existsSync(childPath)) {
    return childPath;
  }

  // Fallback to sibling (most common in submodule layout)
  return siblingPath;
}

/**
 * Resolved path to the universe content directory
 */
export const UNIVERSE_PATH = resolveUniversePath();

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
