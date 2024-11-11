// components/ResizableTextarea.tsx
import React, { useRef } from "react";

interface ResizableTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ResizableTextarea: React.FC<ResizableTextareaProps> = ({ value, onChange, ...props }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    e.target.style.height = "auto"; // Reset the height
    e.target.style.height = `${e.target.scrollHeight}px`; // Set to scroll height
    onChange(e); // Call the passed-in onChange to manage the value outside
  };

  return (
    <textarea
      ref={textareaRef}
      rows={1}
      value={value}
      onChange={handleResize}
      {...props}
    />
  );
};

export default ResizableTextarea;