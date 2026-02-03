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
  // Global keys
  ACTIVITY_DATES: `${STORAGE_PREFIX}_activity_dates`,
  GLOBAL_BADGE_DATES: `${STORAGE_PREFIX}_global_badge_dates`,
  VIEW_PREFERENCE: `${STORAGE_PREFIX}_view_preference`,
  MIGRATION_FLAG: `${STORAGE_PREFIX}_migration_v2`,
  MIGRATION_FLAG_V3: `${STORAGE_PREFIX}_migration_v3`,

  // Legacy keys (for backward compatibility)
  LEGACY_BADGE_DATES: `${STORAGE_PREFIX}_badge_dates`,

  // Course-specific key builders (legacy)
  courseProgress: (courseId: string) => `${STORAGE_PREFIX}_course_${courseId}_progress`,
  courseBadgeDates: (courseId: string) => `${STORAGE_PREFIX}_course_${courseId}_badge_dates`,

  // Topic-based progress (new system)
  TOPICOS_PROGRESS: `${STORAGE_PREFIX}_topicos_progress`,
  STREAK_DATA: `${STORAGE_PREFIX}_streak_data`,
  EARNED_BADGES: `${STORAGE_PREFIX}_earned_badges`,
} as const;
