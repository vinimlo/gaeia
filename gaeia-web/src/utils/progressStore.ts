/**
 * Client-side progress storage utilities
 * Uses localStorage to track streaks, activity, and topic progress
 *
 * This file is designed to be used in client-side scripts only.
 */

import { STORAGE_KEYS } from './storageKeys';

// Type definitions
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  activityDates: string[];
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
    const stored = localStorage.getItem(STORAGE_KEYS.ACTIVITY_DATES);
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
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_DATES, JSON.stringify(dates));
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

