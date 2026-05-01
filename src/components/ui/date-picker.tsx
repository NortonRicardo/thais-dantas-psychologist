'use client'

import * as React from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ptBR } from 'react-day-picker/locale'
import { formatDateLong } from '@/lib/date-utils'
import { cn } from '@/lib/utils'

/** Converte yyyy-mm-dd para Date (meio do dia local, evita mudança por fuso). */
function parseYmd(ymd: string): Date | undefined {
  if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return undefined
  const [y, m, d] = ymd.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return isNaN(date.getTime()) ? undefined : date
}

/** Converte Date para yyyy-mm-dd (local). */
function dateToYmd(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

type DatePickerProps = {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  placeholder?: string
  className?: string
}

export function DatePicker({
  value,
  onChange,
  disabled,
  placeholder = 'Selecione a data',
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const selectedDate = parseYmd(value)
  const startMonth = new Date(1970, 0)

  function handleSelect(date: Date | undefined) {
    if (date) {
      onChange(dateToYmd(date))
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-empty={!value}
          disabled={disabled}
          className={cn(
            'h-10 w-full justify-start text-left font-normal rounded-lg border-border/50 bg-muted/30 hover:bg-muted/50',
            'data-[empty=true]:text-muted-foreground',
            className
          )}
        >
          {value && selectedDate ? (
            formatDateLong(selectedDate)
          ) : (
            <span>{placeholder}</span>
          )}
          <CalendarIcon className="ml-auto size-4 shrink-0 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          defaultMonth={selectedDate}
          captionLayout="dropdown"
          startMonth={startMonth}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  )
}
