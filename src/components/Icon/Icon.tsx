import { ICON_PATHS, type IconName } from './Icon.constants'
import './Icon.styles.css'

type IconProps = {
  name: IconName
  className?: string
}

/** A Material Symbols icon at text size in the current text color. Decorative: pair it with a text label. */
export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={['icon-container', className].filter(Boolean).join(' ')}
      viewBox="0 -960 960 960"
      aria-hidden="true"
      focusable="false"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  )
}
