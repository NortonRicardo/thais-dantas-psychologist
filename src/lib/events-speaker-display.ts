import { teamMemberDisplayName } from '@/lib/team-member-display'

/** Iniciais para avatar quando não há foto (nome do palestrante). */
export function speakerAvatarInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) {
    const w = parts[0].toLocaleUpperCase('pt-BR')
    return w.slice(0, Math.min(2, w.length))
  }
  const a = parts[0].charAt(0)
  const b = parts[parts.length - 1].charAt(0)
  return (a + b).toLocaleUpperCase('pt-BR')
}

/** Nome do palestrante a partir do join com `team_members` + prefixo. */
export function eventSpeakerDisplayName(row: {
  speakerMemberName: string | null
  speakerPrefixLabel: string | null
}): string | null {
  if (!row.speakerMemberName) return null
  return teamMemberDisplayName(row.speakerMemberName, row.speakerPrefixLabel)
}

/** URL da foto do membro (`/api/team/:id/photo`), ou null se não houver imagem. */
export function teamMemberPhotoSrc(options: {
  memberId: string | null | undefined
  photoMimeType: string | null | undefined
  cacheBustMs?: number | null
}): string | null {
  const { memberId, photoMimeType, cacheBustMs } = options
  if (!memberId || !photoMimeType) return null
  const t =
    cacheBustMs != null && !Number.isNaN(cacheBustMs) ? `?t=${cacheBustMs}` : ''
  return `/api/team/${memberId}/photo${t}`
}
