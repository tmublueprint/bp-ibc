import type { RefObject } from 'react';
import { useCallback, useEffect, useLayoutEffect } from 'react';
import { saveRecordsInLocalStorage } from '../../utils/record';

// Value represented in seconds
const autoSaveInterval = 10;
const legacyKeyPrefix = 'Saved Element #';

function useLocalAutoSave(
  storageKey: string,
  sharedStorageKey: string,
  rootRef?: RefObject<HTMLElement | null>
) {
  // forceAll=true is used on page switch to capture format-only changes (font, size,
  // colour) that were applied while contentEditable was still 'true' due to the
  // toolbar focus guard. The periodic timer uses forceAll=false to avoid mid-typing noise.
  const localAutoSave = useCallback((forceAll = false) => {
    const root = rootRef?.current ?? document.body;
    const pageElements = Array.from(
      root.querySelectorAll('[data-editable][data-editable-leaf="true"]')
    );

    if (!pageElements.length) return;

    const pageSnapshot: Array<{ id: string; text: string; stylingUpdates: string; elementStyle?: string }> = [];
    const sharedSnapshot: Array<{ id: string; text: string; stylingUpdates: string; elementStyle?: string }> = [];

    pageElements.forEach((editableElement) => {
      const el = editableElement as HTMLElement;
      // Skip elements currently being edited to avoid saving mid-edit state,
      // unless we're doing a forced full-save on page switch.
      if (!forceAll && el.contentEditable === 'true') return;
      const data = {
        id: el.getAttribute('data-editable-id') ?? '',
        text: el.innerHTML,
        stylingUpdates: el.getAttribute('data-styling-updates') ?? '',
        elementStyle: el.style.textAlign ? `text-align: ${el.style.textAlign}` : '',
      };

      const isShared = editableElement.closest('nav') || editableElement.closest('footer');
      if (isShared) {
        sharedSnapshot.push(data);
      } else {
        pageSnapshot.push(data);
      }
    });

    try {
      localStorage.setItem(storageKey, JSON.stringify(pageSnapshot));
      localStorage.setItem(sharedStorageKey, JSON.stringify(sharedSnapshot));

      Object.keys(localStorage)
        .filter(key => key.startsWith(legacyKeyPrefix))
        .forEach(key => localStorage.removeItem(key));
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('Local storage exceeded!');
      }
    }

    saveRecordsInLocalStorage();
  }, [storageKey, sharedStorageKey, rootRef]);

  // Save synchronously before React mutates the DOM on page switch.
  // useLayoutEffect cleanup fires before the DOM mutation phase, so the old
  // page's elements are still in rootRef.current when we snapshot them.
  // useEffect cleanup fires after the mutation — too late, new page is already there.
  useLayoutEffect(() => {
    return () => { localAutoSave(true); };
  }, [localAutoSave]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') localAutoSave();
    };
    // Fired by AdminUIHeader before reading localStorage for a DB save, so that
    // format-only changes (alignment, font) applied while an element is still
    // focused are flushed to localStorage before saveAllPagesToDatabase reads it.
    const handleForceSave = () => localAutoSave(true);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('bp-ibc:force-autosave', handleForceSave);
    const intervalId = setInterval(localAutoSave, autoSaveInterval * 1000);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('bp-ibc:force-autosave', handleForceSave);
    };
  }, [localAutoSave]);
}

export default useLocalAutoSave;
