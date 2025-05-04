
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const ColorPicker = React.forwardRef(({ id, label, value, onChange, className, ...props }, ref) => {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {label && <Label htmlFor={id} className="shrink-0">{label}</Label>}
      <Input
        id={id}
        type="color"
        value={value}
        onChange={onChange}
        className="h-10 w-14 p-1 cursor-pointer"
        ref={ref}
        {...props}
      />
       <Input
        type="text"
        value={value}
        onChange={onChange}
        className="h-10 flex-1"
        placeholder="#FFFFFF"
      />
    </div>
  );
});
ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
   