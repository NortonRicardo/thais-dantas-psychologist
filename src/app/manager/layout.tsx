import type { ReactNode } from 'react'

import { Toaster } from '@/components/ui/sonner'

export default function ManagerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#556040] text-[#e4e4e7]">
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
