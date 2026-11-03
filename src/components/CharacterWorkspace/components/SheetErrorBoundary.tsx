import { Component, type ReactNode } from 'react'

type SheetErrorBoundaryProps = {
  name: string
  onSave: () => void
  onClose: () => void
  children: ReactNode
}

type SheetErrorBoundaryState = { failed: boolean }

/**
 * Shows a way out instead of a blank page when a character can't be drawn, such as one from a
 * damaged or hand-edited file, so one broken character never locks up the others.
 */
export class SheetErrorBoundary extends Component<SheetErrorBoundaryProps, SheetErrorBoundaryState> {
  state: SheetErrorBoundaryState = { failed: false }

  static getDerivedStateFromError(): SheetErrorBoundaryState {
    return { failed: true }
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="character-workspace-alert" role="alert">
        <p>
          {this.props.name} couldn&apos;t be shown. Its data may be damaged, for example by editing the JSON by hand. Your
          other characters are fine.
        </p>
        <div className="character-workspace-toolbar">
          <button type="button" onClick={this.props.onSave}>
            Save JSON
          </button>
          <button type="button" className="character-workspace-danger" onClick={this.props.onClose}>
            Close character…
          </button>
        </div>
      </div>
    )
  }
}
