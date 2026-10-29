"use client";

import { useState } from "react";
import type { ResultSharing } from "@/lib/session";

export default function SharedResultAction({ sharing, onRetry, onCopy, onRemove }: {
  sharing: ResultSharing;
  onRetry: () => void;
  onCopy: () => void;
  onRemove: () => Promise<void>;
}) {
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState(false);
  if (sharing.state === "removed") return null;
  return <div className="border-t border-[var(--sf-line)] pt-4 mt-4 space-y-2" aria-busy={sharing.state === "saving" || removing}>
    {sharing.state === "error" && <><p role="alert">Automatic saving could not finish. Your try-on is still here.</p><button type="button" className="sf-button sf-button-secondary" onClick={onRetry}>Retry saving</button></>}
    {sharing.state === "ready" && <>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="sf-button sf-button-secondary" onClick={onCopy}>Copy private link</button>
        <button type="button" className="sf-text-link" disabled={removing} onClick={async () => {
          setRemoving(true); setRemoveError(false);
          try { await onRemove(); } catch { setRemoveError(true); } finally { setRemoving(false); }
        }}>Remove shared look</button>
      </div>
      {sharing.copyFailed && <><p role="alert">Automatic copy was blocked. Copy the private link below.</p><input aria-label="Private result link" className="w-full text-sm" readOnly value={`${window.location.origin}/view/${encodeURIComponent(sharing.id)}#key=${encodeURIComponent(sharing.accessToken)}`} onFocus={event => event.target.select()} /></>}
      {removeError && <p role="alert">Could not remove your shared look. Try again.</p>}
    </>}
  </div>;
}
