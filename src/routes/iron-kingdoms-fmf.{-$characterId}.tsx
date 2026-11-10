import { createFileRoute } from '@tanstack/react-router';
import { validateSheetSearch } from '@/utils/sheetSearch';
import { IronKingdomsFmf } from '@/pages/IronKingdomsFmf';

export const Route = createFileRoute('/iron-kingdoms-fmf/{-$characterId}')({
  validateSearch: validateSheetSearch,
  component: IronKingdomsFmf,
});
