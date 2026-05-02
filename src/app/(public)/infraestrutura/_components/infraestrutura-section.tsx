import { Cpu, MemoryStick, MonitorCheck, CloudSun, Wrench } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const glass = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 text-sm  uppercase tracking-[3px] text-white/60">
      {children}
    </h2>
  )
}

function Card({
  icon: Icon,
  title,
  description,
  badge,
}: {
  icon: LucideIcon
  title: string
  description: string
  badge?: string
}) {
  return (
    <div className="flex flex-col gap-4 px-6 py-8" style={glass}>
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
          <Icon size={16} strokeWidth={1.5} />
        </span>
        {badge && (
          <span className="rounded-full border border-white/15 bg-white/5 px-2 py-0.5 text-[0.6rem] uppercase tracking-[2px] text-white/40">
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-white/90">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-white/50">{description}</p>
      </div>
    </div>
  )
}

function PartnerCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 py-8 text-center" style={glass}>
      <span className="text-sm font-bold tracking-wide text-white/80">{name}</span>
      <span className="text-xs leading-relaxed text-white/45">{desc}</span>
    </div>
  )
}

export function InfraestruturaSection() {
  return (
    <div className="mt-10 flex h-full w-full flex-1 flex-col gap-10 pb-16">

      {/* Hardware atual */}
      <div>
        <SectionTitle>Hardware atual</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card
            icon={Cpu}
            title="AMD Ryzen Threadripper PRO 5965WX"
            description="Processador de alto desempenho para workloads paralelos de modelagem e HPC."
            badge="CPU"
          />
          <Card
            icon={MemoryStick}
            title="512 GB de Memória RAM"
            description="Capacidade para processar grandes bases de dados climáticas e reanálises atmosféricas simultaneamente."
            badge="RAM"
          />
          <Card
            icon={MonitorCheck}
            title="5× NVIDIA RTX A4000"
            description="16 GB de VRAM cada. Suporte a treinamento de redes neurais, inferência e simulações com GPU."
            badge="GPU"
          />
        </div>
      </div>

      {/* Plataformas */}
      <div>
        <SectionTitle>Plataformas desenvolvidas</SectionTitle>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Card
            icon={CloudSun}
            title="Weather Brasil"
            description="Plataforma de dados meteorológicos premiada no Troféu Seriema 2025 (Inovação). Será apresentada no WCERE 2026, em Portugal."
            badge="2º lugar Seriema 2025"
          />
          <Card
            icon={Wrench}
            title="META TOOL BOX"
            description="Plataforma de otimização e metaheurísticas com registro de software. Em desenvolvimento contínuo desde 2016, orientada a problemas reais de grande escala."
            badge="Registro de Software"
          />
        </div>
      </div>

      {/* Rede de parceiros */}
      <div className="mt-auto pt-8 border-t border-white/10">
        <SectionTitle>Rede de colaboração</SectionTitle>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <PartnerCard name="INPE" desc="Modelagem climática, HPC e big data espacial" />
          <PartnerCard name="UnB" desc="LAMFO (Finanças e IA) e projeto SEM FOGO" />
          <PartnerCard name="UFCAT" desc="Cadeias agroindustriais, otimização e engenharia civil" />
          <PartnerCard name="Furnas" desc="Variáveis climáticas, conservação do solo e regulação ambiental (2022–2024)" />
        </div>
      </div>

    </div>
  )
}
