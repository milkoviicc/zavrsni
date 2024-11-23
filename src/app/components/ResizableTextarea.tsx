// components/ResizableTextarea.tsx
import React, { useEffect, useRef } from "react";

interface ResizableTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}
const ResizableTextarea: React.FC<ResizableTextareaProps> = ({ value, onChange, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Resize effect to set the height whenever the value changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset the height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set to the scroll height
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={value}
      onChange={(e) => {
        onChange(e); // Call the passed-in onChange to manage the value outside
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto"; // Reset height to auto
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Adjust to scroll height
        }
      }}
      {...props}
      style={{ overflowY: "auto", resize: "none", maxHeight: "150px" }} // Prevent manual resizing
    />
  );
};

export default ResizableTextarea;