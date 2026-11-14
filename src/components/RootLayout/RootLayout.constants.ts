import type { IconName } from '@/components/Icon';

/** The character sheet pages, listed in the top bar's sheets menu. */
export const SHEET_LINKS: readonly { to: string; label: string; icon: IconName }[] = [
  { to: '/iron-kingdoms-fmf/{-$characterId}', label: 'Iron Kingdoms', icon: 'swords' },
  { to: '/fabula-ultima/{-$characterId}', label: 'Fabula Ultima', icon: 'wand_stars' },
] as const;
