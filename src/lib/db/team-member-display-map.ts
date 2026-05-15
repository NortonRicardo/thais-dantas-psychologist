import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { teamMembers, teamNamePrefixes } from '@/lib/db/schema'
import { teamMemberDisplayName } from '@/lib/team-member-display'

/** Mapa id → nome público (tratamento + nome) para projetos e contato. */
export async function fetchTeamMembersDisplayMap(): Promise<Record<string, string>> {
  const rows = await db
    .select({
      id: teamMembers.id,
      name: teamMembers.name,
      namePrefixLabel: teamNamePrefixes.label,
    })
    .from(teamMembers)
    .leftJoin(teamNamePrefixes, eq(teamMembers.namePrefixId, teamNamePrefixes.id))

  return Object.fromEntries(
    rows.map(r => [r.id, teamMemberDisplayName(r.name, r.namePrefixLabel)])
  )
}
