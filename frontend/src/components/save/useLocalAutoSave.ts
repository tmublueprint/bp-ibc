import type { RefObject } from 'react';
import { useEffect } from 'react'

// Value represented in seconds
const autoSaveInterval = 10; // e.g. 10 = call the local auto save every 10s
const legacyKeyPrefix = 'Saved Element #';

function useLocalAutoSave(
  storageKey: string,
  sharedStorageKey: string,
  rootRef?: RefObject<HTMLElement | null>
) {
  useEffect(() => {
    const localAutoSave = () => {
      const root = rootRef?.current ?? document.body;
      const pageElements = Array.from(
        root.querySelectorAll(
          '[data-editable][data-editable-leaf="true"]'
        )
      );

      if (!pageElements.length) {
        return;
      }

      const pageSnapshot: Array<{ id: string; text: string; stylingUpdates: string }> = [];
      const sharedSnapshot: Array<{ id: string; text: string; stylingUpdates: string }> = [];

      pageElements.forEach((editableElement) => {
        const data = {
          id: editableElement.getAttribute('data-editable-id') ?? '',
          text: editableElement.textContent ?? '',
          stylingUpdates: editableElement.getAttribute('data-styling-updates') ?? ''
        };

        // Check if element is inside nav or footer
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
        
        if (sharedSnapshot.length > 0) {
          console.log(`[Autosave] Saved ${sharedSnapshot.length} shared component elements:`, 
            sharedSnapshot.map(s => ({ id: s.id, text: s.text.substring(0, 30), stylingUpdates: s.stylingUpdates.substring(0, 30) })));
        }

        Object.keys(localStorage)
          .filter((key) => key.startsWith(legacyKeyPrefix))
          .forEach((key) => localStorage.removeItem(key));
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'QuotaExceededError') {
          console.error('Local storage exceeded!');
        }
      }
    };

    const localAutoSaveCall = setInterval(localAutoSave, autoSaveInterval * 1000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        localAutoSave();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      localAutoSave();
      clearInterval(localAutoSaveCall);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [storageKey, sharedStorageKey, rootRef]);
}

export default useLocalAutoSave;