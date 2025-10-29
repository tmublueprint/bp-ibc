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

const UIContext = createContext<{
  state: UIState;
  dispatch: React.Dispatch<UIAction>;
} | null>(null);

function UIContextProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(uiReducer, initialState);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.dataset.editable === "true") {
            const rect = target.getBoundingClientRect();
            dispatch({
            type: "SHOW_POPUP",
            payload: {
                content: target.innerText,
                element: target,
                position: { x: rect.left + window.scrollX, y: rect.bottom + window.scrollY },
            },
            });
        }
        };

        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
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
