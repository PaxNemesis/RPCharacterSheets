import { CheckTrack } from '@/components/CheckTrack';
import { Panel } from '@/components/Panel';
import { useSheet } from '@/components/SheetProvider';
import { GROWTH_CLOCK_SIZE, MAGISEEDS } from '../../constants/floralist';
import { useFuCharacter } from '../../hooks/useFuCharacter';
import { skillLevel } from '../../utils/rules';
import { MagiseedCard } from './components';
import './GardenSection.styles.css';

/** The Floralist's magiseeds, garden and Growth Clock (NF pp. 139–147). */
export function GardenSection() {
  const { character, derived } = useFuCharacter();
  const { set } = useSheet();
  const { floralist } = character;
  const chloromancy = skillLevel(character, 'Floralist', 'Chloromancy');
  const discovered = MAGISEEDS.filter((seed) => floralist.discovered.includes(seed.name));
  const undiscovered = MAGISEEDS.filter((seed) => !floralist.discovered.includes(seed.name));

  const clearGarden = () => {
    set('floralist.garden', '');
    set('floralist.growth', 0);
  };
  // A new magiseed starts with an empty Growth Clock.
  const plant = (name: string) => {
    set('floralist.garden', name);
    set('floralist.growth', 0);
  };
  const forget = (name: string) => {
    set(
      'floralist.discovered',
      floralist.discovered.filter((other) => other !== name),
    );
    if (floralist.garden === name) clearGarden();
  };

  return (
    <div className="fu-section garden-section-container">
      <Panel
        title="Garden"
        actions={
          <button
            type="button"
            onClick={clearGarden}
            title="Empty the garden and the Growth Clock, as at the end of a scene"
          >
            Clear garden
          </button>
        }
      >
        <div className="garden-section-garden">
          <div className="garden-section-planted-seed">
            <span className="garden-section-label">In the garden</span>
            {/* Only a discovered magiseed counts, in case a file names another. */}
            <strong>{discovered.find((seed) => seed.name === floralist.garden)?.name ?? 'Empty'}</strong>
          </div>
          <div className="garden-section-clock">
            <span className="garden-section-label">Growth Clock</span>
            <CheckTrack path="floralist.growth" size={GROWTH_CLOCK_SIZE} label="Growth Clock" />
          </div>
        </div>
        {floralist.growth >= GROWTH_CLOCK_SIZE && (
          <p className="fu-warning">The clock is full: the magiseed leaves the garden and the clock is erased.</p>
        )}
        <p className="fu-note">
          One magiseed at a time. Fill a section at the end of each of your turns while a magiseed is planted; its
          effect depends on the filled sections. The garden empties at the end of each scene (NF p. 140).
          {derived.level >= 30 && ' At level 30 or higher, magiseed damage is +5 and HP or MP loss or recovery +10.'}
        </p>
      </Panel>
      <Panel
        title="Magiseeds"
        actions={
          undiscovered.length > 0 && (
            <select
              aria-label="Discover a magiseed"
              value=""
              onChange={(event) =>
                event.target.value && set('floralist.discovered', [...floralist.discovered, event.target.value])
              }
            >
              <option value="">Discover magiseed…</option>
              {undiscovered.map((seed) => (
                <option key={seed.name} value={seed.name}>
                  {seed.name}
                </option>
              ))}
            </select>
          )
        }
      >
        <p className={discovered.length > chloromancy ? 'fu-warning' : 'fu-note'}>
          Discovered {discovered.length} of {chloromancy}: each level of Chloromancy discovers one magiseed (NF p. 139).
        </p>
        {discovered.length > 0 && (
          <div className="garden-section-grid">
            {discovered.map((seed) => (
              <MagiseedCard
                key={seed.name}
                seed={seed}
                planted={floralist.garden === seed.name}
                onPlant={() => plant(seed.name)}
                onForget={() => forget(seed.name)}
              />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
