'use client'

import { useCallback, useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { extractBgColorKey } from '@/lib/project-taxonomy-styles'
import { readApiError } from '@/lib/read-api-error'
import {
  ProjectThemeDialog,
  type ProjectThemeRow,
} from './project-theme-dialog'

const PAGE_SIZE = 10

function buildPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3)
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

export function ProjectThemesTable() {
  const [rows, setRows] = useState<ProjectThemeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<ProjectThemeRow | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchThemes = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/project-themes')
      if (!res.ok) {
        toast.error(await readApiError(res))
        return
      }
      const data = await res.json()
      setRows(
        data.map(
          (r: {
            id: string
            name: string
            slug: string
            color: string
            updatedAt: string | Date
          }) => ({
            id: r.id,
            name: r.name,
            slug: r.slug,
            color: r.color,
            updatedAt:
              typeof r.updatedAt === 'string'
                ? r.updatedAt
                : new Date(r.updatedAt).toISOString(),
          })
        )
      )
    } catch {
      toast.error('Não foi possível carregar os temas.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchThemes()
  }, [fetchThemes])

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/project-themes/${deleteTarget.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        toast.error(await readApiError(res))
        return
      }
      toast.success('Tema removido.')
      setDeleteTarget(null)
      await fetchThemes()
    } catch {
      toast.error('Não foi possível remover o tema.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const totalPages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const paged = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pages = buildPages(page, totalPages)

  return (
    <div className="space-y-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-white/90">Temas</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Etiquetas transversais (Clima, Matemática, …) e filtro na página
            pública de projetos.
          </p>
        </div>
        <div className="flex shrink-0 self-end sm:self-start sm:pt-0.5">
          <ProjectThemeDialog onSuccess={fetchThemes} />
        </div>
      </div>

      <div
        className="w-full overflow-x-auto rounded-xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)',
        }}
      >
        <Table className="min-w-[720px] [table-layout:fixed]">
          <TableHeader>
            <TableRow
              className="border-white/[0.07] hover:bg-transparent"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[32%]">
                Nome
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[22%]">
                Slug
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[26%]">
                Cor
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[20%] text-right">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i} className="border-white/[0.07]">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full bg-white/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}

            {!loading && rows.length === 0 && (
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-sm text-white/30"
                >
                  Nenhum tema cadastrado ainda.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              paged.map(row => (
                <TableRow
                  key={row.id}
                  className="border-white/[0.07] transition-colors hover:bg-white/[0.04]"
                >
                  <TableCell className="font-medium text-white/90 max-w-[200px]">
                    <span className="line-clamp-2">{row.name}</span>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-white/50">
                    {row.slug}
                  </TableCell>
                  <TableCell className="text-sm text-white/55">
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-4 w-4 shrink-0 rounded-full ${extractBgColorKey(row.color)}`}
                      />
                      <span className="text-xs text-white/40 line-clamp-1">
                        {extractBgColorKey(row.color)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <ProjectThemeDialog theme={row} onSuccess={fetchThemes} />

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/50 hover:text-rose-400 hover:bg-rose-400/10"
                        onClick={() => setDeleteTarget(row)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={open => {
          if (!open && !deleteLoading) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent className="bg-[#071525] border-white/10 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Remover tema?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              {deleteTarget ? (
                <>
                  &ldquo;{deleteTarget.name}&rdquo; será removido
                  permanentemente.
                </>
              ) : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleteLoading}
              className="bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
            >
              Cancelar
            </AlertDialogCancel>
            <Button
              className="border border-rose-500/30 bg-rose-500/15 text-rose-300 hover:bg-rose-500/25"
              loading={deleteLoading}
              loadingLabel="Removendo…"
              onClick={() => void handleConfirmDelete()}
            >
              Remover
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={e => {
                  e.preventDefault()
                  setPage(p => Math.max(1, p - 1))
                }}
                aria-disabled={page === 1}
                className={
                  page === 1
                    ? 'pointer-events-none opacity-40'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }
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
                    onClick={e => {
                      e.preventDefault()
                      setPage(p)
                    }}
                    className={
                      p === page
                        ? 'bg-orange-800 text-orange-50 border-0 hover:bg-orange-700'
                        : 'text-white/60 hover:text-white hover:bg-white/10 border-0'
                    }
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={e => {
                  e.preventDefault()
                  setPage(p => Math.min(totalPages, p + 1))
                }}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages
                    ? 'pointer-events-none opacity-40'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
