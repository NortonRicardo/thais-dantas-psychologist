'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

type CarouselApi = { scrollNext: () => void; scrollPrev: () => void }

type CarouselContextProps = {
  currentIndex: number
  total: React.MutableRefObject<number>
  scrollPrev: () => void
  scrollNext: () => void
  loop: boolean
}

const CarouselContext = React.createContext<CarouselContextProps | null>(null)

function useCarousel() {
  const ctx = React.useContext(CarouselContext)
  if (!ctx) throw new Error('useCarousel must be used within <Carousel />')
  return ctx
}

type CarouselProps = {
  opts?: { loop?: boolean }
  setApi?: (api: CarouselApi) => void
  className?: string
  children: React.ReactNode
}

function Carousel({ opts, setApi, className, children }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const total = React.useRef(0)
  const loop = opts?.loop ?? false

  const scrollPrev = React.useCallback(() => {
    setCurrentIndex(i => (i === 0 ? (loop ? total.current - 1 : 0) : i - 1))
  }, [loop])

  const scrollNext = React.useCallback(() => {
    setCurrentIndex(i => (i >= total.current - 1 ? (loop ? 0 : i) : i + 1))
  }, [loop])

  React.useEffect(() => {
    setApi?.({ scrollNext, scrollPrev })
  }, [setApi, scrollNext, scrollPrev])

  return (
    <CarouselContext.Provider value={{ currentIndex, total, scrollPrev, scrollNext, loop }}>
      <div className={cn('relative px-14', className)} role="region" aria-roledescription="carousel">
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

function CarouselContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { currentIndex, total } = useCarousel()
  const items = React.Children.toArray(children)
  total.current = items.length

  return (
    /*
     * overflow-x: clip  →  clips horizontally WITHOUT creating a scroll context,
     *                       so overflow-y stays visible → scale is never clipped vertically.
     * py-8 / -my-8      →  creates vertical breathing room for the scale effect.
     */
    <div className="-my-8 py-8 -mx-4 px-4" style={{ overflowX: 'clip' }}>
      <div
        className={cn('flex transition-transform duration-500 ease-in-out', className)}
        style={{ transform: `translateX(calc(${-currentIndex} * var(--slide-w, 0px)))` }}
      >
        {items}
      </div>
    </div>
  )
}

function CarouselItem({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      el.parentElement?.style.setProperty('--slide-w', `${el.offsetWidth}px`)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0', className)}
    >
      {children}
    </div>
  )
}

function CarouselPrevious({ className }: { className?: string }) {
  const { scrollPrev } = useCarousel()
  return (
    <button
      onClick={scrollPrev}
      aria-label="Slide anterior"
      className={cn(
        'absolute left-0 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-gray-50',
        className,
      )}
    >
      <ArrowLeft className="size-4" />
    </button>
  )
}

function CarouselNext({ className }: { className?: string }) {
  const { scrollNext } = useCarousel()
  return (
    <button
      onClick={scrollNext}
      aria-label="Próximo slide"
      className={cn(
        'absolute right-0 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full border bg-white shadow-sm transition-colors hover:bg-gray-50',
        className,
      )}
    >
      <ArrowRight className="size-4" />
    </button>
  )
}

export { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi }
