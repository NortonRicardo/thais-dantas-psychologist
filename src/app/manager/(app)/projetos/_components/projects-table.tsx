'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { ImageIcon, Search, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

import { FilterCombobox } from '@/components/filter-combobox'
import { Badge } from '@/components/ui/badge'
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
import { readApiError } from '@/lib/read-api-error'
import { ProjectDialog, type ProjectRow } from './project-dialog'

const PAGE_SIZE = 10

function buildPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3)
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    month: 'short',
    year: 'numeric',
  })
}

export function ProjectsTable() {
  const [rows, setRows] = useState<ProjectRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filterTitle, setFilterTitle] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterTheme, setFilterTheme] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<ProjectRow | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/projects')
      if (!res.ok) {
        toast.error(await readApiError(res))
        return
      }
      const data = await res.json()
      setRows(data)
    } catch {
      toast.error('Não foi possível carregar os projetos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    setDeleteLoading(true)
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        toast.error(await readApiError(res))
        return
      }
      toast.success('Projeto removido.')
      setDeleteTarget(null)
      await fetchProjects()
    } catch {
      toast.error('Não foi possível remover o projeto.')
    } finally {
      setDeleteLoading(false)
    }
  }

  const categoryOptions = [...new Set(rows.map(r => r.category))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  )
  const themeOptions = [...new Set(rows.flatMap(r => r.themes))].sort((a, b) =>
    a.localeCompare(b, 'pt-BR')
  )

  const filtered = rows.filter(row => {
    if (
      filterTitle &&
      !row.title.toLowerCase().includes(filterTitle.toLowerCase())
    )
      return false
    if (filterCategory && row.category !== filterCategory) return false
    if (filterTheme && !row.themes.includes(filterTheme)) return false
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const pages = buildPages(page, totalPages)

  function handleFilterChange(setter: (v: string) => void) {
    return (v: string) => {
      setter(v)
      setPage(1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold text-white/90">Projetos</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Gerencie pesquisas, TCCs, dissertações e plataformas do laboratório.
          </p>
        </div>
        <div className="flex shrink-0 self-end sm:self-start sm:pt-0.5">
          <ProjectDialog onSuccess={fetchProjects} />
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
        <div className="relative flex-1">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Filtrar por título…"
            value={filterTitle}
            onChange={e => handleFilterChange(setFilterTitle)(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-8 pr-8 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/20"
          />
          {filterTitle && (
            <button
              type="button"
              onClick={() => handleFilterChange(setFilterTitle)('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <FilterCombobox
          value={filterCategory}
          onChange={handleFilterChange(setFilterCategory)}
          placeholder="Todas as categorias"
          clearLabel="Limpar categoria"
          options={categoryOptions}
          width="w-52"
        />

        <FilterCombobox
          value={filterTheme}
          onChange={handleFilterChange(setFilterTheme)}
          placeholder="Todos os temas"
          clearLabel="Limpar tema"
          options={themeOptions}
          width="w-56"
        />
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
        <Table className="min-w-[900px] [table-layout:fixed]">
          <TableHeader>
            <TableRow
              className="border-white/[0.07] hover:bg-transparent"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[45%]">
                Título
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[18%]">
                Categoria
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[25%]">
                Período
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[12%] text-right">
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
                  Nenhum projeto cadastrado ainda.
                </TableCell>
              </TableRow>
            )}

            {!loading && rows.length > 0 && filtered.length === 0 && (
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableCell
                  colSpan={4}
                  className="py-12 text-center text-sm text-white/30"
                >
                  Nenhum projeto corresponde aos filtros.
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
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                        {row.imageMimeType ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={`/api/projects/${row.id}/image?t=${new Date(row.updatedAt).getTime()}`}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <ImageIcon size={14} className="text-white/20" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 overflow-hidden">
                        <div className="truncate text-sm">{row.title}</div>
                        <div className="truncate text-[0.68rem] text-white/35">
                          {[
                            row.advisorName,
                            row.coAdvisorName,
                            row.researchLeadName,
                            ...row.authors,
                          ]
                            .filter(
                              (n, i, a): n is string =>
                                !!n && a.indexOf(n) === i
                            )
                            .join(', ') || '—'}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={`border text-[0.65rem] uppercase tracking-wide ${row.categoryBadgeClass}`}
                    >
                      {row.category}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-white/45">
                    {formatDateShort(row.startDate)}
                    {row.endDate
                      ? ` → ${formatDateShort(row.endDate)}`
                      : ' · Em andamento'}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <ProjectDialog project={row} onSuccess={fetchProjects} />
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
            <AlertDialogTitle>Remover projeto?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              {deleteTarget ? (
                <>
                  &ldquo;{deleteTarget.title}&rdquo; será removido
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
