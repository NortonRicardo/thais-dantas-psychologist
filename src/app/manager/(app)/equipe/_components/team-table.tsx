'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronDown, ImageIcon, Linkedin, Search, Trash2, FileText, X } from 'lucide-react'
import { toast } from 'sonner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
import {
  teamMemberQualificationFormationLine,
} from '@/lib/team-member-display'
import { TeamDialog, type TeamMemberRow } from './team-dialog'

const PAGE_SIZE = 10

function buildPages(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, 'ellipsis', total]
  if (current >= total - 3)
    return [1, 'ellipsis', total - 4, total - 3, total - 2, total - 1, total]
  return [1, 'ellipsis', current - 1, current, current + 1, 'ellipsis', total]
}

function FilterCombobox({
  value,
  onChange,
  placeholder,
  clearLabel,
  options,
  width = 'w-44',
  renderOption,
  labelForValue,
  renderValue,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  clearLabel: string
  options: string[]
  width?: string
  renderOption?: (opt: string) => React.ReactNode
  /** Quando `value` não é legível (ex.: id), exibir rótulo no botão. */
  labelForValue?: (value: string) => string
  /** Conteúdo customizado do botão quando há valor (ex.: bolinha + título). */
  renderValue?: (value: string) => React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = options.filter(o => {
    const display = labelForValue?.(o) ?? o
    return display.toLowerCase().includes(search.toLowerCase())
  })

  function select(v: string) {
    onChange(v)
    setOpen(false)
    setSearch('')
  }

  const triggerLabel = value ? (labelForValue ? labelForValue(value) : value) : ''

  return (
    <Popover
      open={open}
      onOpenChange={o => {
        setOpen(o)
        if (o) setTimeout(() => inputRef.current?.focus(), 0)
      }}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className={`flex ${width} items-center justify-between rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none hover:bg-white/[0.08] focus:border-white/20`}
        >
          <span
            className={`flex min-w-0 items-center gap-2 ${value ? 'text-white/80' : 'text-white/25'}`}
          >
            {value && renderValue ? (
              renderValue(value)
            ) : value ? (
              <span className="truncate">{triggerLabel}</span>
            ) : (
              <span className="truncate">{placeholder}</span>
            )}
          </span>
          <ChevronDown size={13} className="shrink-0 text-white/30" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={`${width} border-white/10 bg-[#071525] p-0 shadow-xl`}
      >
        <div className="border-b border-white/10 px-2 py-2">
          <div className="relative">
            <Search
              size={12}
              className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 text-white/30"
            />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full rounded-md bg-white/5 py-1.5 pl-7 pr-2 text-sm text-white/80 placeholder:text-white/25 outline-none"
            />
          </div>
        </div>

        <div className="max-h-52 overflow-y-auto p-1">
          <button
            type="button"
            onClick={() => select('')}
            className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${!value ? 'bg-white/10 text-white/90' : 'text-white/50 hover:bg-white/5 hover:text-white/80'}`}
          >
            {placeholder}
          </button>

          {filtered.length === 0 && (
            <p className="py-2 text-center text-xs text-white/25">Nenhum resultado</p>
          )}

          {filtered.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => select(opt)}
              className={`flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-left text-sm transition-colors ${value === opt ? 'bg-white/10 text-white/90' : 'text-white/60 hover:bg-white/5 hover:text-white/80'}`}
            >
              {renderOption ? renderOption(opt) : opt}
            </button>
          ))}
        </div>

        {value && (
          <div className="border-t border-white/10 p-1">
            <button
              type="button"
              onClick={() => select('')}
              className="flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-white/35 transition-colors hover:bg-white/5 hover:text-white/60"
            >
              <X size={11} /> {clearLabel}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

export function TeamTable() {
  const [rows, setRows] = useState<TeamMemberRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [filterName, setFilterName] = useState('')
  const [filterCategoryId, setFilterCategoryId] = useState('')
  const [filterDegree, setFilterDegree] = useState('')

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

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const categoryMeta = useMemo(() => {
    const m = new Map<string, { title: string; color: string }>()
    for (const r of rows) {
      m.set(r.categoryId, { title: r.categoryTitle, color: r.categoryColor })
    }
    return m
  }, [rows])

  const categoryIdsSorted = useMemo(
    () =>
      [...categoryMeta.entries()]
        .sort((a, b) => a[1].title.localeCompare(b[1].title, 'pt-BR'))
        .map(([id]) => id),
    [categoryMeta]
  )

  const degreeOptions = useMemo(
    () =>
      [...new Set(rows.map(r => r.degreeLevelLabel).filter(Boolean) as string[])].sort((a, b) =>
        a.localeCompare(b, 'pt-BR')
      ),
    [rows]
  )

  async function handleDelete(id: string) {
    try {
      await fetch(`/api/team/${id}`, { method: 'DELETE' })
      toast.success('Membro removido.')
      fetchMembers()
    } catch {
      toast.error('Erro ao remover membro.')
    }
  }

  const filtered = rows.filter(row => {
    const q = filterName.trim().toLowerCase()
    if (q) {
      const hay = `${row.displayName} ${row.name}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    if (filterCategoryId && row.categoryId !== filterCategoryId) return false
    if (filterDegree && (row.degreeLevelLabel ?? '') !== filterDegree) return false
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
          <h1 className="text-xl font-semibold text-white/90">Membros</h1>
          <p className="mt-0.5 text-sm text-white/40">
            Cadastro de pessoas exibidas na página pública da equipe.
          </p>
        </div>
        <div className="flex shrink-0 self-end sm:self-start sm:pt-0.5">
          <TeamDialog onSuccess={fetchMembers} />
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-end gap-2">
        <div className="relative w-72 max-w-full min-w-0">
          <Search
            size={13}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            type="text"
            placeholder="Filtrar por nome…"
            value={filterName}
            onChange={e => handleFilterChange(setFilterName)(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-8 pr-8 text-sm text-white/80 placeholder:text-white/25 outline-none focus:border-white/20"
          />
          {filterName ? (
            <button
              type="button"
              onClick={() => handleFilterChange(setFilterName)('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              <X size={13} />
            </button>
          ) : null}
        </div>

        <FilterCombobox
          value={filterCategoryId}
          onChange={handleFilterChange(setFilterCategoryId)}
          placeholder="Todas as categorias"
          clearLabel="Limpar categoria"
          options={categoryIdsSorted}
          width="w-52"
          labelForValue={id => categoryMeta.get(id)?.title ?? id}
          renderValue={id => (
            <>
              <span
                className={`h-1.5 w-1.5 shrink-0 rounded-full ${categoryMeta.get(id)?.color ?? 'bg-white/30'}`}
              />
              <span className="truncate">{categoryMeta.get(id)?.title ?? id}</span>
            </>
          )}
          renderOption={id => {
            const meta = categoryMeta.get(id)
            return (
              <>
                {meta ? (
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${meta.color}`} />
                ) : null}
                {meta?.title ?? id}
              </>
            )
          }}
        />

        <FilterCombobox
          value={filterDegree}
          onChange={handleFilterChange(setFilterDegree)}
          placeholder="Todos os graus"
          clearLabel="Limpar grau"
          options={degreeOptions}
          width="w-48"
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
        <Table className="min-w-[760px] [table-layout:fixed]">
          <TableHeader>
            <TableRow
              className="border-white/[0.07] hover:bg-transparent"
              style={{ background: 'rgba(255,255,255,0.04)' }}
            >
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[28%]">
                Nome
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[16%]">
                Categoria
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[14%]">
                Grau acadêmico
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[26%]">
                Área / atuação
              </TableHead>
              <TableHead className="text-white/40 text-xs uppercase tracking-widest font-semibold w-[10%] text-right">
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

            {!loading && filtered.length === 0 && (
              <TableRow className="border-white/[0.07] hover:bg-transparent">
                <TableCell colSpan={5} className="py-12 text-center text-sm text-white/30">
                  {rows.length === 0
                    ? 'Nenhum membro cadastrado ainda.'
                    : 'Nenhum membro encontrado para os filtros aplicados.'}
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
                      <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                        <span className="truncate block">{row.displayName}</span>
                        {row.linkedinUrl ? (
                          <a
                            href={row.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-sky-400/90 transition hover:text-sky-300"
                            title="LinkedIn"
                            onClick={e => e.stopPropagation()}
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        ) : null}
                        {row.lattesUrl ? (
                          <a
                            href={row.lattesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 text-teal-400/90 transition hover:text-teal-300"
                            title="Currículo Lattes"
                            onClick={e => e.stopPropagation()}
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className="border border-white/15 bg-white/[0.06] text-[0.65rem] font-medium text-white/90">
                      <span className="flex items-center gap-1.5">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${row.categoryColor}`}
                        />
                        {row.categoryTitle}
                      </span>
                    </Badge>
                  </TableCell>

                  <TableCell className="text-sm text-white/55">
                    <span className="truncate block">
                      {row.degreeLevelLabel?.trim() ? (
                        row.degreeLevelLabel
                      ) : (
                        <span className="text-white/25">—</span>
                      )}
                    </span>
                  </TableCell>

                  <TableCell className="text-sm text-white/55 max-w-[220px]">
                    <div className="overflow-hidden">
                      <span className="truncate block">
                        {teamMemberQualificationFormationLine({
                          qualification: row.qualification,
                          formationInstitution: row.formationInstitution,
                        })}
                      </span>
                    </div>
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
                              &ldquo;{row.displayName}&rdquo; será removido permanentemente.
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
