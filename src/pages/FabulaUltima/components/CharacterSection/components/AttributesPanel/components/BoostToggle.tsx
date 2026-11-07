import { Icon } from '@/components/Icon'
import { useSheetField } from '@/components/SheetProvider'
import { ATTRIBUTES } from '../../../../../constants/attributes'
import type { AttributeKey } from '../../../../../types'

type BoostToggleProps = {
  attribute: AttributeKey
}

export function BoostToggle({ attribute }: BoostToggleProps) {
  const [boosted, setBoosted] = useSheetField<boolean>(`boosts.${attribute}`)
  const { label } = ATTRIBUTES[attribute]

  return (
    <button
      type="button"
      className="attributes-panel-boost"
      aria-pressed={boosted}
      aria-label={`Boost ${label}`}
      title={boosted ? `${label} is raised one die size` : `Raise ${label} one die size, up to d12`}
      onClick={() => setBoosted(!boosted)}
    >
      <Icon name="arrow_upward" />
    </button>
  )
}
