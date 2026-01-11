import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import TextSettingPopupUIComponent from "../components/textsetting/TextSettingPopupUIComponent";
import type { UIAction } from "../model/uiActionModel";
import type { UIState } from "../model/uiStateModel";
import { SetUnsaved } from "../features/siteStatus/siteStatus.slices";
import { store } from "../store/store";
import { AutoSave } from "../features/autoSave/autosave";

const initialState: UIState = {
    popupContent: null,
    popupPosition: null,
    selectedElement: null,
}
const DOUBLE_CLICK_INTERVAL = 300; // milliseconds

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
        function showPopupFor(element: HTMLElement) {
            const rect = element.getBoundingClientRect();
            dispatch({
                type: "SHOW_POPUP",
                payload: {
                    content: element.innerText,
                    element,
                    position: { x: rect.left + window.scrollX, y: rect.bottom + window.scrollY },
                },
            });
        }

        function makeEditable(element: HTMLElement) {
            element.contentEditable = 'true';
            element.style.outline = 'none';
            element.style.border = '2px solid blue';
            element.focus();

            // get initial text 
            const initialText = element.innerText;

            // highlight all text in the textbox on edit
            const range = document.createRange();
            range.selectNodeContents(element);
            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }

            let unsavedLock = false;

            // event handler for changes to text 
            const handleTextChanges = () => {
                // change border if text has been edited, otherwise keep original color (blue)
                if (element.innerText !== initialText) {
                    element.style.border = '5px solid #FFD700';

                    // prevent multiple setunsaved calls per edit session
                    if (!unsavedLock) {
                        store.dispatch(SetUnsaved());
                        unsavedLock = true;
                    }

                } else {
                    element.style.border = '2 px solid blue';
                }
            }

            element.addEventListener('input', handleTextChanges);

            //event handler for keydowns (enter, shift enter)
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Enter' && e.shiftKey) {
                    return;
                }

                if (e.key === 'Enter') {
                    e.preventDefault();
                    element.blur()
                }

            }

            element.addEventListener('keydown', handleKeyDown);

            const handleBlur = () => {
                element.contentEditable = 'false';
                element.style.border = '';
                element.removeEventListener('input', handleTextChanges);
                element.removeEventListener('blur', handleBlur);
                element.removeEventListener('keydown', handleKeyDown);
            };
            element.addEventListener('blur', handleBlur);
        }

        let lastMouseDownTime = 0;
        const handleMouseDown = (e: MouseEvent) => {
            const now = Date.now();
            if (now - lastMouseDownTime < DOUBLE_CLICK_INTERVAL) {
                handleDblClick(e);
            } else {
                handleClick(e);
            }
            lastMouseDownTime = now;
        };

        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const editable = target.closest('[data-editable="true"]') as HTMLElement | null;
            if (!editable) return;
            showPopupFor(editable);
        };

        const handleDblClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest('#text-setting-popup-ui-component')) return;
            const editable = target.closest('[data-editable="true"]') as HTMLElement | null;
            if (!editable) return;
            e.stopPropagation();
            e.preventDefault();
            makeEditable(editable);
            showPopupFor(editable);
        };

        document.addEventListener('mousedown', handleMouseDown);
        return () => {
            document.removeEventListener('mousedown', handleMouseDown);
        };
    }, []);

    return (
        <UIContext.Provider value={{ state, dispatch }}>
            {children}
            {state.popupContent && (
            <TextSettingPopupUIComponent
            content={state.popupContent}
            position={state.popupPosition}
            onClose={() => dispatch({ type: "HIDE_POPUP" })}
            />
        )}
        </UIContext.Provider>
    )
}

export default UIContextProvider;
