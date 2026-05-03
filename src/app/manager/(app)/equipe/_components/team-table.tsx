'use client'

import { useCallback, useEffect, useState } from 'react'
import { ImageIcon, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { TeamDialog, type TeamMemberRow } from './team-dialog'

const PAGE_SIZE = 10

const CATEGORY_COLORS: Record<string, string> = {
  professores: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  colaboradores: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  convidados: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
}

const CATEGORY_LABELS: Record<string, string> = {
  professores: 'Professor',
  colaboradores: 'Colaborador',
  convidados: 'Convidado',
}

function buildPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3)
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

export function TeamTable() {
  const [rows, setRows] = useState<TeamMemberRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/team')
      const data = await res.json()
      setRows(data)
    } catch {
      toast.error('Erro ao carregar equipe.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMembers() }, [fetchMembers])

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' })
      toast.success('Membro removido.')
      fetchMembers()
    } catch {
      toast.error('Erro ao remover membro.')
    }
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pages = buildPages(page, totalPages)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <TeamDialog onSuccess={fetchMembers} />
      </div>

      <div
        className="w-full overflow-x-auto rounded-xl"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)',
        }}
      >
        <Table className="min-w-[700px]">
          <TableHeader>
            <TableRow
              className="border-white/[0.07] hover:bg-transparent"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[35%]">
                Nome
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold">
                Categoria
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold">
                Qualificação
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold text-center">
                Ordem
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.07]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full bg-white/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && rows.length === 0 && (
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableCell colSpan={5} className="py-12 text-center text-sm text-white/30">
                  Nenhum membro cadastrado ainda.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paged.map(row => (
                <TableRow
                  key={row.id}
                  className="border-white/[0.07] transition-colors hover:bg-white/[0.04]"
                >
                  <TableCell className="font-medium text-white/90">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                        {row.photoMimeType ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/api/team/${row.id}/photo?t=${new Date(row.updatedAt).getTime()}`}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon size={14} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      <span className="line-clamp-1">{row.name}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`border text-[0.65rem] uppercase tracking-wide ${CATEGORY_COLORS[row.category] ?? 'bg-white/10 text-white/60 border-white/20'}`}
                    >
                      {CATEGORY_LABELS[row.category] ?? row.category}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-white/55">
                    <span className="line-clamp-1">{row.qualification}</span>
                  </TableCell>

                  <TableCell className="text-center text-sm text-white/45">
                    {row.sortOrder}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <TeamDialog member={row} onSuccess={fetchMembers} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white/50 hover:text-rose-400 hover:bg-rose-400/10"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-[#071525] border-white/10 text-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover membro?</AlertDialogTitle>
                            <AlertDialogDescription className="text-white/50">
                              &ldquo;{row.name}&rdquo; será removido permanentemente.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white">
                              Cancelar
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-rose-500/15 text-rose-300 border border-rose-500/30 hover:bg-rose-500/25"
                              onClick={() => handleDelete(row.id)}
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => { e.preventDefault(); setPage(p => Math.max(1, p - 1)) }}
                aria-disabled={page === 1}
                className={page === 1 ? 'pointer-events-none opacity-40' : 'text-white/60 hover:text-white hover:bg-white/10'}
              />
            </PaginationItem>
            {pages.map((p, i) =>
              p === 'ellipsis' ? (
                <PaginationItem key={`e-${i}`}>
                  <PaginationEllipsis className="text-white/30" />
                </PaginationItem>
              ) : (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={p === page}
                    onClick={e => { e.preventDefault(); setPage(p) }}
                    className={p === page ? 'bg-orange-800 text-orange-50 border-0 hover:bg-orange-700' : 'text-white/60 hover:text-white hover:bg-white/10 border-0'}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => { e.preventDefault(); setPage(p => Math.min(totalPages, p + 1)) }}
                aria-disabled={page === totalPages}
                className={page === totalPages ? 'pointer-events-none opacity-40' : 'text-white/60 hover:text-white hover:bg-white/10'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
