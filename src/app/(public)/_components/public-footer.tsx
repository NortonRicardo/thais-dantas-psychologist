import Link from 'next/link'
import { Orbitron } from 'next/font/google'
import { cn } from '@/lib/utils'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
})

export function PublicFooter() {
  return (
    <footer
      className={cn(
        orbitron.variable,
        'bg-[#050a0f] px-6 py-16 text-center text-white'
      )}
    >
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8">
        {/* Logo */}
        <Link
          href="/"
          className="outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050a0f]"
          aria-label="LEMM — página inicial"
        >
          <span className="[font-family:var(--font-orbitron),sans-serif] text-2xl font-black tracking-[0.4em] text-white">
            LEMM
          </span>
        </Link>

        {/* Divisor */}
        <div className="h-px w-24 bg-white/20" />

        {/* Descrição */}
        <p className="max-w-xl text-sm font-light leading-relaxed text-white/50">
          Laboratório de Estudos em Modelagem e Meteorologia — uma parceria entre a{' '}
          <span className="text-white/80 font-medium">PUC Goiás</span> e o{' '}
          <span className="text-white/80 font-medium">Programa de Mestrado</span> em
          Ciências Ambientais e Computacionais.
        </p>

        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-6 text-[0.7rem] uppercase tracking-[3px] text-white/40">
          <Link href="#" className="transition-colors hover:text-white">Pesquisa</Link>
          <Link href="#" className="transition-colors hover:text-white">Equipe</Link>
          <Link href="#" className="transition-colors hover:text-white">Publicações</Link>
          <Link href="#" className="transition-colors hover:text-white">Contato</Link>
        </nav>

        {/* Divisor */}
        <div className="h-px w-full max-w-xs bg-white/10" />

        {/* Copyright */}
        <p className="text-[0.65rem] uppercase tracking-[3px] text-white/25">
          LEMM © 2026 — Todos os direitos reservados
        </p>
      </div>
    </footer>
  )
}
