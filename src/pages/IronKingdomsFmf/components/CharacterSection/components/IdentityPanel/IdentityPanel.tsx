import { NumberField } from '@/components/NumberField';
import { Panel } from '@/components/Panel';
import { SelectField } from '@/components/SelectField';
import { TextField } from '@/components/TextField';
import { CareerFields, CareerNotes, CompanyFields, CompanyNotes, RaceFields } from './components';
import './IdentityPanel.styles.css';

const LEVELS = ['Hero', 'Veteran', 'Epic'].map((level) => ({ value: level, label: level }));

/**
 * Who the character is, one group per line on a shared grid: name, player, level and XP; race and
 * archetype; careers; adventuring company; looks and faith; then defining characteristics.
 */
export function IdentityPanel() {
  return (
    <Panel title="Character" className="identity-panel-container">
      <div className="identity-panel-fields">
        <TextField path="identity.name" label="Character name" className="identity-panel-wide" />
        <TextField path="identity.player" label="Player" className="identity-panel-wide" />
        <SelectField path="identity.level" label="Level" options={LEVELS} />
        <NumberField path="identity.xp" label="Total XP earned" />
        <RaceFields />
        <CareerFields />
        <CompanyFields />
        <CareerNotes />
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
