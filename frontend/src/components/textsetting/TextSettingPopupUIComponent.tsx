import { useEffect, useRef } from "react";
import './TextSettingStyle.css'

interface TextSettingPopupUIProps {
  content: string;
  position: { x: number; y: number } | null;
  onClose: () => void;
}

function TextSettingPopupUIComponent({ position, onClose}: TextSettingPopupUIProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  // Styling implementation goes here:
  // read the selected element from UIContext and apply styles.
  // Example:
  // const element = uiContext?.state.selectedElement;
  // element?.style.setProperty(property, value);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div ref={popupRef} id="text-setting-popup-ui-component" className="text-setting-popup-ui-component" style={{ position: 'absolute', top: position?.y ?? 100, left: position?.x ?? 100 }}>
        <div>
            <h2>Text Settings</h2>
            <hr></hr>
        </div>
        <div className='text-setting-popup-ui-component-section'>
            <div>
              Style
            </div>
            <hr></hr>
            <div>
              Font
            </div>
            <hr></hr>
            <div>
              Font Size (px)
            </div>
            <hr></hr>
            <div>
              <ul>
                <li>
                  <button>B</button>
                </li>
                <li>
                  <button>I</button>
                </li>
                <li>
                  <button>U</button>
                </li>
              </ul>
            </div>
            <hr></hr>
            <div>Alignment</div>
        </div>
    </div>
  );
}

export default TextSettingPopupUIComponent;