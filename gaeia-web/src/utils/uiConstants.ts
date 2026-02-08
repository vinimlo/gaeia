/**
 * Shared UI constants for nivel labels, colors, and icon paths
 */

export const NIVEL_LABELS: Record<string, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediario',
  avancado: 'Avancado',
};

/** Text-only nivel colors (used in trilhas list) */
export const NIVEL_COLORS_TEXT: Record<string, string> = {
  iniciante: 'text-complete-pulse',
  intermediario: 'text-axon-amber',
  avancado: 'text-alarm-red',
};

/** Text + bg nivel colors (used in trilha detail) */
export const NIVEL_COLORS_BADGE: Record<string, string> = {
  iniciante: 'text-complete-pulse bg-complete-pulse/20',
  intermediario: 'text-axon-amber bg-axon-amber/20',
  avancado: 'text-alarm-red bg-alarm-red/20',
};

/** Text + bg/10 nivel colors (used in topics index) */
export const NIVEL_COLORS_SUBTLE: Record<string, string> = {
  iniciante: 'text-complete-pulse bg-complete-pulse/10',
  intermediario: 'text-axon-amber bg-axon-amber/10',
  avancado: 'text-alarm-red bg-alarm-red/10',
};

/** Text + bg + border nivel colors (used in topic detail pages) */
export const NIVEL_COLORS_PILL: Record<string, string> = {
  iniciante: 'text-complete-pulse bg-complete-pulse/15 border border-complete-pulse/30',
  intermediario: 'text-axon-amber bg-axon-amber/15 border border-axon-amber/30',
  avancado: 'text-alarm-red bg-alarm-red/15 border border-alarm-red/30',
};

/** Badge rarity display names */
export const RARITY_NAMES: Record<string, string> = {
  common: 'Comum',
  rare: 'Raro',
  epic: 'Epico',
  legendary: 'Lendario',
};

/** Badge rarity color classes */
export const RARITY_COLORS = {
  common: { text: 'text-dim', bg: 'bg-star-dust/30', border: 'border-dim/50', glow: '' },
  rare: { text: 'text-synapse-cyan', bg: 'bg-synapse-cyan/10', border: 'border-synapse-cyan/50', glow: 'shadow-glow-cyan' },
  epic: { text: 'text-dendrite-violet', bg: 'bg-dendrite-violet/10', border: 'border-dendrite-violet/50', glow: 'shadow-glow-violet' },
  legendary: { text: 'text-axon-amber', bg: 'bg-axon-amber/10', border: 'border-axon-amber/50', glow: 'shadow-glow-amber' },
} as const;

/** SVG path data for trilha icons */
export const TRILHA_ICON_PATHS: Record<string, string> = {
  brain: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  rocket: 'M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
  cpu: 'M9 3v2m6-2v2M9 19v2m6-2v2M3 9h2m-2 6h2m14-6h2m-2 6h2M13 13a2 2 0 11-4 0 2 2 0 014 0zm-2-6V5m0 14v-2m-6-6h2m14 0h-2',
};
