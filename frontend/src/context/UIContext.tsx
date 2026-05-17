import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import type { UIAction } from "../model/uiActionModel";
import type { UIState } from "../model/uiStateModel";
import { SetUnsaved } from "../features/siteStatus/siteStatus.slices";
import { store } from "../store/store";
import { AutoSave } from "../features/autoSave/autosave";
import { addRecord, highlightIfEdited } from "../utils/record";

const initialState: UIState = {
    popupContent: null,
    popupPosition: null,
    selectedElement: null,
}

function uiReducer(state: UIState, action: UIAction): UIState {
    switch (action.type) {
        case "SHOW_POPUP":
            return { ...state, popupContent: action.payload.content, popupPosition: action.payload.position, selectedElement: action.payload.element };
        case "HIDE_POPUP":
            return { ...state, popupContent: null, selectedElement: null, popupPosition: null };
        default:
            return state;
    }
}

export const UIContext = createContext<{
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
} | null>(null);

function UIContextProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(uiReducer, initialState);
    AutoSave();

    useEffect(() => {
        function makeEditable(element: HTMLElement) {
            if (element.contentEditable === 'true') return;
            element.contentEditable = 'true';
            element.style.outline = '2px solid #1E2E5E';
            element.style.outlineOffset = '2px';
            element.style.whiteSpace = 'pre-wrap';
            element.focus();

            const initialText = element.innerText;
            let unsavedLock = false;

            const handleTextChanges = () => {
                if (element.innerText !== initialText) {
                    element.style.outline = '2px solid #FFD700';
                    if (!unsavedLock) {
                        store.dispatch(SetUnsaved());
                        unsavedLock = true;
                    }
                } else {
                    element.style.outline = '2px solid #1E2E5E';
                }
            };

            element.addEventListener('input', handleTextChanges);

            const getAnchorNode = (sel: Selection): HTMLElement | null => {
                const anchor = sel.anchorNode;
                if (!anchor) return null;
                return anchor.nodeType === Node.TEXT_NODE
                    ? (anchor as Text).parentElement
                    : anchor as HTMLElement;
            };

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    // Inside a list: let browser create a new <li> naturally
                    const sel = window.getSelection();
                    if (sel && getAnchorNode(sel)?.closest('ul, ol')) return;
                    e.preventDefault();
                    element.blur();
                }

                if (e.key === 'Backspace') {
                    const sel = window.getSelection();
                    if (!sel || !sel.isCollapsed || sel.rangeCount === 0) return;
                    const node = getAnchorNode(sel);
                    const li = node?.closest('li');
                    if (!li) return;

                    // Only handle when cursor is at the very start of the <li> content
                    const range = sel.getRangeAt(0);
                    try {
                        const testRange = document.createRange();
                        testRange.setStart(li, 0);
                        testRange.setEnd(range.startContainer, range.startOffset);
                        if (testRange.toString().length > 0) return;
                    } catch {
                        return;
                    }

                    // Let browser handle non-first items (merges with previous <li>)
                    if (li.previousElementSibling) return;

                    const list = li.closest('ul, ol');
                    if (!list) return;
                    e.preventDefault();
                    const cmd = list.tagName === 'UL' ? 'insertUnorderedList' : 'insertOrderedList';
                    document.execCommand(cmd, false, undefined);
                }
            };

            element.addEventListener('keydown', handleKeyDown);

            const handleBlur = (e: FocusEvent) => {
                // Keep the element editable when focus moves into the toolbar
                // so toolbar commands (font, size, color) still have a valid target.
                const next = e.relatedTarget as HTMLElement | null;
                if (next?.closest('.toolbar-wrapper')) return;

                element.contentEditable = 'false';
                element.style.outline = '';
                element.style.outlineOffset = '';
                element.removeEventListener('input', handleTextChanges);
                element.removeEventListener('blur', handleBlur as EventListener);
                element.removeEventListener('keydown', handleKeyDown);
                highlightIfEdited(element);
            };

            element.addEventListener('blur', handleBlur as EventListener);
        }

        const handleMouseDown = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const editable = target.closest('[data-editable="true"]') as HTMLElement | null;
            if (!editable) return;
            addRecord(editable);
            makeEditable(editable);
        };

        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
    }, []);

    return (
        <UIContext.Provider value={{ state, dispatch }}>
            {children}
        </UIContext.Provider>
    );
}

export default UIContextProvider;
