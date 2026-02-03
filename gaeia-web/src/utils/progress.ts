/**
 * Progress calculation utilities for the GAEIA learning platform
 */

import { parseChecklist, calculateChecklistStats, type ChecklistStats } from './checklist';

export interface BlockProgress {
  blockNumber: number;
  title: string;
  status: 'locked' | 'pending' | 'in_progress' | 'completed';
  progress: number;
  checklistStats?: ChecklistStats;
}

export interface OverallProgress {
  totalBlocks: number;
  completedBlocks: number;
  inProgressBlocks: number;
  overallPercentage: number;
  blocks: BlockProgress[];
}

/**
 * Determine block status based on progress percentage
 */
export function getBlockStatus(
  progress: number,
  isUnlocked: boolean = true
): 'locked' | 'pending' | 'in_progress' | 'completed' {
  if (!isUnlocked) return 'locked';
  if (progress >= 100) return 'completed';
  if (progress > 0) return 'in_progress';
  return 'pending';
}

/**
 * Calculate progress for a single block from its markdown content
 */
export function calculateBlockProgress(
  markdown: string,
  blockNumber: number,
  title: string,
  previousBlockCompleted: boolean = true
): BlockProgress {
  const checklistStats = calculateChecklistStats(parseChecklist(markdown));
  const progress = checklistStats.percentage;

  // First block is always unlocked, others require previous completion
  const isUnlocked = blockNumber === 1 || previousBlockCompleted;

  return {
    blockNumber,
    title,
    status: getBlockStatus(progress, isUnlocked),
    progress,
    checklistStats
  };
}

/**
 * Calculate overall progress across all blocks
 */
export function calculateOverallProgress(blocks: BlockProgress[]): OverallProgress {
  const totalBlocks = blocks.length;
  const completedBlocks = blocks.filter(b => b.status === 'completed').length;
  const inProgressBlocks = blocks.filter(b => b.status === 'in_progress').length;

  // Overall percentage: weighted by block progress
  const totalProgress = blocks.reduce((sum, block) => {
    if (block.status === 'locked') return sum;
    return sum + block.progress;
  }, 0);

  const unlockedBlocks = blocks.filter(b => b.status !== 'locked').length;
  const overallPercentage = unlockedBlocks > 0
    ? Math.round(totalProgress / (unlockedBlocks * 100) * 100)
    : 0;

  return {
    totalBlocks,
    completedBlocks,
    inProgressBlocks,
    overallPercentage,
    blocks
  };
}

/**
 * Get next recommended block to study
 */
export function getNextBlock(blocks: BlockProgress[]): BlockProgress | null {
  // First, return any in-progress block
  const inProgress = blocks.find(b => b.status === 'in_progress');
  if (inProgress) return inProgress;

  // Then, return the first pending block
  const pending = blocks.find(b => b.status === 'pending');
  if (pending) return pending;

  // All completed or locked
  return null;
}

/**
 * Calculate streak information from activity dates
 */
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | undefined;
  weekActivity: boolean[];
}

export function calculateStreak(activityDates: string[]): StreakInfo {
  if (activityDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: undefined,
      weekActivity: new Array(7).fill(false)
    };
  }

  // Sort dates in descending order
  const sortedDates = [...activityDates]
    .map(d => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActive = sortedDates[0];
  lastActive.setHours(0, 0, 0, 0);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date(today);

  // If last activity was today, start counting from today
  // If it was yesterday, start from yesterday
  const daysSinceLastActive = Math.floor(
    (today.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastActive <= 1) {
    // Streak is still active
    const dateSet = new Set(activityDates.map(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.toISOString().split('T')[0];
    }));

    while (dateSet.has(checkDate.toISOString().split('T')[0])) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = Math.floor(
      (sortedDates[i - 1].getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diff === 1) {
      tempStreak++;
    } else {
      longestStreak = Math.max(longestStreak, tempStreak);
      tempStreak = 1;
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak, currentStreak);

  // Calculate week activity
  const weekActivity: boolean[] = [];
  const dateSet = new Set(activityDates.map(d => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split('T')[0];
  }));

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    weekActivity.push(dateSet.has(date.toISOString().split('T')[0]));
  }

  return {
    currentStreak,
    longestStreak,
    lastActiveDate: lastActive.toISOString().split('T')[0],
    weekActivity
  };
}
