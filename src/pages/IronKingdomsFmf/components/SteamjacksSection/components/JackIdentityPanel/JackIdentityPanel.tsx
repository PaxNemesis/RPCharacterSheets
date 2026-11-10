import { Panel } from '@/components/Panel';
import { SelectField } from '@/components/SelectField';
import { useSheet } from '@/components/SheetProvider';
import { TextField } from '@/components/TextField';
import { compareNames } from '@/utils/alphabetical';
import { bookEnabled, bookRef } from '../../../../constants/books';
import { CHASSIS, findChassis } from '../../../../constants/chassis';
import type { IkSettings, IkSteamjack } from '../../../../types';
import { chassisValues, hasDamage } from '../../utils/chassis';
import './JackIdentityPanel.styles.css';

type JackIdentityPanelProps = {
  jack: IkSteamjack;
  settings: IkSettings;
};

const SIZES = [
  { value: '', label: 'Choose…' },
  { value: 'light', label: 'Light' },
  { value: 'heavy', label: 'Heavy' },
];

/** Name, chassis, size and specs. Picking a rulebook chassis fills in its specs, stats, cortex and grid. */
export function JackIdentityPanel({ jack, settings }: JackIdentityPanelProps) {
  const { set } = useSheet();
  const available = CHASSIS.filter((chassis) => bookEnabled(settings, chassis.book));
  const known = findChassis(jack.chassis);

  const pick = (name: string) => {
    const chassis = available.find((entry) => entry.name === name);
    if (!chassis) return;
    if (
      hasDamage(jack) &&
      !window.confirm(`Use the ${chassis.name} damage grid? The damage marked now will be cleared.`)
    ) {
      // Keep the chassis name the player picked, without touching the rest.
      set('chassis', chassis.name);
      return;
    }
    set('', chassisValues(chassis, jack));
  };

  return (
    <Panel title="Steamjack" className="jack-identity-panel-container">
      <div className="jack-identity-panel-fields">
        <TextField path="name" label="Name" className="jack-identity-panel-name" />
        <TextField
          path="chassis"
          label="Chassis"
          placeholder="Type to pick from the books"
          suggestions={available.map((chassis) => chassis.name).sort(compareNames)}
          onPick={pick}
        />
        <SelectField path="size" label="Size" options={SIZES} />
        <TextField path="height" label="Height" className="jack-identity-panel-short" />
        <TextField path="weight" label="Weight" className="jack-identity-panel-short" />
        <TextField path="fuelLoad" label="Max fuel load" className="jack-identity-panel-fuel" />
        <TextField path="fuelUse" label="Fuel consumption" className="jack-identity-panel-fuel" />
      </div>
      <p className="ik-note">
        {known
          ? `${known.size === 'light' ? 'Light' : 'Heavy'} ${known.kind}, ${known.book === 'core' ? `p. ${known.page}` : bookRef(known.book, known.page)}. Picking it filled in its specs, stats, DEF and ARM, stock cortex and damage grid; change anything that differs on your jack.`
          : 'Pick a chassis from the books to fill in its specs, stats, DEF and ARM, stock cortex and damage grid, or fill them in by hand.'}
      </p>
    </Panel>
  );
}
