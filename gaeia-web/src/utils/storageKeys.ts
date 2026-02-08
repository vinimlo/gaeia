/**
 * Storage keys for GAEIA-Web
 * This file contains only browser-safe constants (no Node.js dependencies)
 */

// ============================================
// Storage Keys (namespaced for multi-course)
// ============================================

/**
 * Base prefix for all GAEIA storage keys
 */
export const STORAGE_PREFIX = 'gaeia';

/**
 * Storage key builders for multi-course support
 */
export const STORAGE_KEYS = {
  ACTIVITY_DATES: `${STORAGE_PREFIX}_activity_dates`,
  TOPICOS_PROGRESS: `${STORAGE_PREFIX}_topicos_progress`,
  STREAK_DATA: `${STORAGE_PREFIX}_streak_data`,
  EARNED_BADGES: `${STORAGE_PREFIX}_earned_badges`,
} as const;
