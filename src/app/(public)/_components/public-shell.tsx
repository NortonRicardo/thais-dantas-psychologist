import { PublicFooter } from './public-footer'
import { PublicHeader } from './public-header'

type PublicShellProps = {
  children: React.ReactNode
}

export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-neutral-900">
      <PublicHeader />
      {children}
      <PublicFooter />
    </div>
  )
}
