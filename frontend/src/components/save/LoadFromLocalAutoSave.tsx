import type { RefObject } from 'react';
import { useEffect } from 'react';
import { loadRecordsFromLocalStorage } from '../../utils/record';

type LoadFromLocalAutoSaveProps = {
  storageKey: string;
  sharedStorageKey?: string;
  useDefaultTemplate?: boolean;
  rootRef?: RefObject<HTMLElement | null>;
  ready?: boolean;
};

const placeholderSnippets = [
  'Click me! then double-click me!',
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
      if (!rawSaved) return;

      let savedElements: Array<{ id: string; text: string; stylingUpdates: string }> = [];
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
          ) as Array<{ id: string; text: string; stylingUpdates: string }>;

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
          stylingUpdates: ""
        }));
      }

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

      const shouldApply = savedElements.some((value) => {
        const target = editableMap.get(value.id);
        if (!target) return false;

        return value.text !== ((target as HTMLElement).innerHTML ?? '') || value.stylingUpdates !== (target.getAttribute("data-styling-updates") ?? '');
      });

      if (!shouldApply) {
        return 0;
      }

      let appliedCount = 0;
      savedElements.forEach((value) => {
        const target = editableMap.get(value.id);
        if (target) {
          target.innerHTML = value.text;
          if (value.stylingUpdates) {
            target.setAttribute("data-styling-updates", value.stylingUpdates);
          }
          appliedCount++;
        }
      });
      
      return appliedCount;
    };

    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    // Apply page-specific snapshot with retry
    applySnapshot(storageKey, '[data-editable][data-editable-leaf="true"]', false);

    const pageRetryTimeout = setTimeout(() => {
      applySnapshot(storageKey, '[data-editable][data-editable-leaf="true"]', false);
    }, 100);
    timeouts.push(pageRetryTimeout);

    if (sharedStorageKey) {
      applySnapshot(sharedStorageKey, '[data-editable][data-editable-leaf="true"]', true);

      const sharedRetryTimeout = setTimeout(() => {
        applySnapshot(sharedStorageKey, '[data-editable][data-editable-leaf="true"]', true);
      }, 100);
      timeouts.push(sharedRetryTimeout);
    }

    loadRecordsFromLocalStorage();
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [storageKey, sharedStorageKey, useDefaultTemplate, ready, rootRef]);

  return null;
}

export default LoadFromLocalAutoSave;