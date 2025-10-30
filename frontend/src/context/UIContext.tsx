import React, { createContext, useReducer, useEffect } from "react";
import type { ReactNode } from "react";
import TextSettingPopupUIComponent from "../components/textsetting/TextSettingPopupUIComponent";

type UIState = {
    popupContent: string | null;
    popupPosition: { x: number; y: number } | null;
    selectedElement?: HTMLElement | null;
}

type UIAction =
    | {type: "SHOW_POPUP"; payload: { content: string; element?: HTMLElement, position: { x: number; y: number }; }}
    | {type: "HIDE_POPUP"}

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

            const handleBlur = () => {
                element.contentEditable = 'false';
                element.style.border = '';
                element.removeEventListener('blur', handleBlur);
            };
            element.addEventListener('blur', handleBlur);
        }

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

        document.addEventListener('click', handleClick);
        document.addEventListener('dblclick', handleDblClick);
        return () => {
            document.removeEventListener('click', handleClick);
            document.removeEventListener('dblclick', handleDblClick);
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
