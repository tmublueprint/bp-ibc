import { useEffect, useRef, useState, useContext } from 'react'
import { UIContext } from '../../context/UIContext';

type EditableTextBoxProps = {
  initialText: string;
}

/**@deprecated logic is handled by `UIContext.tsx` */
function EditableTextBox({
  initialText
}: EditableTextBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);
  const [text, setText] = useState(initialText);
  const uiContext = useContext(UIContext);
  const spanRef = useRef<HTMLSpanElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);

  function handleMouseEnter() { setIsHovered(true); }
  function handleMouseLeave() { setIsHovered(false); }
  function handleMouseClick(e: React.MouseEvent) {
    e.stopPropagation();
    setIsEditing(true);
    
    if (spanRef.current && uiContext?.dispatch) {
      const rect = spanRef.current.getBoundingClientRect();
      uiContext.dispatch({
        type: "SHOW_POPUP",
        payload: {
          content: text,
          element: spanRef.current,
          position: { x: rect.left + window.scrollX, y: rect.bottom + window.scrollY },
        },
      });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      setIsEditing(false);
    } 
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!rootRef.current) return;
      const target = event.target as HTMLElement;
      
      if (target.closest('#text-setting-popup-ui-component')) {
        return;
      }
      
      if (!rootRef.current.contains(target)) {
        setIsEditing(false);
      }
    }

    function cleanup() {
      document.removeEventListener('mousedown', handleOutsideClick);
      setIsHovered(false);
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return cleanup;
  }, [isEditing]);

  useEffect(() => {
    text.trim() === "" ? setIsEmpty(true) : setIsEmpty(false)
  }, [text]);

  return (
  <span ref={rootRef}>
    {isEditing ? (
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
        style={{ border: '2px solid blue' }}
      />
    ) : (
      // TODO: span has no semantic meaning but it is in-line. review tradeoffs or
      // implement a mechanism to return different HTML elements epending on the 
      // content (i.e. p, span, etc.)
      <span
        ref={spanRef}
        data-editable="true"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onDoubleClick={handleMouseClick}
        style={{
          display: 'inline-flex',
          minHeight: '1.2em',
          minWidth: 10,
          padding: '0 2px',
          border: isHovered ? '2px solid red' : ''
        }}
      >
        {isEmpty && (
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              width: 2,
              height: '1em',
              background: 'red',
              borderRadius: 1,
              flex: '0 0 auto'
            }}
          />
        )}
        {text}
      </span>
    )}
  </span>
  );
};

export default EditableTextBox;