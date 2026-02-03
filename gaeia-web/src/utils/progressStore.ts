/**
 * Client-side progress storage utilities
 * Uses localStorage to track streaks, badges, and activity
 *
 * This file is designed to be used in client-side scripts only.
 * Supports multi-course progress tracking with namespaced storage.
 */

import { STORAGE_KEYS } from './storageKeys';

// localStorage keys (for backward compatibility)
const KEYS = {
  ACTIVITY_DATES: STORAGE_KEYS.ACTIVITY_DATES,
  BADGE_DATES: STORAGE_KEYS.LEGACY_BADGE_DATES,
  GLOBAL_BADGE_DATES: STORAGE_KEYS.GLOBAL_BADGE_DATES,
  VIEW_PREFERENCE: STORAGE_KEYS.VIEW_PREFERENCE,
  MIGRATION_FLAG: STORAGE_KEYS.MIGRATION_FLAG,
} as const;

// Type definitions
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  activityDates: string[];
}

export interface BadgeDates {
  [badgeId: string]: string; // badgeId -> ISO date when earned
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Get activity dates from localStorage
 */
export function getActivityDates(): string[] {
  if (typeof localStorage === 'undefined') return [];

  try {
    const stored = localStorage.getItem(KEYS.ACTIVITY_DATES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.warn('[progressStore] Failed to parse activity dates:', error);
    return [];
  }
}

/**
 * Record activity for today
 */
export function recordActivity(): void {
  if (typeof localStorage === 'undefined') return;

  const dates = getActivityDates();
  const today = getTodayString();

  if (!dates.includes(today)) {
    dates.push(today);
    dates.sort();
    localStorage.setItem(KEYS.ACTIVITY_DATES, JSON.stringify(dates));
  }
}

/**
 * Calculate streak data from activity dates
 */
export function calculateStreakData(): StreakData {
  const dates = getActivityDates();

  if (dates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      activityDates: []
    };
  }

  // Sort dates in descending order (most recent first)
  const sortedDates = [...dates].sort().reverse();
  const today = getTodayString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = sortedDates[0];

  // Only count current streak if last activity was today or yesterday
  if (checkDate === today || checkDate === yesterdayString) {
    currentStreak = 1;

    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(sortedDates[i - 1]);
      const currDate = new Date(sortedDates[i]);

      // Check if dates are consecutive
      prevDate.setDate(prevDate.getDate() - 1);
      if (prevDate.toISOString().split('T')[0] === sortedDates[i]) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;
  const ascendingDates = [...dates].sort();

  for (let i = 1; i < ascendingDates.length; i++) {
    const prevDate = new Date(ascendingDates[i - 1]);
    prevDate.setDate(prevDate.getDate() + 1);

    if (prevDate.toISOString().split('T')[0] === ascendingDates[i]) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return {
    currentStreak,
    longestStreak,
    lastActivityDate: sortedDates[0],
    activityDates: dates
  };
}

/**
 * Get badge earned dates from localStorage
 */
export function getBadgeDates(): BadgeDates {
  if (typeof localStorage === 'undefined') return {};

  try {
    const stored = localStorage.getItem(KEYS.BADGE_DATES);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('[progressStore] Failed to parse badge dates:', error);
    return {};
  }
}

/**
 * Record when a badge was earned
 */
export function recordBadgeEarned(badgeId: string): void {
  if (typeof localStorage === 'undefined') return;

  const badges = getBadgeDates();

  // Only record if not already earned
  if (!badges[badgeId]) {
    badges[badgeId] = getTodayString();
    localStorage.setItem(KEYS.BADGE_DATES, JSON.stringify(badges));
  }
}

/**
 * Check if a badge has been earned
 */
export function isBadgeEarned(badgeId: string): boolean {
  const badges = getBadgeDates();
  return !!badges[badgeId];
}

/**
 * Get the date when a badge was earned
 */
export function getBadgeEarnedDate(badgeId: string): string | null {
  const badges = getBadgeDates();
  return badges[badgeId] || null;
}

/**
 * Clear all progress data (for testing/reset purposes)
 */
export function clearAllProgress(): void {
  if (typeof localStorage === 'undefined') return;

  localStorage.removeItem(KEYS.ACTIVITY_DATES);
  localStorage.removeItem(KEYS.BADGE_DATES);
}

/**
 * Export progress data for backup
 */
export function exportProgressData(): { activityDates: string[]; badgeDates: BadgeDates } {
  return {
    activityDates: getActivityDates(),
    badgeDates: getBadgeDates()
  };
}

/**
 * Import progress data from backup
 */
export function importProgressData(data: { activityDates?: string[]; badgeDates?: BadgeDates }): void {
  if (typeof localStorage === 'undefined') return;

  if (data.activityDates) {
    localStorage.setItem(KEYS.ACTIVITY_DATES, JSON.stringify(data.activityDates));
  }
  if (data.badgeDates) {
    localStorage.setItem(KEYS.BADGE_DATES, JSON.stringify(data.badgeDates));
  }
}

// ============================================
// Multi-course progress functions
// ============================================

/**
 * Course-specific progress data
 */
export interface CourseProgressData {
  startedAt?: string;
  lastActivityAt?: string;
  completedAt?: string;
}

/**
 * Get progress data for a specific course
 */
export function getCourseProgressData(courseId: string): CourseProgressData {
  if (typeof localStorage === 'undefined') return {};

  try {
    const key = STORAGE_KEYS.courseProgress(courseId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn(`[progressStore] Failed to parse course progress for ${courseId}:`, error);
    return {};
  }
}

/**
 * Save progress data for a specific course
 */
export function saveCourseProgressData(courseId: string, data: Partial<CourseProgressData>): void {
  if (typeof localStorage === 'undefined') return;

  const existing = getCourseProgressData(courseId);
  const updated = { ...existing, ...data };
  const key = STORAGE_KEYS.courseProgress(courseId);
  localStorage.setItem(key, JSON.stringify(updated));
}

/**
 * Record that a course was started
 */
export function recordCourseStarted(courseId: string): void {
  const existing = getCourseProgressData(courseId);
  if (!existing.startedAt) {
    saveCourseProgressData(courseId, {
      startedAt: getTodayString(),
      lastActivityAt: getTodayString(),
    });
  }
}

/**
 * Record activity on a course
 */
export function recordCourseActivity(courseId: string): void {
  saveCourseProgressData(courseId, {
    lastActivityAt: getTodayString(),
  });
  // Also record global activity
  recordActivity();
}

/**
 * Record that a course was completed
 */
export function recordCourseCompleted(courseId: string): void {
  saveCourseProgressData(courseId, {
    completedAt: getTodayString(),
    lastActivityAt: getTodayString(),
  });
}

/**
 * Get badge dates for a specific course
 */
export function getCourseBadgeDates(courseId: string): BadgeDates {
  if (typeof localStorage === 'undefined') return {};

  try {
    const key = STORAGE_KEYS.courseBadgeDates(courseId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn(`[progressStore] Failed to parse course badge dates for ${courseId}:`, error);
    return {};
  }
}

/**
 * Record when a course badge was earned
 */
export function recordCourseBadgeEarned(courseId: string, badgeId: string): void {
  if (typeof localStorage === 'undefined') return;

  const badges = getCourseBadgeDates(courseId);

  if (!badges[badgeId]) {
    badges[badgeId] = getTodayString();
    const key = STORAGE_KEYS.courseBadgeDates(courseId);
    localStorage.setItem(key, JSON.stringify(badges));
  }
}

/**
 * Get global badge dates
 */
export function getGlobalBadgeDates(): BadgeDates {
  if (typeof localStorage === 'undefined') return {};

  try {
    const stored = localStorage.getItem(KEYS.GLOBAL_BADGE_DATES);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('[progressStore] Failed to parse global badge dates:', error);
    return {};
  }
}

/**
 * Record when a global badge was earned
 */
export function recordGlobalBadgeEarned(badgeId: string): void {
  if (typeof localStorage === 'undefined') return;

  const badges = getGlobalBadgeDates();

  if (!badges[badgeId]) {
    badges[badgeId] = getTodayString();
    localStorage.setItem(KEYS.GLOBAL_BADGE_DATES, JSON.stringify(badges));
  }
}

// ============================================
// View preference functions
// ============================================

export type ViewPreference = 'map' | 'catalog';

/**
 * Get the user's view preference
 */
export function getViewPreference(): ViewPreference {
  if (typeof localStorage === 'undefined') return 'map';

  try {
    const stored = localStorage.getItem(KEYS.VIEW_PREFERENCE);
    return (stored === 'catalog' ? 'catalog' : 'map') as ViewPreference;
  } catch {
    return 'map';
  }
}

/**
 * Save the user's view preference
 */
export function setViewPreference(preference: ViewPreference): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEYS.VIEW_PREFERENCE, preference);
}

// ============================================
// Migration functions
// ============================================

/**
 * Check if migration has been completed
 */
export function isMigrationComplete(): boolean {
  if (typeof localStorage === 'undefined') return true;
  return localStorage.getItem(KEYS.MIGRATION_FLAG) === 'true';
}

/**
 * Mark migration as complete
 */
export function markMigrationComplete(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(KEYS.MIGRATION_FLAG, 'true');
}

/**
 * Get all started course IDs from localStorage
 */
export function getStartedCourseIds(): string[] {
  if (typeof localStorage === 'undefined') return [];

  const courseIds: string[] = [];
  const prefix = 'gaeia_course_';
  const suffix = '_progress';

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(prefix) && key.endsWith(suffix)) {
      const courseId = key.slice(prefix.length, -suffix.length);
      courseIds.push(courseId);
    }
  }

  return courseIds;
}

/**
 * Get count of completed courses
 */
export function getCompletedCourseCount(): number {
  const courseIds = getStartedCourseIds();
  let count = 0;

  for (const courseId of courseIds) {
    const progress = getCourseProgressData(courseId);
    if (progress.completedAt) {
      count++;
    }
  }

  return count;
}

// ============================================
// Topic-based progress functions (new system)
// ============================================

/**
 * Topic progress data
 */
export interface TopicoProgressData {
  completo: boolean;
  checklist: boolean[];
  dataInicio?: string;
  dataConclusao?: string;
}

/**
 * All topics progress stored together
 */
export interface TopicosProgressMap {
  [topicoId: string]: TopicoProgressData;
}

/**
 * Get all topics progress
 */
export function getTopicosProgress(): TopicosProgressMap {
  if (typeof localStorage === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TOPICOS_PROGRESS);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('[progressStore] Failed to parse topicos progress:', error);
    return {};
  }
}

