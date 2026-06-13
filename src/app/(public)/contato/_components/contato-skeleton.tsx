import { Skeleton } from '@/components/ui/skeleton'

export function ContatoSkeleton() {
  return (
    <>
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-white/15 pb-5 pt-10">
        <Skeleton className="h-3 w-16 bg-white/10" />
        <Skeleton className="h-3 w-28 bg-white/10" />
      </div>

      {/* Heading */}
      <div className="py-8">
        <Skeleton className="h-14 w-64 bg-white/10" />
        <Skeleton className="mt-4 h-4 w-96 bg-white/10" />
        <Skeleton className="mt-2 h-4 w-72 bg-white/10" />
      </div>

      {/* Grid */}
      <div className="grid flex-1 grid-cols-1 gap-px border-t border-white/15 sm:grid-cols-2">

        {/* Channels skeleton */}
        <div className="flex flex-col gap-0 py-6 sm:pr-10">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-white/10 py-4 last:border-b-0">
              <Skeleton className="size-7 shrink-0 rounded-full bg-white/10" />
              <Skeleton className="h-3 w-16 bg-white/10" />
              <Skeleton className="h-3 flex-1 bg-white/10" />
            </div>
          ))}
        </div>

        {/* Location skeleton */}
        <div className="flex flex-col py-6 sm:border-l sm:border-white/15 sm:px-8">
          <Skeleton className="h-3 w-20 bg-white/10" />
          <Skeleton className="mt-3 h-7 w-32 bg-white/10" />
          <Skeleton className="mt-2 h-3 w-48 bg-white/10" />
          <Skeleton className="mt-1 h-3 w-40 bg-white/10" />
          <Skeleton className="mt-5 flex-1 rounded-xl bg-white/10" style={{ minHeight: '280px' }} />
          <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-4">
            <Skeleton className="size-3 rounded-full bg-white/10" />
            <Skeleton className="h-3 w-40 bg-white/10" />
          </div>
        </div>

      </div>
    </>
  )
}
