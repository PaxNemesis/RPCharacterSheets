import { NumberField } from '@/components/NumberField'
import { Panel } from '@/components/Panel'
import { RepeatTable, type RepeatTableColumn } from '@/components/RepeatTable'
import { SelectField } from '@/components/SelectField'
import { useSheet } from '@/components/SheetProvider'
import { TextField } from '@/components/TextField'
import { MAX_RUNE_POINTS, MECHANIKA_TYPES } from '../../../constants/mechanika'
import type { IkMechanika, IkRune } from '../../../types'
import { capacitorNames, capacitorValues, mechanikaProblems, pickRune, runeNames, runePoints } from '../../../utils/mechanika'

const TYPE_OPTIONS = [{ value: '', label: '—' }, ...MECHANIKA_TYPES]
const createRune = (): IkRune => ({ name: '', points: null, page: '', notes: '' })

type MechanikaDeviceProps = {
  number: number
  onRemove: () => void
}

/** One mechanikal device; rendered inside a SheetProvider scoped to `mechanika.<index>`. */
export function MechanikaDevice({ number, onRemove }: MechanikaDeviceProps) {
  const { get, set } = useSheet()
  const device = get('') as IkMechanika
  const points = runePoints(device.runes)
  const problems = mechanikaProblems(device)
  const runeColumns: RepeatTableColumn[] = [
    { key: 'name', label: 'Rune', width: 'minmax(140px, 2fr)', suggestions: runeNames(device.type), onPick: pickRune },
    { key: 'points', label: 'Points', width: '64px', type: 'number' },
    { key: 'page', label: 'Page', width: '60px' },
    { key: 'notes', label: 'Effect / notes', rows: 2, wide: true },
  ]

  const pickCapacitor = (name: string) => {
    const values = capacitorValues(name)
    if (values) set('', { ...device, ...values })
  }

  return (
    <Panel
      title={device.name?.trim() || `Device ${number}`}
      actions={
        <button type="button" onClick={onRemove}>
          Remove
        </button>
      }
    >
      <div className="ik-fields">
        <TextField path="name" label="Device name" />
        <SelectField path="type" label="Type" options={TYPE_OPTIONS} />
        <TextField path="housing" label="Housing" placeholder="e.g. Great coat" />
      </div>
      <div className="ik-fields">
        <TextField path="capacitor" label="Capacitor" suggestions={capacitorNames} onPick={pickCapacitor} />
        <NumberField path="power" label="Power output" />
        <TextField path="lifespan" label="Lifespan" />
      </div>
      <RepeatTable path="runes" columns={runeColumns} createRow={createRune} itemName="rune" />
      <p className="ik-note">
        Rune points: {points} of {MAX_RUNE_POINTS}
        {device.power !== null && device.power !== undefined && `, capacitor powers ${device.power}`}.
      </p>
      {problems.map((problem) => (
        <p key={problem} className="ik-warning" role="status">
          {problem}
        </p>
      ))}
      <TextField path="notes" label="Notes" rows={3} />
    </Panel>
  )
}
