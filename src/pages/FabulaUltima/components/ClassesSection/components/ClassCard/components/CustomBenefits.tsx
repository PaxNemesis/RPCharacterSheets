import { CheckboxField } from '@/components/CheckboxField'
import { NumberField } from '@/components/NumberField'
import { DISCIPLINES, MARTIAL } from '../../../../../constants/attributes'

/** Free benefits typed in by hand, for a class that isn't in the enabled rulebooks. */
export function CustomBenefits() {
  return (
    <>
      <p className="fu-note">
        Not a class from the rulebooks turned on in Settings. Enter its free benefits so they count toward your totals.
      </p>
      <div className="fu-fields">
        <NumberField path="custom.hp" label="+ max HP" />
        <NumberField path="custom.mp" label="+ max MP" />
        <NumberField path="custom.ip" label="+ max IP" />
      </div>
      <div className="fu-checks">
        {MARTIAL.map(({ key, label }) => (
          <CheckboxField key={key} path={`custom.martial.${key}`} label={label} />
        ))}
      </div>
      <div className="fu-checks" role="group" aria-label="Ritual disciplines">
        {DISCIPLINES.map(({ key, label }) => (
          <CheckboxField key={key} path={`custom.disciplines.${key}`} label={`${label} rituals`} />
        ))}
      </div>
      <p className="fu-note">
        Tick the disciplines the class grants for free. A Skill named after a discipline, such as Ritual Elementalism,
        unlocks it too once it has a Skill Level.
      </p>
    </>
  )
}
