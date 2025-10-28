import { useEffect, useRef, useState } from 'react'

type EditableTextBoxProps = {
  value: string;
}

function EditableTextBox({
  value
}: EditableTextBoxProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const rootRef = useRef<HTMLSpanElement>(null);

  function handleMouseEnter() { setIsHovered(true); }
  function handleMouseLeave() { setIsHovered(false); }
  function handleMouseClick() { setIsEditing(true); }

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setIsEditing(false);
      }
    }

    function cleanup() {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    if (isEditing) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return cleanup;
  }, [isEditing]);

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseClick}
      style={ 
        isHovered ? { border: '2px solid red' } : {}
      }
      ref={rootRef}
    >
      {(isEditing ? "editing" : "") + value}
    </span>
  );
};

export default EditableTextBox;