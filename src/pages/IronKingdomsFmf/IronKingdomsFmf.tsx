import { CharacterWorkspace } from '@/components/CharacterWorkspace';
import { useSheetRoute } from '@/hooks/useSheetRoute';
import { ironKingdomsFmf } from './utils/ironKingdomsFmf';
import './IronKingdomsFmf.styles.css';

export function IronKingdomsFmf() {
  const location = useSheetRoute();

  return (
    <div className="iron-kingdoms-fmf-page">
      <CharacterWorkspace system={ironKingdomsFmf} location={location} />
    </div>
  );
}
