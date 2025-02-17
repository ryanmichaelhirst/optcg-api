"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import React, { useState } from "react"
import invariant from "tiny-invariant"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  getOptionByLabel,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  type PopoverContentProps,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/utils"

export type ComboBoxOption = {
  label: string
  value: string
  disabled?: boolean
  icon?: () => React.ReactElement<any>
}

// Only one of "value" or "defaultValue" can be provided
// OR neither can be provided
type ValueProps =
  | { value: string; defaultValue?: never }
  | { defaultValue: string; value?: never }
  | { value?: never; defaultValue?: never }

export type ComboBoxProps = {
  dialogRef?: React.RefObject<HTMLElement>
  options: ComboBoxOption[]
  onChange?: (value: string) => void
  disabled?: boolean
  inputValue?: string
  onInputChange?: (value: string) => void
  placeholders?: {
    button?: string
    input?: string
  }
  classes?: {
    button?: string
    popoverContent?: string
  }
  popoverProps?: PopoverContentProps
  dataTestId?: string
  serverSideSearch?: boolean
} & ValueProps

export function ComboBox(props: ComboBoxProps) {
  const [open, setOpen] = useState(false)
  const [stateValue, setStateValue] = useState("")

  const value = props.value ?? stateValue

  // prettier-ignore
  if (typeof props.value === "string" && typeof props.defaultValue === "string") {
    throw new Error('<ComboBox />: Only one of "value" or "defaultValue" can be provided');
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-full justify-between whitespace-normal text-left",
            props.classes?.button ?? "w-[200px]",
          )}
          style={{ overflowWrap: "anywhere" }}
          disabled={props.disabled}
          data-testid={props.dataTestId ?? "dropdown"}
        >
          {value
            ? props.options.find((opt) => opt.value === value)?.label ??
              props.placeholders?.button ??
              ""
            : props.placeholders?.button ?? ""}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn("p-0", props.classes?.popoverContent ?? "w-[200px]")}
        side={props.popoverProps?.side ?? "bottom"}
        align={props.popoverProps?.align ?? "start"}
        // Needed to fix an issue where ScrollArea does not work inside of a Dialog
        // Fix: https://github.com/shadcn-ui/ui/issues/922
        // Related: https://github.com/radix-ui/primitives/issues/1159
        container={props.dialogRef?.current === null ? undefined : props.dialogRef?.current}
      >
        <Command
          // serverSideSearch defaults to null, which means by default we allow
          // combobox to filter user input against its options. When serverSideSearch
          // is true, however, we disable filter because it breaks server-returned options
          // https://github.com/shadcn-ui/ui/issues/1391
          shouldFilter={!props.serverSideSearch}
          className="max-w-xl"
        >
          <CommandInput
            placeholder={props.placeholders?.input}
            value={props.inputValue}
            onValueChange={props.onInputChange}
          />
          <CommandList>
            <CommandEmpty>No option found.</CommandEmpty>
            <ScrollArea className={cn(props.options.length > 5 && "h-40")}>
              <CommandGroup>
                {props.options.map((opt) => (
                  <CommandItem
                    key={opt.value}
                    disabled={opt.disabled}
                    className={cn("space-x-3 whitespace-normal", opt.disabled && "opacity-50")}
                    style={{ overflowWrap: "anywhere" }}
                    onSelect={(optionLabel) => {
                      console.log("onSelect", optionLabel, props.options)
                      const selectedValue = getOptionByLabel(props.options, optionLabel)?.value
                      invariant(selectedValue != null)
                      const newValue = selectedValue === value ? "" : selectedValue

                      setStateValue(newValue)
                      setOpen(false)
                      props.onChange?.(newValue)
                    }}
                  >
                    <Check
                      className={cn("h-4 w-4", value === opt.value ? "opacity-100" : "opacity-0")}
                    />
                    {opt.icon ? opt.icon() : null}
                    <span>{opt.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export const BASE_OPTIONS = [{ label: "All", value: "all" }]
