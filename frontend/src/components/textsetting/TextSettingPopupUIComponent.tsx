import { useEffect, useRef, useContext } from "react";
import './TextSettingStyle.css'
import { UIContext } from "../../context/UIContext";

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

  const uiContext = useContext(UIContext);
  const element = uiContext?.state.selectedElement;
  
  function toggleBold() {

    if (!element) return;

    const computed = window.getComputedStyle(element);
    const fontWeight = computed.fontWeight ?? '';
    const isBold = fontWeight === 'bold' || Number(fontWeight) >= 700;

    element.style.setProperty('font-weight', isBold ? 'normal' : 'bold');

  }

  function toggleItalic() {
    if (!element) return;

    const computed = window.getComputedStyle(element);
    const isItalic = computed.fontStyle === 'italic';

    element.style.setProperty('font-style', isItalic ? 'normal' : 'italic');
  }

  function toggleUnderlined() {
    if (!element) return;

    const computed = window.getComputedStyle(element);
    const textDecLine = computed.textDecoration ?? '';
    const isUnderline = textDecLine.includes('underline');

    element.style.setProperty('text-decoration', isUnderline ? 'none' : 'underline');
  }
  
  console.log(element);

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
                  <button onClick={toggleBold}>B</button>
                </li>
                <li>
                  <button onClick={toggleItalic}>I</button>
                </li>
                <li>
                  <button onClick={toggleUnderlined}>U</button>
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