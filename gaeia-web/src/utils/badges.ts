/**
 * Badge system for GAEIA gamification
 */

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedDate?: string;
  criteria: BadgeCriteria;
}

export interface BadgeCriteria {
  type: 'block_complete' | 'blocks_complete' | 'streak' | 'progress' | 'special';
  value?: number;
  blockNumber?: number;
  unitSlug?: string;
  courseId?: string;
}

/**
 * Badge definitions
 */
export const BADGE_DEFINITIONS: Omit<Badge, 'earned' | 'earnedDate'>[] = [
  // Block completion badges
  {
    id: 'first-steps',
    name: 'Primeiros Passos',
    description: 'Complete o primeiro bloco de estudos',
    icon: '👣',
    rarity: 'common',
    criteria: { type: 'block_complete', blockNumber: 1 }
  },
  {
    id: 'python-master',
    name: 'Mestre Python',
    description: 'Complete o bloco de Python & ML',
    icon: '🐍',
    rarity: 'common',
    criteria: { type: 'block_complete', blockNumber: 2 }
  },
  {
    id: 'deep-diver',
    name: 'Mergulho Profundo',
    description: 'Complete o bloco de Deep Learning',
    icon: '🧠',
    rarity: 'rare',
    criteria: { type: 'block_complete', blockNumber: 3 }
  },
  {
    id: 'word-wizard',
    name: 'Mago das Palavras',
    description: 'Complete o bloco de NLP',
    icon: '📚',
    rarity: 'rare',
    criteria: { type: 'block_complete', blockNumber: 4 }
  },
  {
    id: 'eagle-eye',
    name: 'Olho de Aguia',
    description: 'Complete o bloco de Computer Vision',
    icon: '👁️',
    rarity: 'rare',
    criteria: { type: 'block_complete', blockNumber: 5 }
  },
  {
    id: 'ops-guru',
    name: 'Guru de Operacoes',
    description: 'Complete o bloco de MLOps',
    icon: '⚙️',
    rarity: 'epic',
    criteria: { type: 'block_complete', blockNumber: 6 }
  },
  {
    id: 'generator',
    name: 'Gerador de Conteudo',
    description: 'Complete o bloco de GenAI',
    icon: '✨',
    rarity: 'epic',
    criteria: { type: 'block_complete', blockNumber: 7 }
  },
  {
    id: 'agent-smith',
    name: 'Agente Smith',
    description: 'Complete o bloco de Agents',
    icon: '🤖',
    rarity: 'epic',
    criteria: { type: 'block_complete', blockNumber: 8 }
  },
  {
    id: 'ai-engineer',
    name: 'Engenheiro de IA',
    description: 'Complete o projeto final',
    icon: '🎓',
    rarity: 'legendary',
    criteria: { type: 'block_complete', blockNumber: 9 }
  },

  // Milestone badges
  {
    id: 'halfway-there',
    name: 'Meio Caminho',
    description: 'Complete 50% do curso',
    icon: '🏃',
    rarity: 'rare',
    criteria: { type: 'progress', value: 50 }
  },
  {
    id: 'almost-there',
    name: 'Quase La',
    description: 'Complete 90% do curso',
    icon: '🏁',
    rarity: 'epic',
    criteria: { type: 'progress', value: 90 }
  },
  {
    id: 'completionist',
    name: 'Completista',
    description: 'Complete 100% do curso',
    icon: '🏆',
    rarity: 'legendary',
    criteria: { type: 'progress', value: 100 }
  },

  // Streak badges
  {
    id: 'consistent',
    name: 'Consistente',
    description: 'Mantenha uma sequencia de 7 dias',
    icon: '🔥',
    rarity: 'common',
    criteria: { type: 'streak', value: 7 }
  },
  {
    id: 'dedicated',
    name: 'Dedicado',
    description: 'Mantenha uma sequencia de 30 dias',
    icon: '💪',
    rarity: 'rare',
    criteria: { type: 'streak', value: 30 }
  },
  {
    id: 'unstoppable',
    name: 'Imparavel',
    description: 'Mantenha uma sequencia de 100 dias',
    icon: '⚡',
    rarity: 'legendary',
    criteria: { type: 'streak', value: 100 }
  },

  // Multi-block badges
  {
    id: 'triple-threat',
    name: 'Tripla Ameaca',
    description: 'Complete 3 blocos',
    icon: '🎯',
    rarity: 'common',
    criteria: { type: 'blocks_complete', value: 3 }
  },
  {
    id: 'six-pack',
    name: 'Seis em Sequencia',
    description: 'Complete 6 blocos',
    icon: '💎',
    rarity: 'rare',
    criteria: { type: 'blocks_complete', value: 6 }
  },
  {
    id: 'full-stack-ai',
    name: 'Full Stack AI',
    description: 'Complete todos os 9 blocos',
    icon: '👑',
    rarity: 'legendary',
    criteria: { type: 'blocks_complete', value: 9 }
  }
];

/**
 * Calculate earned badges based on current progress
 * Badge earning not yet implemented for topic-based system
 */
export function calculateEarnedBadges(
  earnedDates: Record<string, string> = {}
): Badge[] {
  return BADGE_DEFINITIONS.map(def => ({
    ...def,
    earned: false,
    earnedDate: earnedDates[def.id] || undefined
  }));
}

/**
 * Get badges grouped by rarity
 */
export function getBadgesByRarity(badges: Badge[]): Record<Badge['rarity'], Badge[]> {
  return {
    common: badges.filter(b => b.rarity === 'common'),
    rare: badges.filter(b => b.rarity === 'rare'),
    epic: badges.filter(b => b.rarity === 'epic'),
    legendary: badges.filter(b => b.rarity === 'legendary')
  };
}

/**
 * Calculate badge statistics
 */
export interface BadgeStats {
  total: number;
  earned: number;
  percentage: number;
  byRarity: Record<Badge['rarity'], { earned: number; total: number }>;
}

export function calculateBadgeStats(badges: Badge[]): BadgeStats {
  const total = badges.length;
  const earned = badges.filter(b => b.earned).length;

  const byRarity: BadgeStats['byRarity'] = {
    common: { earned: 0, total: 0 },
    rare: { earned: 0, total: 0 },
    epic: { earned: 0, total: 0 },
    legendary: { earned: 0, total: 0 }
  };

  for (const badge of badges) {
    byRarity[badge.rarity].total++;
    if (badge.earned) {
      byRarity[badge.rarity].earned++;
    }
  }

  return {
    total,
    earned,
    percentage: total > 0 ? Math.round((earned / total) * 100) : 0,
    byRarity
  };
}
