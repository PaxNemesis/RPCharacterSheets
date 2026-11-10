import { useState, type FormEvent } from 'react'

type TakeDamageFormProps = {
  onApply: (branch: number, amount: number) => void
}

const BRANCHES = [1, 2, 3, 4, 5, 6]

export function TakeDamageForm({ onApply }: TakeDamageFormProps) {
  const [branch, setBranch] = useState(1)
  const [amount, setAmount] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const points = Number(amount)
    if (!Number.isInteger(points) || points <= 0) return
    onApply(branch - 1, points)
    setAmount('')
  }

  return (
    <form className="damage-panel-form" onSubmit={submit}>
      <span className="damage-panel-form-title">Take damage</span>
      <label>
        <span className="damage-panel-form-label">Points</span>
        <input type="text" inputMode="numeric" value={amount} onChange={(event) => setAmount(event.target.value)} />
      </label>
      <label>
        <span className="damage-panel-form-label">Branch (d6)</span>
        <select value={branch} onChange={(event) => setBranch(Number(event.target.value))}>
          {BRANCHES.map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          ))}
        </select>
      </label>
      <button type="button" title="Roll a d6 for the branch" onClick={() => setBranch(Math.floor(Math.random() * 6) + 1)}>
        Roll
      </button>
      <button type="submit">Apply</button>
    </form>
  )
}
