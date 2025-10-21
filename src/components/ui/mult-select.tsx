"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import * as React from "react";

type Option = {
  label: string;
  value: string;
};

interface SelectProps {
  options: Option[];
  value: string | string[]; // string (single) OR array (multi)
  onChange: (value: string | string[]) => void;
  placeholder?: string;
  multiple?: boolean;
}

export function MultiSelect({
  options: initialOptions,
  value,
  onChange,
  placeholder,
  multiple = true,
}: SelectProps) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Option[]>(initialOptions);
  const [search, setSearch] = React.useState("");

  // 🔹 Normalize incoming value into array for internal use
  const internalValue = React.useMemo(
    () => (Array.isArray(value) ? value : value ? [value] : []),
    [value]
  );

  // ✅ Ensure all values have a fallback Option
  const selected = React.useMemo(() => {
    return internalValue.map((val) => {
      const found = options.find((o) => o.value === val);
      return found || { label: val, value: val };
    });
  }, [options, internalValue]);

  const updateValue = (vals: string[]) => {
    if (multiple) {
      onChange(vals);
    } else {
      onChange(vals[0] ?? "");
    }
  };

  const toggleOption = (option: Option) => {
    if (multiple) {
      if (internalValue.includes(option.value)) {
        updateValue(internalValue.filter((v) => v !== option.value));
      } else {
        updateValue([option.value, ...internalValue]); // keep new ones on top
      }
    } else {
      if (internalValue.includes(option.value)) {
        updateValue([]); // deselect if already selected
      } else {
        updateValue([option.value]); // only one allowed
      }
      setOpen(false); // auto close popover for single select
    }
  };

  const addNewOption = () => {
    const newOption = {
      label: search,
      value: search.toLowerCase().replace(/\s+/g, "-"),
    };
    setOptions([newOption, ...options]);
    updateValue(
      multiple ? [newOption.value, ...internalValue] : [newOption.value]
    );
    setSearch("");
    setOpen(false);
  };

  const filteredOptions = React.useMemo(() => {
    const filtered = options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );

    if (multiple) {
      // selected items always on top
      return [
        ...selected.filter((s) =>
          filtered.some((opt) => opt.value === s.value)
        ),
        ...filtered.filter(
          (opt) => !selected.some((s) => s.value === opt.value)
        ),
      ];
    }
    return filtered;
  }, [options, selected, search, multiple]);

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selected.length > 0
              ? multiple
                ? `${selected.length} selected`
                : selected[0]?.label
              : placeholder || "Select..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search or add..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {search ? (
                  <Button
                    variant="ghost"
                    className="w-full justify-start my-0 py-0"
                    onClick={addNewOption}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add &quot;{search}
                    &quot;
                  </Button>
                ) : (
                  "No results found."
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option)}
                    className="flex justify-between"
                  >
                    {option.label}
                    {internalValue.includes(option.value) && (
                      <Check className="h-4 w-4" />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Pills only for multi-select */}
      {multiple && selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selected.map((opt) => (
            <span
              key={opt.value}
              className="flex items-center rounded-md bg-secondary px-2 py-1 text-sm"
            >
              {opt.label}
              <button
                className="ml-1 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => toggleOption(opt)}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
