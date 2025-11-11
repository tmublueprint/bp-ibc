import { useEffect, useRef, useContext, useState } from "react";
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
  
  const [fontWeight, setFontWeight] = useState(element ? Number(window.getComputedStyle(element).fontWeight) : 400);
  
  function toggleBold() {

    if (!element) return;
    const isBold = fontWeight === 'bold' || Number(fontWeight) >= 700;
    const newFontWeight = isBold ? 400 : 700;

    element.style.setProperty('font-weight', isBold ? 400 : 'bold');
    setFontWeight(newFontWeight);
  }

  const changeFontWeight = (e : React.KeyboardEvent<HTMLInputElement>) => {
    //get current fontweight, if null, set to default fontWeight (400)
    
    if (e.key == "Enter") {
      if (fontWeight >= 100 && fontWeight <=900) {
        if (!element) return;
        else {
          element.style.setProperty('font-weight', fontWeight);
        }
      }
    }
  }
  
  function incrementFontWeight(type : String) {
    const incAmt = (type == "dec") ? -100 : 100;
    const newFontWeight = Number(fontWeight) + incAmt; //local scope, if out of range of conditional, will not affect fontWeight
    if (newFontWeight >= 100 && newFontWeight <= 900) {
      if (!element) return;
      setFontWeight(newFontWeight);
      element.style.setProperty('font-weight', newFontWeight);
    }
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
  

  // gets font from element, if it doesn't exist set default font to be 12
  const [fontSize, setFont] = useState(element ? parseFloat(window.getComputedStyle(element).fontSize) : Number(12)); 

    // using buttons to increment/decrement 
  function incrementFont(type : String) {
    const amount = (type == 'dec') ? -0.1 : 0.1;
    const newFont = Number((fontSize + amount).toFixed(1));
    if (newFont >= 1 && newFont <= 100) {
      setFont(newFont);
      if (!element) return;
      element.style.setProperty('font-size', `${newFont}px`);
    }
  }

  // when font size changes (ex. user changes)
  const changeFont = (e : React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key == "Enter") {
        if (fontSize >= 1 && fontSize <= 100) {
          if (!element) return;
          element.style.setProperty('font-size', `${fontSize}px`);
        }
      }
    };
    

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
            <div style={{display: 'flex'}}>
              <button onClick={() => incrementFont('dec')}>-</button>
              <input type="number" value={fontSize} min="1" max="100" step="0.1" onChange={(e) => setFont(Number(e.target.value))} onKeyDown={(e) => changeFont(e)} style={{display: 'flex', textAlign: 'center'}}/>
              <button onClick={() => incrementFont('inc')}>+</button>
            </div>
            <hr></hr>
            <div>
              <ul>
                <li
                  style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
                  <button onClick={toggleBold}>B</button>

                  <div>
                    <button onClick={() => incrementFontWeight('dec')}>-</button>
                    <input 
                      type="number" value={fontWeight} min="100" max="900" step="100" style={{width: "40px", textAlign: "center"}}
                      onChange={(e) => setFontWeight(Number(e.target.value))}
                      onKeyDown={(e) => changeFontWeight(e)}
                      />
                    <button onClick={() => incrementFontWeight('inc')}>+</button>
                  </div>
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