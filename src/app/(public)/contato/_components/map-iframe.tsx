'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MapIframe({ src, className }: { src: string; className?: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn('relative w-full', className ?? 'h-[280px] sm:h-[360px]')}>
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#556040]/5">
          <MapPin size={24} strokeWidth={1.5} className="text-[#556040]/30" />
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#556040]/40">Carregando mapa…</span>
        </div>
      )}
      <iframe
        title="Localização Thais Dantas"
        src={src}
        width="100%"
        height="100%"
        onLoad={() => setLoaded(true)}
        className="block border-0"
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
