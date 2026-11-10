import type { JackSize } from '../../../../types';
import './JackSilhouette.styles.css';

type JackSilhouetteProps = {
  size: JackSize | '';
};

/** Broad and hunched: two smokestacks, a wide boiler, heavy shoulders and fists. Drawn back to front. */
const HEAVY_JACK = (
  <>
    <rect x="48" y="10" width="12" height="34" rx="2" />
    <rect x="100" y="14" width="12" height="30" rx="2" />
    <rect x="40" y="38" width="80" height="58" rx="18" />
    <rect x="54" y="88" width="52" height="18" rx="5" />
    <rect x="52" y="100" width="24" height="30" rx="6" />
    <rect x="84" y="100" width="24" height="30" rx="6" />
    <rect x="44" y="126" width="36" height="14" rx="4" />
    <rect x="80" y="126" width="36" height="14" rx="4" />
    <rect x="16" y="58" width="28" height="44" rx="10" />
    <rect x="116" y="58" width="28" height="44" rx="10" />
    <circle cx="36" cy="54" r="18" />
    <circle cx="124" cy="54" r="18" />
    <circle cx="30" cy="110" r="14" />
    <circle cx="130" cy="110" r="14" />
    <rect x="63" y="28" width="34" height="28" rx="10" />
    <rect className="jack-silhouette-eye" x="69" y="38" width="22" height="6" rx="3" />
  </>
);

/** Lean and upright: one smokestack, a narrow boiler and long legs. Drawn back to front. */
const LIGHT_JACK = (
  <>
    <rect x="92" y="14" width="10" height="30" rx="2" />
    <rect x="54" y="42" width="52" height="48" rx="14" />
    <rect x="62" y="84" width="36" height="14" rx="4" />
    <rect x="62" y="92" width="16" height="38" rx="5" />
    <rect x="82" y="92" width="16" height="38" rx="5" />
    <rect x="56" y="126" width="26" height="12" rx="4" />
    <rect x="78" y="126" width="26" height="12" rx="4" />
    <rect x="34" y="58" width="20" height="40" rx="8" />
    <rect x="106" y="58" width="20" height="40" rx="8" />
    <circle cx="50" cy="54" r="13" />
    <circle cx="110" cy="54" r="13" />
    <circle cx="44" cy="105" r="10" />
    <circle cx="116" cy="105" r="10" />
    <rect x="67" y="32" width="26" height="24" rx="8" />
    <rect className="jack-silhouette-eye" x="72" y="41" width="16" height="5" rx="2.5" />
  </>
);

/**
 * A plain drawing of a steamjack, heavy or light, for the image box until the player adds a picture.
 * Original artwork for this site; the books' art stays in the books.
 */
export function JackSilhouette({ size }: JackSilhouetteProps) {
  return (
    <svg className="jack-silhouette-container" viewBox="0 0 160 160" aria-hidden="true" focusable="false">
      {size === 'light' ? LIGHT_JACK : HEAVY_JACK}
    </svg>
  );
}
