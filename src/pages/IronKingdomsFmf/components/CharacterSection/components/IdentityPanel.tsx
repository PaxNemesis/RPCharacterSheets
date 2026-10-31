import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { SelectField } from '@/components/SelectField'
import { TextField } from '@/components/TextField'
import { CareerFields } from './CareerFields'
import { RaceFields } from './RaceFields'

const LEVELS = ['Hero', 'Veteran', 'Epic'].map((level) => ({ value: level, label: level }))

export function IdentityPanel() {
  return (
    <Panel title="Character">
      <div className="ik-fields">
        <TextField path="identity.name" label="Character name" />
        <TextField path="identity.player" label="Player" />
        <RaceFields />
        <SelectField path="identity.level" label="Level" options={LEVELS} />
        <NumberField path="identity.xp" label="Total XP earned" />
        <TextField path="identity.faith" label="Faith" />
        <TextField path="identity.sex" label="Sex" />
        <TextField path="identity.age" label="Age" />
        <TextField path="identity.height" label="Height" />
        <TextField path="identity.weight" label="Weight" />
        <TextField path="identity.eyesHair" label="Eyes / hair" />
        <TextField path="identity.defining" label="Defining characteristics" className="ik-wide" />
        <CareerFields />
      </div>
    </Panel>
  )
}
