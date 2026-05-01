import Link from 'next/link'

export function PublicFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-12 sm:px-6 sm:py-16 md:px-8">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-10 text-center sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:text-left">
        <Link
          href="/"
          className="inline-flex shrink-0 rounded-md outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          aria-label="LEMM — home page"
        >
          <span className="text-lg font-black tracking-[0.35em] text-white sm:text-xl md:tracking-[6px]">
            LEMM
          </span>
        </Link>
        <div className="flex min-w-0 w-full flex-col items-center gap-5 sm:items-end sm:gap-4">
          <p className="max-w-[20rem] text-[10px] leading-relaxed tracking-wider text-white/40 sm:max-w-none sm:text-xs">
            LEMM © 2026. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  )
}
