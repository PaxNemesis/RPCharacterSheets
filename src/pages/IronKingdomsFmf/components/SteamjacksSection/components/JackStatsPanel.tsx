import { NumberField } from '@/components/NumberField';
import { Panel } from '@/components/Panel';
import { ASPECTS, STAT_LABELS } from '../../../constants/stats';
import { StatAspect } from '../../StatAspect';

/**
 * The jack's eight stats, grouped by aspect as on the character sheet. Steamjacks have no ARC, so its
 * place in Intellect is left empty to keep the columns lined up.
 */
export function JackStatsPanel() {
  return (
    <Panel title="Stats">
      {ASPECTS.map((aspect) => (
        <StatAspect key={aspect.key} label={aspect.label} color={aspect.color}>
          {[aspect.primary, ...aspect.secondary].map((key) =>
            key === 'arc' ? (
              <span key={key} />
            ) : (
              <NumberField key={key} path={`stats.${key}`} label={STAT_LABELS[key]} size="lg" />
            ),
          )}
        </StatAspect>
      ))}
    </Panel>
  );
}
