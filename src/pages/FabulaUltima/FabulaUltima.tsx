import { CharacterWorkspace } from '@/components/CharacterWorkspace';
import { useSheetRoute } from '@/hooks/useSheetRoute';
import { fabulaUltima } from './utils/fabulaUltima';
import './FabulaUltima.styles.css';

export function FabulaUltima() {
  const location = useSheetRoute();

  return (
    <div className="fabula-ultima-page">
      <CharacterWorkspace system={fabulaUltima} location={location} />
    </div>
  );
}
