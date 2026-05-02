'use client'

import { type ReactNode } from 'react'

/** Layout root client boundary — sem next-themes (React 19 alerta sobre `<script>` injetado pelo ThemeProvider). */
export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>
}
