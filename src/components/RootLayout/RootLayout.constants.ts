/** The site's main pages, shown in the top bar, or in its menu on small screens. */
export const NAV_LINKS = [
  { to: '/iron-kingdoms-fmf/{-$characterId}', label: 'Iron Kingdoms' },
  { to: '/fabula-ultima/{-$characterId}', label: 'Fabula Ultima' },
  { to: '/about', label: 'About' },
] as const;
