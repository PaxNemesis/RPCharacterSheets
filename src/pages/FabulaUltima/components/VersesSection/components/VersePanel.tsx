import { Panel } from '@/components/Panel'
import { SelectField } from '@/components/SelectField'
import { useSheet } from '@/components/SheetProvider'
import { ATTRIBUTES } from '../../../constants/attributes'
import { KEYS, TONES, VOLUMES } from '../../../constants/chanter'
import type { FuCharacter, FuDerived } from '../../../types'
import { chanterSkills, toneAmount } from '../../../utils/chanter'
import { hasWeaponCategory } from '../../../utils/equip'

type VersePanelProps = {
  character: FuCharacter
  derived: FuDerived
}

const options = (placeholder: string, names: string[]) => [
  { value: '', label: placeholder },
  ...names.map((name) => ({ value: name, label: name })),
]

/** Puts a verse together from a volume, a learned key and a learned tone, and works out what it does (HF pp. 137–139). */
export function VersePanel({ character, derived }: VersePanelProps) {
  const { set } = useSheet()
  const { keys, tones, verse } = character.chanter
  const sl = chanterSkills(character)
  const volume = VOLUMES.find((entry) => entry.name === verse.volume)
  const key = KEYS.find((entry) => entry.name === verse.key && keys.includes(entry.name))
  const tone = TONES.find((entry) => entry.name === verse.tone && tones.includes(entry.name))
  // A blank current MP counts as full.
  const mp = character.mp.current ?? derived.maxMp

  const aspects = key && tone
    ? tone.uses.map((aspect) =>
        aspect === 'type' ? `${key.type} damage`
        : aspect === 'status' ? key.status
        : aspect === 'attribute' ? ATTRIBUTES[key.attribute].label
        : `${key.recovery} recovery`,
      )
    : []
  const amount = tone && toneAmount(tone.name, derived)
  const effects = [
    amount !== undefined && key && (tone?.name === 'Calm' ? `${amount} ${key.recovery} recovered` : `${amount} ${key.type} damage`),
    sl.soundBarrier > 0 && volume && volume.name !== 'Low' && `Sound Barrier: −${sl.soundBarrier} physical damage to you until your next turn`,
    sl.vibrato > 0 && volume && volume.name !== 'High' && 'Vibrato: a free attack, with your High Roll as 0 for damage',
    sl.resonance > 0 && hasWeaponCategory(character, 'arcane') &&
      `Resonance, on enemies: allies deal +${sl.resonance} damage to them, or you recover ${sl.resonance} MP each time one is damaged`,
  ].filter((effect): effect is string => Boolean(effect))

  return (
    <Panel title="Sing a verse">
      <div className="verses-section-builder">
        <SelectField path="chanter.verse.volume" label="Volume" options={options('Choose…', VOLUMES.map((entry) => entry.name))} />
        <SelectField path="chanter.verse.key" label="Key" options={options(keys.length ? 'Choose…' : 'Learn a key first', keys)} />
        <SelectField path="chanter.verse.tone" label="Tone" options={options(tones.length ? 'Choose…' : 'Learn a tone first', tones)} />
        <button
          type="button"
          onClick={() => volume && set('mp.current', mp - volume.mp)}
          disabled={!volume || !key || !tone || mp < volume.mp}
        >
          Sing{volume && ` (−${volume.mp} MP)`}
        </button>
      </div>
      {volume && key && tone ? (
        <>
          <p>
            <strong>
              {tone.name} {key.name}, {volume.name.toLowerCase()} volume
            </strong>
            : {volume.mp} MP · {volume.targets} who can hear you · {aspects.join(' · ')}
          </p>
          {effects.length > 0 && (
            <ul className="verses-section-effects">
              {effects.map((effect) => (
                <li key={effect}>{effect}</li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="fu-note">Choose a volume, key and tone to see the verse&apos;s cost, targets and numbers.</p>
      )}
      <p className="fu-note">
        One verse per turn, using an action. MP {mp} of {derived.maxMp}.
      </p>
    </Panel>
  )
}
