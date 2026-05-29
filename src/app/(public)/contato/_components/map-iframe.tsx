'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

export function MapIframe({ src }: { src: string }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative h-[280px] w-full sm:h-[360px]">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-50">
          <MapPin size={24} strokeWidth={1.5} className="text-neutral-300" />
          <span className="text-sm text-neutral-400">Carregando mapa…</span>
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
