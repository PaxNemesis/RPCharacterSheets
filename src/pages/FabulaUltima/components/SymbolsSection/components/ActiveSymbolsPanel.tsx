import { Panel } from '@/components/Panel'
import { useSheet } from '@/components/SheetProvider'
import { SYMBOL_IP, SYMBOLS } from '../../../constants/symbolist'
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
  const { active, learned } = character.symbolist
  const limit = symbolLimits(character).active
  // A blank current IP counts as full.
  const ip = character.ip.current ?? derived.maxIp
  const known = SYMBOLS.filter((symbol) => learned.includes(symbol.name))
  const full = active.length >= limit
  const blocked = full ? 'At your limit: destroy a symbol first' : ip < SYMBOL_IP ? `Creating a symbol takes ${SYMBOL_IP} IP` : undefined

  const create = (name: string) => {
    set('symbolist.active', [...active, { name, bearer: '', choice: '' }])
    set('ip.current', ip - SYMBOL_IP)
  }
  const copy = (symbol: FuActiveSymbol) => set('symbolist.active', [...active, { ...symbol, bearer: '' }])
  const destroy = (index: number) => set('symbolist.active', active.filter((_, other) => other !== index))

  return (
    <Panel
      title="Active symbols"
      actions={
        <>
          {known.length > 0 && (
            <select
              aria-label="Create a symbol"
              value=""
              disabled={Boolean(blocked)}
              title={blocked}
              onChange={(event) => event.target.value && create(event.target.value)}
            >
              <option value="">Create symbol (−{SYMBOL_IP} IP)…</option>
              {known.map((symbol) => (
                <option key={symbol.name} value={symbol.name}>
                  {symbol.name}
                </option>
              ))}
            </select>
          )}
          {active.length > 0 && (
            <button type="button" onClick={() => set('symbolist.active', [])}>
              Destroy all
            </button>
          )}
        </>
      }
    >
      <p className={active.length > limit ? 'fu-warning' : 'fu-note'}>
        {active.length} of {limit} active: up to your Symbolism SL + 1 (HF p. 147). IP {ip} of {derived.maxIp}.
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
