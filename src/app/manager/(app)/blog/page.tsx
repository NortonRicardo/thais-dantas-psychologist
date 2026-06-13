import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Gestor Thais Dantas',
}

export default function BlogManagerPage() {
  return (
    <div className="px-6 pb-12 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-semibold text-white sm:text-4xl">
          Blog
        </h1>
        <p className="mt-1 text-sm text-white/50">Em breve</p>
      </div>
    </div>
  )
}
