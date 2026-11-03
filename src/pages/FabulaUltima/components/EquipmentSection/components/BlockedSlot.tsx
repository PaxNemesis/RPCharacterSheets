type BlockedSlotProps = {
  label: string
  /** The two-handed weapon's name. */
  weapon: string
}

/** The off-hand while a two-handed weapon in the main hand uses both hands. */
export function BlockedSlot({ label, weapon }: BlockedSlotProps) {
  return (
    <div className="equipment-section-blocked" aria-disabled="true">
      <span className="equipment-section-blocked-label">{label}</span>
      <span className="equipment-section-blocked-text">
        Both hands: {weapon}. Anything held here moves to stored equipment.
      </span>
    </div>
  )
}