/**
 * Get progress for a single topic
 */
export function getTopicoProgress(topicoId: string): TopicoProgressData | null {
  const allProgress = getTopicosProgress();
  return allProgress[topicoId] || null;
}

/**
 * Save progress for a single topic
 */
export function saveTopicoProgress(topicoId: string, data: Partial<TopicoProgressData>): void {
  if (typeof localStorage === 'undefined') return;

  const allProgress = getTopicosProgress();
  const existing = allProgress[topicoId] || { completo: false, checklist: [] };

  allProgress[topicoId] = {
    ...existing,
    ...data,
  };

  // Set dataInicio if not set
  if (!allProgress[topicoId].dataInicio) {
    allProgress[topicoId].dataInicio = getTodayString();
  }

  // Set dataConclusao if complete
  if (data.completo && !allProgress[topicoId].dataConclusao) {
    allProgress[topicoId].dataConclusao = getTodayString();
  }

  localStorage.setItem(STORAGE_KEYS.TOPICOS_PROGRESS, JSON.stringify(allProgress));

  // Also record global activity
  recordActivity();
}

/**
 * Update topic checklist and calculate progress
 */
export function updateTopicoChecklist(topicoId: string, checklist: boolean[]): void {
  const completo = checklist.length > 0 && checklist.every(Boolean);
  saveTopicoProgress(topicoId, { checklist, completo });
}

