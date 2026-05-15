'use client'

import {
  speakerAvatarInitials,
  teamMemberPhotoSrc,
} from '@/lib/events-speaker-display'
import { cn } from '@/lib/utils'

export function TeamMemberThumb({
  memberId,
  displayName,
  photoMimeType,
  updatedAtIso,
  sizePx,
  frameClassName,
}: {
  memberId: string
  displayName: string
  photoMimeType: string | null | undefined
  updatedAtIso?: string | null
  sizePx: number
  /** Classes do anel (borda / fundo). */
  frameClassName?: string
}) {
  const src = teamMemberPhotoSrc({
    memberId,
    photoMimeType,
    cacheBustMs:
      updatedAtIso != null ? new Date(updatedAtIso).getTime() : undefined,
  })

  const ring = cn(
    'shrink-0 overflow-hidden rounded-full border object-cover',
    frameClassName ?? 'border-white/15 bg-white/10'
  )

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        width={sizePx}
        height={sizePx}
        className={ring}
        style={{ width: sizePx, height: sizePx }}
      />
    )
  }

  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full border font-semibold uppercase tracking-wide text-white/75',
        frameClassName ?? 'border-white/15 bg-white/10'
      )}
      style={{
        width: sizePx,
        height: sizePx,
        fontSize: Math.max(10, Math.round(sizePx * 0.38)),
      }}
      aria-hidden
    >
      {speakerAvatarInitials(displayName)}
    </span>
  )
}
