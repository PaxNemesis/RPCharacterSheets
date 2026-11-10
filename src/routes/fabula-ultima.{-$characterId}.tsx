import { createFileRoute } from '@tanstack/react-router';
import { validateSheetSearch } from '@/utils/sheetSearch';
import { FabulaUltima } from '@/pages/FabulaUltima';

export const Route = createFileRoute('/fabula-ultima/{-$characterId}')({
  validateSearch: validateSheetSearch,
  component: FabulaUltima,
});
