import Link from 'next/link'

interface PublicFooterProps {
  topBlur?: boolean
}

export function PublicFooter(_props: PublicFooterProps = {}) {
  return (
    <footer
      id="rodape"
      className="border-t border-[#556040]/15 bg-white px-6 py-12 text-neutral-600"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm">
          <span className="font-bold text-neutral-900">Thais Dantas</span>
          <span className="text-neutral-500"> — Psicóloga</span>
        </p>

        <nav className="flex gap-6 text-sm" aria-label="Rodapé">
          <Link href="/" className="transition-colors hover:text-neutral-900">
            Início
          </Link>
          <Link
            href="/contato"
            className="transition-colors hover:text-neutral-900"
          >
            Contato
          </Link>
        </nav>
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-xs text-neutral-400">
        © {new Date().getFullYear()} Thais Dantas. Todos os direitos reservados.
      </p>
    </footer>
  )
}
