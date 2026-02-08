/**
 * Unified Progress Hydrator
 * Hydrates all progress displays (bars, rings, status indicators) from localStorage.
 * Runs on DOMContentLoaded and listens for 'progress-updated' events.
 */

import {
  calculateTopicoProgressPercent,
  calculateTrilhaProgress,
  getCompletedTopicosCount,
  isTopicoComplete,
} from '../utils/progressStore';

/**
 * Hydrate topic progress bars ([data-topico-progress] elements).
 * Updates the ProgressBar width, aria-valuenow, and percentage text.
 */
function hydrateTopicoProgress(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-topico-progress]');

  elements.forEach((el) => {
    const topicoId = el.getAttribute('data-topico-progress');
    if (!topicoId) return;

    const pct = calculateTopicoProgressPercent(topicoId);

    // Update ProgressBar component
    const progressBar = el.querySelector<HTMLElement>('[role="progressbar"]');
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', String(pct));
      const fill = progressBar.querySelector<HTMLElement>(':scope > div');
      if (fill) {
        fill.style.width = `${pct}%`;
      }
    }

    // Update any percentage text inside the container
    const pctText = el.querySelector<HTMLElement>('.text-synapse-cyan');
    if (pctText && pctText.textContent?.includes('%')) {
      pctText.textContent = `${pct}%`;
    }
  });
}

/**
 * Hydrate trilha progress bars ([data-trilha-progress] elements).
 * Reads topic IDs from data-trilha-topicos and calculates completion.
 */
function hydrateTrilhaProgress(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-trilha-progress]');

  elements.forEach((el) => {
    const topicosJson = el.getAttribute('data-trilha-topicos');
    if (!topicosJson) return;

    let topicoIds: string[];
    try {
      topicoIds = JSON.parse(topicosJson);
    } catch {
      return;
    }

    const { completedCount, totalCount, percentage } = calculateTrilhaProgress(topicoIds);

    // Update ProgressBar component
    const progressBar = el.querySelector<HTMLElement>('[role="progressbar"]');
    if (progressBar) {
      progressBar.setAttribute('aria-valuenow', String(percentage));
      const fill = progressBar.querySelector<HTMLElement>(':scope > div');
      if (fill) {
        fill.style.width = `${percentage}%`;
      }
    }

    // Update text displays - look for percentage or count text
    const textElements = el.querySelectorAll<HTMLElement>('.text-synapse-cyan, .font-medium');
    textElements.forEach((textEl) => {
      const text = textEl.textContent || '';
      if (text.includes('%')) {
        textEl.textContent = `${percentage}%`;
      } else if (text.includes('/') && text.includes('topicos')) {
        textEl.textContent = `${completedCount}/${totalCount} topicos`;
      }
    });
  });
}

/**
 * Hydrate topic status indicators ([data-topico-status] elements) in trilha detail pages.
 * Replaces the number with a green checkmark if the topic is complete.
 */
function hydrateTopicoStatus(): void {
  const elements = document.querySelectorAll<HTMLElement>('[data-topico-status]');

  elements.forEach((el) => {
    const topicoId = el.getAttribute('data-topico-status');
    if (!topicoId) return;

    if (isTopicoComplete(topicoId)) {
      el.innerHTML = `
        <svg class="w-4 h-4 text-complete-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      `;
      el.classList.remove('border-star-dust/50', 'text-dim');
      el.classList.add('border-complete-pulse/50', 'bg-complete-pulse/10');
    }
  });
}

/**
 * Hydrate sidebar ProgressRing and progress text.
 * Updates the SVG stroke-dashoffset and the label text.
 */
function hydrateSidebarProgress(): void {
  const container = document.getElementById('sidebar-progress');
  if (!container) return;

  const completedCount = getCompletedTopicosCount();
  const totalTopicos = parseInt(container.getAttribute('data-total-topicos') || '0', 10);
  const pct = totalTopicos > 0 ? Math.round((completedCount / totalTopicos) * 100) : 0;

  // Update ProgressRing SVG
  const circle = container.querySelector<SVGCircleElement>('.progress-ring-circle');
  if (circle) {
    const r = parseFloat(circle.getAttribute('r') || '0');
    const circumference = r * 2 * Math.PI;
    const offset = circumference - (pct / 100) * circumference;
    circle.style.strokeDashoffset = String(offset);
  }

  // Update percentage label inside the ring
  const ringContainer = container.querySelector('.relative');
  if (ringContainer) {
    const label = ringContainer.querySelector('span');
    if (label) {
      label.textContent = `${pct}%`;
    }
  }

  // Update text below the ring
  const progressText = document.getElementById('sidebar-progress-text');
  if (progressText) {
    progressText.textContent = `${completedCount} topicos completos`;
  }
}

/**
 * Run all hydration functions
 */
function hydrateAll(): void {
  hydrateTopicoProgress();
  hydrateTrilhaProgress();
  hydrateTopicoStatus();
  hydrateSidebarProgress();
}

// Auto-initialize
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrateAll);
  } else {
    hydrateAll();
  }

  // Re-hydrate when progress changes
  window.addEventListener('progress-updated', hydrateAll);
}
