import { useState } from 'react'

type EditableTextBoxProps = {
  value: string;
}


function EditableTextBox({
  value
}: EditableTextBoxProps) {
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseEnter() {
    setIsHovered(true);
  }

  function handleMouseLeave() {
    setIsHovered(false);
  }

  // TODO: span has no semantic meaning but it is in-line. review tradeoffs or
  // implement a mechanism to return different HTML elements epending on the 
  // content (i.e. p, span, etc.)
  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={isHovered ? { border: "2px solid red" } : {}}
    >
      {value}
    </span>
  );
};

export default EditableTextBox;