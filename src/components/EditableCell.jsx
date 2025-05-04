
    import React, { useState, useEffect } from 'react';
    import { Input } from '@/components/ui/input';
    import { cn } from '@/lib/utils';

    function EditableCell({ value: initialValue, onSave, type = 'text', inputClassName, displayClassName, currencySymbol = '' }) {
      const [isEditing, setIsEditing] = useState(false);
      const [value, setValue] = useState(initialValue);

      // Update local state if the external value changes (e.g., after data refresh)
      useEffect(() => {
        setValue(initialValue);
      }, [initialValue]);

      const handleSave = () => {
        setIsEditing(false);
        // Only call save if the value actually changed
        if (value !== initialValue) {
          onSave(value);
        }
      };

      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
          handleSave();
        } else if (e.key === 'Escape') {
          setValue(initialValue); // Revert changes on Escape
          setIsEditing(false);
        }
      };

      const handleChange = (e) => {
         if (type === 'number') {
            const numValue = e.target.value;
            // Allow empty string, decimal point, and numbers
             if (numValue === '' || /^-?\d*\.?\d*$/.test(numValue)) {
                setValue(numValue);
             }
         } else {
             setValue(e.target.value);
         }
      };

      const handleBlur = () => {
        // Delay slightly to allow Enter key press to register first if needed
        setTimeout(() => {
          // Check if still editing before saving on blur
          if (isEditing) {
             handleSave();
          }
        }, 100);
      };

      const formattedDisplayValue = () => {
        if (type === 'number' && !isNaN(parseFloat(initialValue))) {
          return `${currencySymbol}${parseFloat(initialValue).toFixed(2)}`;
        }
        return `${currencySymbol}${initialValue}`;
      };

      return (
        <div onClick={() => !isEditing && setIsEditing(true)} className="cursor-pointer min-h-[40px] flex items-center justify-end">
          {isEditing ? (
            <Input
              type={type}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              autoFocus
              className={cn('h-8 text-right p-1', inputClassName)}
            />
          ) : (
            <span className={cn('p-1', displayClassName)}>
              {formattedDisplayValue()}
            </span>
          )}
        </div>
      );
    }

    export default EditableCell;
  