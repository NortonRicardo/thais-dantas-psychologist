import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { LabPublicHeader } from './lab-public-header'
import { LabSceneShell } from './lab-scene-shell'
import { PublicFooter } from './public-footer'

const fontOrbitron = '[font-family:var(--font-orbitron),sans-serif]'

type PublicPageShellProps = {
  children?: ReactNode
  /** Conteúdo renderizado fora do container max-w-3xl, ocupa a largura total da section. */
  fullWidthContent?: ReactNode
  /** Rótulo da `section` para acessibilidade. */
  'aria-label': string
  title: string
  lead: string
}

export function PublicPageShell({
  children,
  fullWidthContent,
  'aria-label': ariaLabel,
  title,
  lead,
}: PublicPageShellProps) {
  return (
    <>
      <LabSceneShell aria-label={ariaLabel} subtlePlexus>
        <LabPublicHeader variant="static" />
        <div className="relative z-10 w-full max-w-3xl self-start pt-2 text-left">
          <h1
            className={cn(
              'mb-4 text-xl font-black uppercase tracking-tight text-white sm:text-2xl',
              fontOrbitron
            )}
          >
            {title}
          </h1>
          <p className="max-w-prose text-base leading-relaxed text-slate-300">
            {lead}
          </p>
          {children}
        </div>
        {fullWidthContent && (
          <div className="relative z-10 flex w-full flex-1 flex-col">
            {fullWidthContent}
          </div>
        )}
      </LabSceneShell>
      <PublicFooter />
    </>
  )
}
