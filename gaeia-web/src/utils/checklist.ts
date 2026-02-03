/**
 * Parse markdown checklists into structured data
 */

import { CHECKBOX_PATTERN, HEADER_PATTERN } from './constants';

export interface ChecklistItem {
  text: string;
  checked: boolean;
  indent: number;
}

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

/**
 * Parse multiple checklists from markdown content
 * Returns a map of section headers to their checklist items
 */
export function parseChecklistSections(markdown: string): Map<string, ChecklistItem[]> {
  const sections = new Map<string, ChecklistItem[]>();
  const lines = markdown.split('\n');

  let currentSection = 'default';
  let currentItems: ChecklistItem[] = [];

  for (const line of lines) {
    const headerMatch = line.match(HEADER_PATTERN);
    if (headerMatch) {
      // Save previous section
      if (currentItems.length > 0) {
        sections.set(currentSection, currentItems);
      }
      currentSection = headerMatch[2].trim();
      currentItems = [];
      continue;
    }

    const checkboxMatch = line.match(CHECKBOX_PATTERN);
    if (checkboxMatch) {
      const [, indent, checkChar, text] = checkboxMatch;
      currentItems.push({
        text: text.trim(),
        checked: checkChar.toLowerCase() === 'x',
        indent: Math.floor(indent.length / 2)
      });
    }
  }

  // Save last section
  if (currentItems.length > 0) {
    sections.set(currentSection, currentItems);
  }

  return sections;
}

/**
 * Convert checklist items back to markdown format
 */
export function checklistToMarkdown(items: ChecklistItem[]): string {
  return items
    .map(item => {
      const indent = '  '.repeat(item.indent);
      const checkbox = item.checked ? '[x]' : '[ ]';
      return `${indent}- ${checkbox} ${item.text}`;
    })
    .join('\n');
}

/**
 * Extract all checklists from a markdown file content
 * and return combined stats
 */
export function getOverallChecklistProgress(markdown: string): ChecklistStats {
  const items = parseChecklist(markdown);
  return calculateChecklistStats(items);
}
