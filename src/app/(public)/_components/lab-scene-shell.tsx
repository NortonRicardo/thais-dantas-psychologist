import { Orbitron } from 'next/font/google'

import { cn } from '@/lib/utils'

import { PlexusBackground } from './plexus-background'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
})

type LabSceneShellProps = {
  children: React.ReactNode
  /** Rótulo da região para leitores de tela. */
  'aria-label': string
  /** Sobrescreve padding/tamanho da `section` quando necessário. */
  sectionClassName?: string
  /** RGB da rede plexus, ex. `"0, 212, 255"`. */
  networkColor?: string
  /** Menos pontos e mais transparentes — para páginas internas. */
  subtlePlexus?: boolean
}

export function LabSceneShell({
  children,
  'aria-label': ariaLabel,
  sectionClassName,
  networkColor = '0, 212, 255',
  subtlePlexus = false,
}: LabSceneShellProps) {
  return (
    <div
      className={cn(
        orbitron.variable,
        'relative min-h-screen bg-[#050a0f] text-white'
      )}
    >
      <section
        className={cn(
          'relative isolate flex min-h-screen w-full flex-col bg-[radial-gradient(circle_at_left_center,rgba(0,212,255,0.08)_0%,transparent_40%),radial-gradient(circle_at_75%_50%,#002d5a_0%,#050a0f_65%)] px-[6%] pb-16 pt-6 max-[900px]:px-[5%]',
          sectionClassName
        )}
        aria-label={ariaLabel}
      >
        <PlexusBackground networkColor={networkColor} subtle={subtlePlexus} />
        <div
          className="pointer-events-none absolute inset-0 z-1 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-4 h-[40vh] w-full bg-linear-to-t from-black to-transparent"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-0 top-0 z-4 h-full w-[18vw] min-w-[120px] max-w-[240px] bg-linear-to-l from-black/45 to-transparent"
          aria-hidden
        />
        {children}
      </section>
    </div>
  )
}
