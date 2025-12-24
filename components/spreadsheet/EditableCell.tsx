
import React, { useState, useEffect, useRef } from 'react';

interface EditableCellProps {
  value: string;
  onSave: (val: string) => void;
  isSelected: boolean;
  onSelect: () => void;
  className?: string;
}

export const EditableCell: React.FC<EditableCellProps> = ({ 
  value, 
  onSave, 
  isSelected, 
  onSelect,
  className = '' 
}) => {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleBlur = () => {
    setEditing(false);
    if (localValue !== value) {
      onSave(localValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
      e.stopPropagation();
    }
    if (e.key === 'Escape') {
      setLocalValue(value);
      setEditing(false);
      e.stopPropagation();
    }
  };

  // Handle "Enter" to start editing when selected
  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (isSelected && !editing && e.key === 'Enter') {
        setEditing(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [isSelected, editing]);

  if (editing) {
    return (
      <input
        ref={inputRef}
        className="absolute inset-0 w-full h-full px-2 outline-none border-2 border-blue-500 bg-white z-40"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
    );
  }

  return (
    <div 
      className={`absolute inset-0 w-full h-full px-2 py-1 flex items-center cursor-cell overflow-hidden whitespace-nowrap select-none text-sm ${
        isSelected ? 'ring-2 ring-blue-500 ring-inset bg-blue-50/30 z-30' : 'hover:bg-gray-50'
      } ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        setEditing(true);
      }}
    >
      {value}
    </div>
  );
};
