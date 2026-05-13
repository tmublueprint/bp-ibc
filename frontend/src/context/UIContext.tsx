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

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    element.blur();
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
