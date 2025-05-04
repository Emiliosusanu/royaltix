
    import React, { useState } from 'react';
    import { Check, ChevronsUpDown, X } from 'lucide-react';
    import { cn } from '@/lib/utils';
    import { Button } from '@/components/ui/button';
    import {
      Command,
      CommandEmpty,
      CommandGroup,
      CommandInput,
      CommandItem,
      CommandList,
    } from '@/components/ui/command';
    import {
      Popover,
      PopoverContent,
      PopoverTrigger,
    } from '@/components/ui/popover';
    import { Badge } from '@/components/ui/badge';

    function MultiSelect({ options, selected, onChange, className, placeholder = "Select options..." }) {
      const [open, setOpen] = useState(false);

      const handleSelect = (value) => {
        onChange(
          selected.includes(value)
            ? selected.filter((item) => item !== value)
            : [...selected, value]
        );
      };

      const selectedOptions = options.filter(option => selected.includes(option.value));

      return (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn("w-full justify-between h-auto min-h-10", className)}
            >
              <div className="flex gap-1 flex-wrap">
                {selectedOptions.length > 0 ? (
                  selectedOptions.map((option) => (
                    <Badge
                      key={option.value}
                      variant="secondary"
                      className="mr-1 mb-1"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent popover from closing
                        handleSelect(option.value);
                      }}
                    >
                      {option.label}
                      <X className="ml-1 h-3 w-3 cursor-pointer" />
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground">{placeholder}</span>
                )}
              </div>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
            <Command>
              <CommandInput placeholder="Search options..." />
              <CommandList>
                <CommandEmpty>No options found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label} // Use label for search filtering in cmdk
                      onSelect={() => {
                        handleSelect(option.value);
                        // Optionally keep popover open: setOpen(true);
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          selected.includes(option.value) ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      );
    }

    export { MultiSelect };
  