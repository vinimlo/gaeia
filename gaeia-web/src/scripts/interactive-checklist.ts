/**
 * Interactive Checklist Client-Side Logic
 * Handles checkbox toggling with optimistic UI updates and API sync
 * Also hydrates inline checklist containers from markdown
 */

import { recordActivity, updateTopicoChecklist, getTopicoProgress } from '../utils/progressStore';

export interface ChecklistConfig {
  container: HTMLElement;
  blockSlug: string | null;
}

export interface ChecklistItem {
  text: string;
  checked: boolean;
  indent: number;
}

/**
 * Update counter display in a checklist container
 */
function updateCounter(container: Element): void {
  const items = container.querySelectorAll('.checklist-item');
  const counterEl = container.querySelector('.completed-count');
  const progressEl = container.querySelector('.checklist-progress');
  const progressFillEl = container.querySelector('.checklist-progress-fill') as HTMLElement | null;

  const checkedCount = container.querySelectorAll('.checklist-item[data-checked="true"]').length;
  const total = items.length;
  const progress = total > 0 ? Math.round((checkedCount / total) * 100) : 0;

  if (counterEl) counterEl.textContent = String(checkedCount);
  if (progressEl) progressEl.textContent = `${progress}%`;
  if (progressFillEl) progressFillEl.style.width = `${progress}%`;
}

/**
 * Show error toast with message
 */
function showError(container: Element, message: string): void {
  const errorToast = container.querySelector('.error-toast');
  const errorMessage = container.querySelector('.error-message');

  if (errorToast && errorMessage) {
    errorMessage.textContent = message;
    errorToast.classList.add('show');
    setTimeout(() => errorToast.classList.remove('show'), 3000);
  }
}

/**
 * Apply visual state to a checklist item
 */
function applyItemState(item: Element, checked: boolean): void {
  const checkbox = item.querySelector('.checkbox-indicator');
  const checkIcon = item.querySelector('.check-icon');
  const itemText = item.querySelector('.item-text');
  const statusIcon = item.querySelector('.status-icon');

  item.setAttribute('data-checked', String(checked));

  if (checked) {
    item.classList.add('is-checked');
    item.classList.remove('bg-star-dust/30', 'hover:bg-star-dust/50');
    item.classList.add('bg-complete-pulse/10');
    checkbox?.classList.remove('bg-star-dust', 'border', 'border-dormant');
    checkbox?.classList.add('bg-complete-pulse', 'text-void');
    if (checkIcon) (checkIcon as HTMLElement).style.opacity = '1';
    itemText?.classList.remove('text-bright');
    itemText?.classList.add('text-dim', 'line-through');
    if (statusIcon) (statusIcon as HTMLElement).style.opacity = '1';
  } else {
    item.classList.remove('is-checked');
    item.classList.add('bg-star-dust/30', 'hover:bg-star-dust/50');
    item.classList.remove('bg-complete-pulse/10');
    checkbox?.classList.add('bg-star-dust', 'border', 'border-dormant');
    checkbox?.classList.remove('bg-complete-pulse', 'text-void');
    if (checkIcon) (checkIcon as HTMLElement).style.opacity = '0';
    itemText?.classList.add('text-bright');
    itemText?.classList.remove('text-dim', 'line-through');
    if (statusIcon) (statusIcon as HTMLElement).style.opacity = '0';
  }
}

/**
 * Toggle checkbox state with API sync
 */
