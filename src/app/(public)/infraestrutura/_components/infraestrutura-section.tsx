import {
  CloudSun,
  Cpu,
  ExternalLink,
  Globe,
  LayoutGrid,
  Layers,
  MemoryStick,
  MonitorCheck,
  Wrench,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const glass = {
  background:
    'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

const PLATFORM_ICONS: Record<string, LucideIcon> = {
  'cloud-sun': CloudSun,
  wrench: Wrench,
  globe: Globe,
  'layout-grid': LayoutGrid,
  layers: Layers,
  cpu: Cpu,
}

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
        <p className="mt-1 text-xs leading-relaxed text-white/50">
          {description}
        </p>
      </div>
    </div>
  )
}

export type DevelopedPlatformPublic = {
  id: string
  title: string
  description: string
  projectLink: string | null
  platformLink: string | null
  badge: string | null
  iconKey: string
}

function DevelopedPlatformCard({
  title,
  description,
  badge,
  iconKey,
  projectLink,
  platformLink,
}: Omit<DevelopedPlatformPublic, 'id'>) {
  const Icon = PLATFORM_ICONS[iconKey] ?? Layers
  const linkBtn =
    'inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/8 px-3 py-1.5 text-[0.65rem] font-medium text-white/75 transition-colors hover:bg-white/12 hover:text-white'

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
        <p className="mt-1 text-xs leading-relaxed text-white/50">
          {description}
        </p>
      </div>
      {(projectLink || platformLink) && (
        <div className="flex flex-wrap gap-2 pt-1">
          {projectLink && (
            <a
              href={projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className={linkBtn}
            >
              Link do projeto <ExternalLink size={11} />
            </a>
          )}
          {platformLink && (
            <a
              href={platformLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkBtn} border-cyan-400/35 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20`}
            >
              Acessar plataforma <ExternalLink size={11} />
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function PartnerCard({ name, desc }: { name: string; desc: string }) {
  return (
    <div
      className="flex flex-col items-center gap-3 px-4 py-8 text-center"
      style={glass}
    >
      <span className="text-sm font-bold tracking-wide text-white/80">
        {name}
      </span>
      <span className="text-xs leading-relaxed text-white/45">{desc}</span>
    </div>
  )
}

export type CollaborationPartnerPublic = {
  id: string
  name: string
  description: string
}

type Props = {
  platforms: DevelopedPlatformPublic[]
  partners: CollaborationPartnerPublic[]
}

export function InfraestruturaSection({ platforms, partners }: Props) {
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
        {platforms.length === 0 ? (
          <p className="text-sm text-white/35">Plataformas em atualização.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {platforms.map(
              ({
                id,
                title,
                description,
                badge,
                iconKey,
                projectLink,
                platformLink,
              }) => (
                <DevelopedPlatformCard
                  key={id}
                  title={title}
                  description={description}
                  badge={badge}
                  iconKey={iconKey}
                  projectLink={projectLink}
                  platformLink={platformLink}
                />
              )
            )}
          </div>
        )}
      </div>

      {/* Rede de parceiros */}
      <div className="mt-auto border-t border-white/10 pt-8">
        <SectionTitle>Rede de colaboração</SectionTitle>
        {partners.length === 0 ? (
          <p className="text-sm text-white/35">
            Rede de colaboração em atualização.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map(p => (
              <PartnerCard key={p.id} name={p.name} desc={p.description} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
