import { NumberField } from '@/components/NumberField';
import { Panel } from '@/components/Panel';
import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';
import { useIkCharacter } from '../../../../hooks/useIkCharacter';
import { CareerFields, CareerNotes, CompanyFields, CompanyNotes, RaceFields } from './components';
import { companyOnOwnLine } from './utils/careerLine';
import './IdentityPanel.styles.css';

const LEVELS = ['Hero', 'Veteran', 'Epic'].map((level) => ({ value: level, label: level }));

/**
 * Who the character is, one group per line on a shared grid: name, player, level and XP; nationality,
 * race and archetype; careers; adventuring company; looks and faith; then defining characteristics.
 */
export function IdentityPanel() {
  const { character } = useIkCharacter();
  const ownLine = companyOnOwnLine(character);

  return (
    <Panel title="Character" className="identity-panel-container">
      <div className="identity-panel-fields">
        <TextField path="identity.name" label="Character name" className="identity-panel-wide" />
        <TextField path="identity.player" label="Player" className="identity-panel-wide" />
        <SelectField path="identity.level" label="Level" options={LEVELS} />
        <NumberField path="identity.xp" label="Total XP earned" />
        <RaceFields />
        <CareerFields />
        {/* The career notes go right under the careers. When the company can share the careers line, that's
            after the company at full width, but before it in the narrower layouts, where it wraps anyway;
            the stylesheet shows the one that fits. */}
        {ownLine ? (
          <>
            <CareerNotes />
            <CompanyFields ownLine />
          </>
        ) : (
          <>
            <CareerNotes className="identity-panel-notes-narrow" />
            <CompanyFields ownLine={false} />
            <CareerNotes className="identity-panel-notes-wide" />
          </>
        )}
        <CompanyNotes />
        <TextField path="identity.sex" label="Sex" className="identity-panel-row" />
        <TextField path="identity.age" label="Age" />
        <TextField path="identity.height" label="Height" />
        <TextField path="identity.weight" label="Weight" />
        <TextField path="identity.eyesHair" label="Eyes / hair" />
        <TextField path="identity.faith" label="Faith" />
        <TextField path="identity.defining" label="Defining characteristics" className="ik-wide" />
      </div>
    </Panel>
  );
}