async function toggleCheckbox(
  container: Element,
  item: Element,
  index: number,
  blockSlug: string | null
): Promise<void> {
  const isChecked = item.getAttribute('data-checked') === 'true';
  const newChecked = !isChecked;

  // Optimistic UI update
  const statusIcon = item.querySelector('.status-icon');
  const spinner = item.querySelector('.loading-spinner');

  item.classList.add('is-syncing');
  if (spinner) spinner.classList.remove('hidden');
  if (statusIcon) (statusIcon as HTMLElement).style.opacity = '0';

  // Apply new visual state
  applyItemState(item, newChecked);
  updateCounter(container);

  try {
    const MODE = import.meta.env.PUBLIC_MODE || 'hybrid';

    if (MODE === 'hybrid') {
      // Modo local: tentar API primeiro
      const response = await fetch(`/api/progress/${blockSlug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemIndex: index, checked: newChecked }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Sync failed');
      }
    } else {
      // Modo static: salvar diretamente no localStorage
      const progress = getTopicoProgress(blockSlug || '') || { checklist: [] as boolean[], completo: false };
      const checklist = [...progress.checklist];

      while (checklist.length <= index) {
        checklist.push(false);
      }
      checklist[index] = newChecked;

      updateTopicoChecklist(blockSlug || '', checklist);
    }

    // Registrar atividade para streaks (ambos os modos)
    if (newChecked) {
      recordActivity();
    }

    // Disparar evento para outros componentes
    window.dispatchEvent(new CustomEvent('progress-updated', {
      detail: { blockSlug, itemIndex: index, checked: newChecked }
    }));

    // Mostrar estado de sucesso
    if (newChecked && statusIcon) {
      (statusIcon as HTMLElement).style.opacity = '1';
    }
  } catch (error) {
    // Reverter atualização otimista em caso de erro
    applyItemState(item, isChecked);
    updateCounter(container);
    showError(container, error instanceof Error ? error.message : 'Erro ao salvar');
  } finally {
    item.classList.remove('is-syncing');
    if (spinner) spinner.classList.add('hidden');
  }
}

/**
 * Initialize a single interactive checklist
 */
function initializeChecklist(checklist: Element): void {
  const isInteractive = checklist.getAttribute('data-interactive') === 'true';
  if (!isInteractive) return;

  // Guard against duplicate initialization
  if (checklist.getAttribute('data-initialized') === 'true') return;
  checklist.setAttribute('data-initialized', 'true');

  const blockSlug = checklist.getAttribute('data-block-slug');
  const items = checklist.querySelectorAll('.checklist-item');

  items.forEach((item, index) => {
    // Click handler
    item.addEventListener('click', () => toggleCheckbox(checklist, item, index, blockSlug));

    // Keyboard support
    const checkbox = item.querySelector('.checkbox-indicator');
    checkbox?.addEventListener('keydown', (e) => {
      if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
        e.preventDefault();
        toggleCheckbox(checklist, item, index, blockSlug);
      }
    });
  });
}

/**
 * Initialize all interactive checklists on the page
 */
export function initializeAllChecklists(): void {
  document.querySelectorAll('.interactive-checklist').forEach(initializeChecklist);
}

/**
 * Render an interactive checklist into a container
 */
function renderInlineChecklist(
  container: Element,
  items: ChecklistItem[],
  blockSlug: string
): void {
  const completed = items.filter((i) => i.checked).length;
  const total = items.length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const html = `
    <div class="interactive-checklist checklist-card my-6" data-block-slug="${blockSlug}" data-interactive="true">
      <!-- Header -->
      <div class="checklist-header">
        <div class="flex items-center gap-3">
          <div class="checklist-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h4 class="checklist-title">Checklist de Progresso</h4>
            <p class="checklist-subtitle">${total} itens para completar</p>
          </div>
        </div>
        <div class="checklist-stats">
          <span class="completed-count">${completed}</span>
          <span class="stats-separator">/</span>
          <span class="total-count">${total}</span>
        </div>
      </div>

      <!-- Progress Bar -->
      <div class="checklist-progress-wrapper">
        <div class="checklist-progress-bar">
          <div class="checklist-progress-fill" style="width: ${progress}%"></div>
        </div>
        <span class="checklist-progress-text checklist-progress">${progress}%</span>
      </div>

      <!-- Items -->
      <ul class="checklist-items" role="list">
        ${items
          .map(
            (item, index) => `
          <li class="checklist-item ${item.checked ? 'is-checked' : ''}"
              data-index="${index}"
              data-checked="${item.checked}">
            <span class="checkbox-indicator" role="checkbox" aria-checked="${item.checked}" tabindex="0">
              <svg class="check-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span class="item-text">${item.text}</span>
            <span class="status-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <span class="loading-spinner hidden">
              <svg class="animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
          </li>
        `
          )
          .join('')}
      </ul>
    </div>
  `;

  container.innerHTML = html;

  // Initialize event listeners on the newly rendered checklist
  const checklist = container.querySelector('.interactive-checklist');
  if (checklist) {
    initializeChecklist(checklist);
  }
}

/**
 * Initialize inline checklist containers from markdown
 */
function initializeInlineChecklists(): void {
  const containers = document.querySelectorAll('.inline-checklist-container');

  containers.forEach((container) => {
    const itemsJson = container.getAttribute('data-checklist-items');
    if (!itemsJson) return;

    try {
      const items: ChecklistItem[] = JSON.parse(itemsJson);

      // Get blockSlug from the page context (data-topico-progress attribute)
      // Check closest ancestor first, then fall back to document-level search
      const pageContainer = container.closest('[data-topico-progress]')
        || document.querySelector('[data-topico-progress]');
      const blockSlug = pageContainer?.getAttribute('data-topico-progress') || '';

      // Merge saved progress from localStorage before rendering
      const savedProgress = getTopicoProgress(blockSlug);
      if (savedProgress && savedProgress.checklist.length > 0) {
        items.forEach((item, index) => {
          if (index < savedProgress.checklist.length) {
            item.checked = savedProgress.checklist[index];
          }
        });
      }

      // Render the interactive checklist
      renderInlineChecklist(container, items, blockSlug);
    } catch (e) {
      console.error('Failed to parse checklist items:', e);
    }
  });
}

/**
 * Initialize all checklists (both pre-rendered and inline containers)
 */
function initializeAll(): void {
  initializeInlineChecklists();
  initializeAllChecklists();
}

// Auto-initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
  } else {
    initializeAll();
  }
}
