/**
 * Parse markdown checklists into structured data
 */

import { CHECKBOX_PATTERN } from './constants';
import type { ChecklistItem } from '../types/trilhas';

export type { ChecklistItem };

export interface ChecklistStats {
  total: number;
  completed: number;
  percentage: number;
}

/**
 * Parse a markdown string and extract checklist items
 * Supports nested checklists with indentation
 */
export function parseChecklist(markdown: string): ChecklistItem[] {
  const lines = markdown.split('\n');
  const items: ChecklistItem[] = [];

  for (const line of lines) {
    const match = line.match(CHECKBOX_PATTERN);
    if (match) {
      const [, indent, checkChar, text] = match;
      items.push({
        text: text.trim(),
        checked: checkChar.toLowerCase() === 'x',
        indent: Math.floor(indent.length / 2) // Convert spaces to indent level
      });
    }
  }

  return items;
}

/**
 * Calculate statistics from a checklist
 */
export function calculateChecklistStats(items: ChecklistItem[]): ChecklistStats {
  const total = items.length;
  const completed = items.filter(item => item.checked).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percentage };
}

