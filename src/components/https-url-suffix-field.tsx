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
  /** Modo claro — para uso em modais/fundos claros. */
  light?: boolean
}

export function HttpsUrlSuffixField({
  id,
  value,
  onChange,
  placeholder = 'exemplo.org/caminho',
  disabled,
  className,
  inputClassName,
  light = false,
}: Props) {
  return (
    <InputGroup
      className={cn(
        'h-auto min-h-10 shadow-[0_2px_6px_rgba(0,0,0,0.08)]',
        light
          ? 'border-[#2D2D2D]/15 bg-[#ede8e1] has-[[data-slot=input-group-control]:focus-visible]:border-[#556040]/50 has-[[data-slot=input-group-control]:focus-visible]:ring-0'
          : 'border-white/10 bg-white/5 shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-white/30 has-[[data-slot=input-group-control]:focus-visible]:ring-0',
        disabled && 'pointer-events-none opacity-60',
        className
      )}
    >
      <InputGroupAddon
        align="inline-start"
        className={cn(
          'shrink-0 border-r py-2 pl-3 pr-2',
          light
            ? 'border-[#2D2D2D]/10 text-[#2D2D2D]/40'
            : 'border-white/10 text-white/45'
        )}
      >
        <InputGroupText className={light ? 'text-[#2D2D2D]/45' : 'text-white/50'}>
          {'https://'}
        </InputGroupText>
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
          'min-h-10 py-2',
          light
            ? 'text-[#2D2D2D] placeholder:text-[#2D2D2D]/35'
            : 'text-white placeholder:text-white/30',
          inputClassName
        )}
      />
    </InputGroup>
  )
}
