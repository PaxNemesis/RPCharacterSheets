import { Panel } from '@/components/Panel'
import { useSheet } from '@/components/SheetProvider'
import { SYMBOL_IP } from '../../../constants/symbolist'
import type { FuActiveSymbol, FuCharacter, FuDerived } from '../../../types'
import { symbolLimits } from '../../../utils/symbolist'
import { ActiveSymbolRow } from './ActiveSymbolRow'

type ActiveSymbolsPanelProps = {
  character: FuCharacter
  derived: FuDerived
}

/** The symbols on creatures right now; they last until destroyed, so across scenes and sessions (HF pp. 147–148). */
export function ActiveSymbolsPanel({ character, derived }: ActiveSymbolsPanelProps) {
  const { set } = useSheet()
  const { active } = character.symbolist
  const limit = symbolLimits(character).active
  // A blank current IP counts as full.
  const ip = character.ip.current ?? derived.maxIp
  const full = active.length >= limit

  const copy = (symbol: FuActiveSymbol) => set('symbolist.active', [...active, { ...symbol, bearer: '' }])
  const destroy = (index: number) => set('symbolist.active', active.filter((_, other) => other !== index))

  return (
    <Panel
      title="Active symbols"
      actions={
        active.length > 0 && (
          <button type="button" onClick={() => set('symbolist.active', [])}>
            Destroy all
          </button>
        )
      }
    >
      <p className={active.length > limit ? 'fu-warning' : 'fu-note'}>
        {active.length} of {limit} active: up to your Symbolism SL + 1 (HF p. 147). IP {ip} of {derived.maxIp}.
        {active.length === 0 && ' Create symbols from their cards below.'}
      </p>
      {active.length > limit && <p className="fu-warning">Destroy {active.length - limit} before creating more.</p>}
      {active.length > 0 && (
        <ul className="symbols-section-active">
          {active.map((symbol, index) => (
            <ActiveSymbolRow
              key={index}
              index={index}
              symbol={symbol}
              canCopy={!full}
              onCopy={() => copy(symbol)}
              onDestroy={() => destroy(index)}
            />
          ))}
        </ul>
      )}
      <p className="fu-note">
        A creature bears one symbol at a time. Copies from one attack cost {SYMBOL_IP} IP in all, but each counts towards
        the limit.
      </p>
    </Panel>
  )
}
