import { ATTRIBUTES } from '../../constants/attributes'
import { bookRef } from '../../constants/books'
import { KEYS, TONES, type KeyAspect } from '../../constants/chanter'
import { useFuCharacter } from '../../hooks/useFuCharacter'
import { learnedLimit } from '../../utils/chanter'
import { LearnedList } from '../LearnedList'
import { VersePanel } from './components'
import './VersesSection.styles.css'

const ASPECT_LABELS: Record<KeyAspect, string> = {
  type: 'damage type',
  status: 'status effect',
  attribute: 'Attribute',
  recovery: 'recovery',
}

const KEY_ENTRIES = KEYS.map((key) => ({
  name: key.name,
  ref: bookRef('high', 138),
  detail: `${key.type} · ${key.status} · ${ATTRIBUTES[key.attribute].label} · ${key.recovery}`,
}))

const TONE_ENTRIES = TONES.map((tone) => ({
  name: tone.name,
  ref: bookRef('high', 139),
  detail: `Uses the key's ${tone.uses.map((aspect) => ASPECT_LABELS[aspect]).join(' and ')}`,
}))

/** The Chanter's keys and tones, and singing verses with them (HF pp. 136–139). */
export function VersesSection() {
  const { character, derived } = useFuCharacter()
  const { keys, tones } = character.chanter
  // Keys and tones share one limit; names that aren't in the rulebook don't count.
  const count = KEYS.filter((key) => keys.includes(key.name)).length + TONES.filter((tone) => tones.includes(tone.name)).length
  const limit = learnedLimit(character)
  const limitNote = 'one key and one tone with the first level of Magichant, then a key or a tone per level (HF p. 137).'

  return (
    <div className="fu-section verses-section-container">
      <VersePanel character={character} derived={derived} />
      <div className="fu-columns">
        <LearnedList
          title="Keys"
          noun="key"
          entries={KEY_ENTRIES}
          path="chanter.keys"
          notesPath="chanter.notes"
          count={count}
          limit={limit}
          limitNote={limitNote}
          highlight={character.chanter.verse.key}
        />
        <LearnedList
          title="Tones"
          noun="tone"
          entries={TONE_ENTRIES}
          path="chanter.tones"
          notesPath="chanter.notes"
          count={count}
          limit={limit}
          limitNote={limitNote}
          highlight={character.chanter.verse.tone}
        />
      </div>
    </div>
  )
}
