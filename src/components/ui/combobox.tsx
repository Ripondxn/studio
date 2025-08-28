
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "./input"

type ComboboxProps = {
    options?: { value: string; label: string }[];
    value: string;
    onSelect: (value: string, label?: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function Combobox({ options = [], value, onSelect, placeholder, disabled }: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")

  const selectedOption = options.find((option) => 
    (option.value?.toLowerCase() === value?.toLowerCase())
  );
  
  React.useEffect(() => {
    setInputValue(selectedOption?.label || value || '')
  }, [value, selectedOption])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
          disabled={disabled}
        >
          <span className="truncate">
            {selectedOption?.label || value || placeholder || "Select option..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput 
            placeholder="Search or enter new..."
            value={inputValue}
            onValueChange={setInputValue}
           />
          <CommandList>
            <CommandEmpty onSelect={() => {
                onSelect(inputValue, inputValue)
                setOpen(false)
            }}>
                <div 
                    className="py-2 px-4 text-sm cursor-pointer hover:bg-accent"
                    onClick={() => {
                         onSelect(inputValue, inputValue)
                         setOpen(false)
                    }}
                >
                    Add new: "{inputValue}"
                </div>
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={(currentLabel) => {
                    const selected = options.find(opt => opt.label.toLowerCase() === currentLabel.toLowerCase())
                    onSelect(selected?.value || currentLabel, selected?.label || currentLabel)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
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
  )
}