/**
 * Check if a topic is complete
 */
export function isTopicoComplete(topicoId: string): boolean {
  const progress = getTopicoProgress(topicoId);
  return progress?.completo || false;
}

/**
 * Get count of completed topics
 */
export function getCompletedTopicosCount(): number {
  const allProgress = getTopicosProgress();
  return Object.values(allProgress).filter(p => p.completo).length;
}

/**
 * Calculate progress percentage for a topic
 */
export function calculateTopicoProgressPercent(topicoId: string): number {
  const progress = getTopicoProgress(topicoId);
  if (!progress || progress.checklist.length === 0) return 0;

  const completed = progress.checklist.filter(Boolean).length;
  return Math.round((completed / progress.checklist.length) * 100);
}

/**
 * Calculate progress for a trilha based on its topics
 */
export function calculateTrilhaProgress(topicoIds: string[]): {
  completedCount: number;
  totalCount: number;
  percentage: number;
} {
  if (topicoIds.length === 0) {
    return { completedCount: 0, totalCount: 0, percentage: 0 };
  }

  const allProgress = getTopicosProgress();
  let completedCount = 0;

  for (const id of topicoIds) {
    if (allProgress[id]?.completo) {
      completedCount++;
    }
  }

  return {
    completedCount,
    totalCount: topicoIds.length,
    percentage: Math.round((completedCount / topicoIds.length) * 100),
  };
}

/**
 * Migrate legacy block progress to topic progress
 */
export function migrateBlocksToTopicos(): void {
  if (typeof localStorage === 'undefined') return;

  // Check if already migrated
  if (localStorage.getItem(STORAGE_KEYS.MIGRATION_FLAG_V3) === 'true') {
    return;
  }

  // Map of old block slugs to new topic IDs
  const blockToTopicMap: Record<string, string> = {
    'bloco-1': 'neuronio-e-vetores',
    'bloco-2': 'mlp-e-matrizes',
    'bloco-3': 'loss-e-derivadas',
    'bloco-4': 'backpropagation',
    'bloco-5': 'embeddings-texto',
    'bloco-6': 'self-attention',
    'bloco-7': 'transformer',
    'bloco-8': 'tokenizacao',
    'bloco-9': 'seu-gpt',
  };

  // Look for any existing block progress
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    // Look for block checklist data
    for (const [blockSlug, topicoId] of Object.entries(blockToTopicMap)) {
      if (key.includes(blockSlug) && key.includes('checklist')) {
        try {
          const value = localStorage.getItem(key);
          if (value) {
            const checklist = JSON.parse(value);
            if (Array.isArray(checklist)) {
              const completo = checklist.every(Boolean);
              saveTopicoProgress(topicoId, { checklist, completo });
            }
          }
        } catch (e) {
          console.warn(`Failed to migrate ${key}:`, e);
        }
      }
    }
  }

  // Mark migration as complete
  localStorage.setItem(STORAGE_KEYS.MIGRATION_FLAG_V3, 'true');
}
