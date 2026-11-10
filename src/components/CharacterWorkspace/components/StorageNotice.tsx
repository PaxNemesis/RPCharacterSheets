import { useState } from 'react';

const DISMISSED_KEY = 'rpcharactersheets:storage-notice-dismissed';

const wasDismissed = () => {
  try {
    return localStorage.getItem(DISMISSED_KEY) === 'true';
  } catch {
    return false;
  }
};

/** Reminds the user that autosave only keeps characters in this browser, until they dismiss it. */
export function StorageNotice() {
  const [dismissed, setDismissed] = useState(wasDismissed);
  if (dismissed) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISSED_KEY, 'true');
    } catch {
      // Blocked storage: hide it for this visit only.
    }
    setDismissed(true);
  };

  return (
    <div className="character-workspace-notice" role="note">
      <p>
        <strong>Your characters are only saved in this browser.</strong> Clearing browsing data, using a private window
        or switching browser or device will lose them. Use Save character to download a copy and keep it somewhere safe.
      </p>
      <button
        type="button"
        className="character-workspace-notice-close"
        aria-label="Dismiss"
        title="Dismiss"
        onClick={dismiss}
      >
        ×
      </button>
    </div>
  );
}
