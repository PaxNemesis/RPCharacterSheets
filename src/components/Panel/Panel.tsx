import type { ReactNode } from 'react';
import './Panel.styles.css';

type PanelProps = {
  title: string;
  /** Extra content on the right of the title bar, such as buttons. */
  actions?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Panel({ title, actions, className, children }: PanelProps) {
  return (
    <section className={['panel-container', className].filter(Boolean).join(' ')}>
      <header className="panel-header">
        <h2>{title}</h2>
        {actions && <div className="panel-actions">{actions}</div>}
      </header>
      <div className="panel-body">{children}</div>
    </section>
  );
}
