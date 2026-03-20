import type { RefObject } from 'react';
import { useEffect } from 'react';

type LoadFromLocalAutoSaveProps = {
  storageKey: string;
  sharedStorageKey?: string;
  useDefaultTemplate?: boolean;
  rootRef?: RefObject<HTMLElement | null>;
  ready?: boolean;
};

const placeholderSnippets = [
  'Click me! then double-click me!',
  '>hello<',
  'good morning!',
];

function LoadFromLocalAutoSave({
  storageKey,
  sharedStorageKey,
  useDefaultTemplate = false,
  rootRef,
  ready = true,
}: LoadFromLocalAutoSaveProps) {
  useEffect(() => {
    if (useDefaultTemplate) {
      return;
    }

    if (!ready) {
      return;
    }

    const root = rootRef?.current ?? document.body;

    const applySnapshot = (targetKey: string, selector: string, isShared = false) => {
      const rawSaved = localStorage.getItem(targetKey);
      if (!rawSaved) {
        if (isShared) {
          console.log('[Autosave] No shared components saved yet');
        }
        return;
      }

      let savedElements: Array<{ id: string; text: string }> = [];
      let legacyElements: string[] = [];

      try {
        const parsed = JSON.parse(rawSaved) as unknown;
        if (Array.isArray(parsed)) {
          savedElements = parsed.filter(
            (element) =>
              typeof element === 'object' &&
              element !== null &&
              'id' in element &&
              'text' in element
          ) as Array<{ id: string; text: string }>;

          legacyElements = parsed.filter(
            (element) => typeof element === 'string'
          ) as string[];
        }
      } catch {
        savedElements = [];
        legacyElements = [];
      }

      if (!savedElements.length && legacyElements.length) {
        savedElements = legacyElements.map((value, index) => ({
          id: String(index),
          text: value,
        }));
      }

      const normalizedElements = savedElements.map((value) => {
        if (value.text.includes('<') && value.text.includes('>')) {
          const temp = document.createElement('div');
          temp.innerHTML = value.text;
          return { ...value, text: temp.textContent ?? '' };
        }

        return value;
      });

      if (normalizedElements.some((value, index) => value !== savedElements[index])) {
        localStorage.setItem(targetKey, JSON.stringify(normalizedElements));
      }

      savedElements = normalizedElements;

      const hasPlaceholderContent = savedElements.some((elementText) =>
        placeholderSnippets.some((snippet) => elementText.text.includes(snippet))
      );

      if (hasPlaceholderContent) {
        localStorage.removeItem(targetKey);
        return;
      }

      const editableElements = Array.from(root.querySelectorAll(selector));

      if (!editableElements.length || !savedElements.length) {
        return;
      }

      const editableMap = new Map<string, Element>(
        editableElements
          .map((element) => [element.getAttribute('data-editable-id') ?? '', element] as [string, Element])
          .filter(([key]) => key)
      );

      if (isShared) {
        console.log(`[Autosave] Shared - Found ${editableElements.length} editable elements in DOM`);
        console.log(`[Autosave] Shared - Trying to restore ${savedElements.length} saved elements`);
        const matched = savedElements.filter(v => editableMap.has(v.id)).length;
        console.log(`[Autosave] Shared - ${matched} elements matched by ID`);
      }

      const shouldApply = savedElements.some((value) => {
        const target = editableMap.get(value.id);
        if (!target) {
          if (isShared) {
            console.log(`[Autosave] Shared - Cannot find element with ID: ${value.id}`);
          }
          return false;
        }

        return value.text !== (target.textContent ?? '');
      });

      if (!shouldApply) {
        return 0;
      }

      let appliedCount = 0;
      savedElements.forEach((value) => {
        const target = editableMap.get(value.id);
        if (target) {
          target.textContent = value.text;
          appliedCount++;
        }
      });
      
      if (isShared) {
        console.log(`[Autosave] Shared - Applied ${appliedCount} changes`);
      }
      
      return appliedCount;
    };

    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    // Apply page-specific snapshot with retry
    const pageApplied = applySnapshot(storageKey, '[data-editable][data-editable-leaf="true"]', false);
    console.log(`[Autosave] Page - Applied ${pageApplied} changes on initial load`);
    
    // Retry page-specific after short delay if not all elements loaded
    const pageRetryTimeout = setTimeout(() => {
      const retryCount = applySnapshot(storageKey, '[data-editable][data-editable-leaf="true"]', false);
      if (retryCount && retryCount > 0) {
        console.log(`[Autosave] Page - Applied ${retryCount} additional changes on retry`);
      }
    }, 100);
    timeouts.push(pageRetryTimeout);
    
    // Apply shared components snapshot with retry
    if (sharedStorageKey) {
      // Try immediately first
      applySnapshot(sharedStorageKey, '[data-editable][data-editable-leaf="true"]', true);
      
      // Also retry after a short delay in case elements weren't ready
      const sharedRetryTimeout = setTimeout(() => {
        console.log('[Autosave] Retrying shared component restore...');
        applySnapshot(sharedStorageKey, '[data-editable][data-editable-leaf="true"]', true);
      }, 100);
      timeouts.push(sharedRetryTimeout);
    }
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [storageKey, sharedStorageKey, useDefaultTemplate, ready, rootRef]);

  return null;
}

export default LoadFromLocalAutoSave;