import { useEffect, useRef, useState } from 'react'

type EditableTextBoxProps = {
  initialText: string;
}

function EditableTextBox({
  initialText
}: EditableTextBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(initialText);

  const rootRef = useRef<HTMLSpanElement>(null);

  function handleMouseEnter() { setIsHovered(true); }
  function handleMouseLeave() { setIsHovered(false); }
  function handleMouseClick() { setIsEditing(true); }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      setIsEditing(false);
    } 
  }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleMouseClick}
        style={isHovered ? { border: '2px solid red' } : {}}
      >
        {text}
      </span>
    )}
  </span>
  );
};

export default EditableTextBox;