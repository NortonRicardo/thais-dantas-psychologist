import Link from 'next/link'
import { Orbitron } from 'next/font/google'
import { cn } from '@/lib/utils'

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-orbitron',
})

interface PublicFooterProps {
  topBlur?: boolean
}

export function PublicFooter({ topBlur = true }: PublicFooterProps) {
  return (
    <footer
      id="rodape"
      className={cn(
        orbitron.variable,
        'relative scroll-mt-8 bg-[#050a0f] px-6 py-16 text-center text-white'
      )}
    >
      {topBlur && (
        <div className="pointer-events-none absolute inset-x-0 -top-8 h-20 bg-gradient-to-b from-black to-transparent" />
      )}
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
        <div className="max-w-2xl space-y-4 text-sm font-light leading-relaxed text-white/55">
          <p>
            <span className="font-medium text-white/85">
              Laboratório de Estudos e Modelagem Matemática (LEMM)
            </span>
            <br />
            <span className="text-white/70">
              Proposta vinculada à{' '}
              <span className="text-white/80">
                Pontifícia Universidade Católica de Goiás (PUC Goiás)
              </span>
              , no âmbito do{' '}
              <span className="text-white/80">
                Mestrado em Engenharia Industrial e Inteligência Artificial
                (PPGEIIA)
              </span>
              . Foco em modelagem climática avançada, IA, otimização, HPC,
              desenvolvimento de software e articulação com a pós-graduação e a
              graduação.
            </span>
          </p>
        </div>

        {/* Links */}
        <nav
          className="flex flex-wrap justify-center gap-6 text-[0.7rem] uppercase tracking-[3px] text-white/40"
          aria-label="Rodapé"
        >
          <Link href="#area1" className="transition-colors hover:text-white">
            Formação
          </Link>
          <Link href="#area2" className="transition-colors hover:text-white">
            Eventos
          </Link>
          <Link href="#area3" className="transition-colors hover:text-white">
            Pesquisa
          </Link>
          <Link href="#area8" className="transition-colors hover:text-white">
            Software
          </Link>
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
