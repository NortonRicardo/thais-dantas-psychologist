'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

export function MapIframe({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative h-[240px] w-full sm:h-[360px] lg:h-[480px]">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-xl bg-white/5">
          <MapPin size={28} strokeWidth={1.5} className="animate-pulse text-white/30" />
          <span className="text-xs uppercase tracking-widest text-white/30">Carregando mapa…</span>
        </div>
      )}
      <iframe
        title="Localização LEMM"
        src={src}
        width="100%"
        height="100%"
        onLoad={() => setLoaded(true)}
        style={{
          border: 0,
          display: 'block',
          filter: 'grayscale(1) invert(0.9) contrast(0.85)',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  )
}
