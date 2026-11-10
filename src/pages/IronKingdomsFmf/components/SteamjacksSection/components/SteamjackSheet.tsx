import { useMemo } from 'react';
import { ImageField } from '@/components/ImageField';
import { Panel } from '@/components/Panel';
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable';
import { useSheet } from '@/components/SheetProvider';
import type { IkSettings, IkSteamjack, StatKey } from '../../../types';
import {
  createMeleeWeapon,
  createRangedWeapon,
  meleeWeaponColumns,
  rangedWeaponColumns,
} from '../../../utils/weaponColumns';
import { jackCombat } from '../utils/jackCombat';
import { jackMeleePresets, jackRangedPresets } from '../utils/jackWeaponPresets';
import { JackCombatPanel } from './JackCombatPanel';
import { JackCortexPanel } from './JackCortexPanel';
import { JackDamageGrid } from './JackDamageGrid';
import { JackIdentityPanel } from './JackIdentityPanel';
import { JackSilhouette } from './JackSilhouette';
import { JackStatsPanel } from './JackStatsPanel';

const CATASTROPHIC_COLUMNS: RepeatTableColumn[] = [
  { key: 'area', label: 'Area damaged', width: 'minmax(140px, 1fr)' },
  { key: 'notes', label: 'Description / notes', width: 'minmax(200px, 3fr)', rows: 2 },
];
const GEAR_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Name', width: 'minmax(140px, 1fr)' },
  { key: 'notes', label: 'Description / notes', width: 'minmax(200px, 3fr)', rows: 2 },
];
const POWER_ATTACK_COLUMNS: RepeatTableColumn[] = [
  { key: 'name', label: 'Name', width: 'minmax(140px, 1fr)' },
  { key: 'description', label: 'Requirement / roll / effect', width: 'minmax(200px, 3fr)', rows: 2 },
];

type SteamjackSheetProps = {
  /** Which books' chassis and weapons to offer. */
  settings: IkSettings;
};

/** One steamjack; rendered inside a SheetProvider scoped to `steamjacks.<index>`. */
export function SteamjackSheet({ settings }: SteamjackSheetProps) {
  const { get } = useSheet();
  const jack = get('') as IkSteamjack;
  const combat = jackCombat(jack);
  const { stats, size, chassis } = jack;
  const { mat, rat } = combat;

  const columns = useMemo(() => {
    const stat = (key: StatKey) => (key === 'arc' ? null : (stats[key] ?? null));
    // Weapon suggestions depend on the books in use and the jack's size and chassis.
    const jackType = { size, chassis };
    return {
      ranged: rangedWeaponColumns(stat, { jackAttack: rat, presets: jackRangedPresets(settings, jackType) }),
      melee: meleeWeaponColumns(stat, { jackAttack: mat, presets: jackMeleePresets(settings, jackType) }),
    };
  }, [stats, settings, size, chassis, mat, rat]);

  return (
    <div className="ik-section">
      <JackIdentityPanel jack={jack} settings={settings} />
      <div className="ik-columns">
        <Panel title="Image">
          <ImageField path="image" label="Steamjack image" placeholder={<JackSilhouette size={size} />} />
        </Panel>
        <JackStatsPanel />
      </div>
      <JackCombatPanel jack={jack} combat={combat} />
      <div className="ik-columns">
        <JackDamageGrid />
        <JackCortexPanel jack={jack} />
      </div>
      <Panel title="Ranged weapons">
        <p className="ik-note">
          RAT = the jack&apos;s RAT + bonus + mod. Pick a weapon from the books by name to fill in its values for this
          jack&apos;s size.
        </p>
        <RepeatTable
          path="rangedWeapons"
          columns={columns.ranged}
          createRow={createRangedWeapon}
          itemName="ranged weapon"
        />
      </Panel>
      <Panel title="Melee weapons">
        <p className="ik-note">
          MAT = the jack&apos;s MAT + bonus + mod. P+S = POW + STR. Pick a weapon from the books by name to fill in its
          values for this jack&apos;s size.
        </p>
        <RepeatTable
          path="meleeWeapons"
          columns={columns.melee}
          createRow={createMeleeWeapon}
          itemName="melee weapon"
        />
      </Panel>
      <Panel title="Catastrophic damage">
        <RepeatTable
          path="catastrophic"
          columns={CATASTROPHIC_COLUMNS}
          createRow={() => ({ area: '', notes: '' })}
          itemName="entry"
        />
      </Panel>
      <Panel title="Gear & upgrades">
        <RepeatTable
          path="gear"
          columns={GEAR_COLUMNS}
          createRow={() => ({ name: '', notes: '' })}
          itemName="upgrade"
        />
      </Panel>
      <Panel title="Power attacks & special abilities">
        <RepeatTable
          path="powerAttacks"
          columns={POWER_ATTACK_COLUMNS}
          createRow={() => ({ name: '', description: '' })}
          itemName="power attack"
        />
      </Panel>
    </div>
  );
}
