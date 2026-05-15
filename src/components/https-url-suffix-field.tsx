'use client'

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import { stripUrlScheme } from '@/lib/url-https'
import { cn } from '@/lib/utils'

type Props = {
  id: string
  value: string
  onChange: (suffix: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  inputClassName?: string
}

export function HttpsUrlSuffixField({
  id,
  value,
  onChange,
  placeholder = 'exemplo.org/caminho',
  disabled,
  className,
  inputClassName,
}: Props) {
  return (
    <InputGroup
      className={cn(
        'h-auto min-h-10 border-white/10 bg-white/5 shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-white/30 has-[[data-slot=input-group-control]:focus-visible]:ring-0',
        disabled && 'pointer-events-none opacity-60',
        className
      )}
    >
      <InputGroupAddon
        align="inline-start"
        className="shrink-0 border-r border-white/10 py-2 pl-3 pr-2 text-white/45"
      >
        <InputGroupText className="text-white/50">{'https://'}</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        value={value}
        disabled={disabled}
        onChange={e => onChange(stripUrlScheme(e.target.value))}
        placeholder={placeholder}
        inputMode="url"
        autoComplete="url"
        className={cn(
          'min-h-10 py-2 text-white placeholder:text-white/30',
          inputClassName
        )}
      />
    </InputGroup>
  )
}
