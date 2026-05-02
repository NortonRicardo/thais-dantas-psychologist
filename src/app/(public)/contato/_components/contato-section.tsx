import { Mail, Phone, Linkedin } from 'lucide-react'

const contacts = [
  {
    icon: Mail,
    label: 'E-mail',
    value: 'lemm@pucgoias.edu.br',
    href: 'mailto:lemm@pucgoias.edu.br',
  },
  {
    icon: Phone,
    label: 'Telefone',
    value: '+55 (62) 3946-1000',
    href: 'tel:+556239461000',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    value: 'linkedin.com/company/lemm',
    href: 'https://linkedin.com/company/lemm',
  },
]

export function ContatoSection() {
  return (
    <div className="mt-6 flex w-full flex-col items-center">
      {/* Mapa */}
      <div className="w-full overflow-hidden rounded-xl border border-white/10">
        <iframe
          title="Localização LEMM — PUC Goiás Área III"
          src="https://maps.google.com/maps?q=-16.6784792,-49.2453736&z=17&output=embed"
          width="100%"
          height="500"
          style={{
            border: 0,
            display: 'block',
            filter: 'grayscale(1) invert(0.9) contrast(0.85)',
          }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Cards */}
      <div className="mt-4 grid w-full max-w-[900px] grid-cols-1 gap-4 sm:grid-cols-4">
        {/* Card diretor */}
        <div
          className="flex flex-col items-center gap-3 px-4 py-6 text-center"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.18)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
          }}
        >
          <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-xl font-bold text-white/60">
            PD
          </span>
          <span className="text-[0.65rem] uppercase tracking-[3px] text-white/40">
            Diretor
          </span>
          <span className="text-sm font-medium text-white/80">
            Prof. Dr. Nome Sobrenome
          </span>
        </div>

        {contacts.map(({ icon: Icon, label, value, href }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group flex flex-col items-center gap-3 px-4 py-6 text-center transition-colors"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.18)',
              boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
            }}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors group-hover:bg-white/15">
              <Icon size={18} strokeWidth={1.5} />
            </span>
            <span className="text-[0.65rem] uppercase tracking-[3px] text-white/40">
              {label}
            </span>
            <span className="break-all text-sm text-white/70 transition-colors group-hover:text-white/90">
              {value}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
