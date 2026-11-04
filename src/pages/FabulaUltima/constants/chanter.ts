import type { AttributeKey } from '../types'

/** A verse's volume: its MP cost and who it reaches (HF p. 138). */
export const VOLUMES: { name: string; mp: number; targets: string }[] = [
  { name: 'Low', mp: 10, targets: 'You or one creature' },
  { name: 'Medium', mp: 20, targets: 'Every ally' },
  { name: 'High', mp: 30, targets: 'Every enemy' },
]

export type KeyData = { name: string; type: string; status: string; attribute: AttributeKey; recovery: 'HP' | 'MP' }

/** Each key's damage type, status effect, Attribute and recovery (HF p. 138). */
export const KEYS: KeyData[] = [
  { name: 'Flame', type: 'fire', status: 'shaken', attribute: 'mig', recovery: 'HP' },
  { name: 'Frost', type: 'ice', status: 'weak', attribute: 'wlp', recovery: 'MP' },
  { name: 'Iron', type: 'physical', status: 'slow', attribute: 'wlp', recovery: 'MP' },
  { name: 'Radiance', type: 'bolt', status: 'shaken', attribute: 'dex', recovery: 'HP' },
  { name: 'Shadow', type: 'light', status: 'dazed', attribute: 'ins', recovery: 'HP' },
  { name: 'Stone', type: 'dark', status: 'weak', attribute: 'dex', recovery: 'MP' },
  { name: 'Thunder', type: 'earth', status: 'dazed', attribute: 'mig', recovery: 'HP' },
  { name: 'Wind', type: 'air', status: 'slow', attribute: 'ins', recovery: 'MP' },
]

export type KeyAspect = 'type' | 'status' | 'attribute' | 'recovery'

/** The tones, and which of the key's aspects each one uses (HF p. 139). */
export const TONES: { name: string; uses: KeyAspect[] }[] = [
  { name: 'Calm', uses: ['recovery'] },
  { name: 'Energetic', uses: ['attribute'] },
  { name: 'Frantic', uses: ['type'] },
  { name: 'Haunting', uses: ['status', 'type'] },
  { name: 'Lively', uses: ['attribute'] },
  { name: 'Menacing', uses: ['type'] },
  { name: 'Solemn', uses: ['status', 'type'] },
]
