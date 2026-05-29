import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen text-[#e4e4e7]"
      style={{
        background:
          'radial-gradient(circle at left center, rgba(74,222,128,0.08) 0%, transparent 40%), radial-gradient(circle at 75% 50%, #052e16 0%, #050a0f 65%)',
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {children}
      <Toaster
        theme="dark"
        position="top-center"
        richColors
        closeButton
        offset={16}
      />
    </div>
  )
}
