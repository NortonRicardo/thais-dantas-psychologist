'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  COLOR_OPTIONS,
  type AppColorOption,
} from '@/components/constants/colors'
import { cn } from '@/lib/utils'

const DEFAULT_TOP_COUNT = 22

type ColorSelectorProps = {
  value: string
  onChange: (key: string) => void
  options?: AppColorOption[]
  topCount?: number
}

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = React.useState<number | undefined>(undefined)
  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setWidth(el.offsetWidth)
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [ref])
  return width
}

function ColorButton({
  option,
  selected,
  onClick,
  className,
}: {
  option: AppColorOption
  selected: boolean
  onClick: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative size-8 rounded-full transition focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        option.className,
        selected &&
          'ring-3 ring-lime-800 dark:ring-lime-400 dark:ring-2 scale-110',
        className
      )}
      aria-pressed={selected}
      aria-label={`Cor ${option.key}`}
      title={option.key}
    >
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Check className="size-4 text-white stroke-3 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]" />
        </span>
      )}
    </button>
  )
}

function ColorDropdownGrid({
  value,
  onChange,
  keys,
  optionByKey,
}: {
  value: string
  onChange: (key: string) => void
  keys: string[]
  optionByKey: Map<string, AppColorOption>
}) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const width = useContainerWidth(containerRef)
  const [open, setOpen] = React.useState(false)

  return (
    <div ref={containerRef}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="mt-2 h-8 w-full rounded-md border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
          >
            Outras cores
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          sideOffset={6}
          className="max-h-[min(70vh,var(--radix-dropdown-menu-content-available-height))] overflow-hidden border border-white/10 bg-[#071525] p-0 text-white shadow-xl"
          style={{ width }}
        >
          <div className="grid grid-cols-12 gap-2 p-2">
            {keys.map(key => {
              const opt = optionByKey.get(key)
              if (!opt) return null
              return (
                <ColorButton
                  key={key}
                  option={opt}
                  selected={value === key}
                  onClick={() => {
                    onChange(key)
                    setOpen(false)
                  }}
                />
              )
            })}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

export function ColorSelector({
  value,
  onChange,
  options = COLOR_OPTIONS,
  topCount = DEFAULT_TOP_COUNT,
}: ColorSelectorProps) {
  const allKeys = React.useMemo(() => options.map(o => o.key), [options])
  const baseTop = React.useMemo(
    () => allKeys.slice(0, Math.min(topCount, allKeys.length)),
    [allKeys, topCount]
  )
  const displayedTop = React.useMemo(() => {
    if (value && !baseTop.includes(value)) return [value, ...baseTop]
    return [...baseTop]
  }, [baseTop, value])
  const restKeys = React.useMemo(
    () => allKeys.filter(k => !displayedTop.includes(k)),
    [allKeys, displayedTop]
  )
  const optionByKey = React.useMemo(() => {
    const map = new Map<string, AppColorOption>()
    for (const opt of options) map.set(opt.key, opt)
    return map
  }, [options])

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-12 gap-2 pb-2">
        {displayedTop.map(key => {
          const opt = optionByKey.get(key)
          if (!opt) return null
          return (
            <ColorButton
              key={key}
              option={opt}
              selected={value === key}
              onClick={() => onChange(key)}
            />
          )
        })}
      </div>
      {restKeys.length > 0 && (
        <ColorDropdownGrid
          value={value}
          onChange={onChange}
          keys={restKeys}
          optionByKey={optionByKey}
        />
      )}
    </div>
  )
}

export type { AppColorOption }
