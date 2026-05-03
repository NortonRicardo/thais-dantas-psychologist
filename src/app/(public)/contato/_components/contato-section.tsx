import { Mail, Phone, Linkedin } from 'lucide-react'
import { db } from '@/lib/db'
import { contactInfo } from '@/lib/db/schema'

const glassStyle = {
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0))',
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
  borderRadius: '20px',
  border: '1px solid rgba(255,255,255,0.18)',
  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.37)',
} as const

async function getContactInfo() {
  const rows = await db
    .select({
      directorName: contactInfo.directorName,
      directorRole: contactInfo.directorRole,
      email: contactInfo.email,
      phone: contactInfo.phone,
      linkedin: contactInfo.linkedin,
      directorPhoto: contactInfo.directorPhoto,
      directorPhotoMimeType: contactInfo.directorPhotoMimeType,
    })
    .from(contactInfo)
    .limit(1)

  return rows[0] ?? null
}

export async function ContatoSection() {
  const info = await getContactInfo()

  const directorName = info?.directorName?.trim() || null
  const directorRole = info?.directorRole?.trim() || null
  const email = info?.email?.trim() || null
  const phone = info?.phone?.trim() || null
  const linkedin = info?.linkedin?.trim() || null

  const showDirector = directorName || directorRole

  let photoSrc: string | null = null
  if (info?.directorPhoto && info.directorPhotoMimeType) {
    const b64 = Buffer.from(info.directorPhoto as unknown as ArrayBuffer).toString('base64')
    photoSrc = `data:${info.directorPhotoMimeType};base64,${b64}`
  }

  const initials = directorName
    ? directorName.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
    : null

  const contacts = [
    email && {
      icon: Mail,
      label: 'E-mail',
      value: email,
      href: `mailto:${email}`,
    },
    phone && {
      icon: Phone,
      label: 'Telefone',
      value: phone,
      href: `tel:${phone.replace(/\D/g, '')}`,
    },
    linkedin && {
      icon: Linkedin,
      label: 'LinkedIn',
      value: linkedin.replace(/^https?:\/\//, ''),
      href: linkedin.startsWith('http') ? linkedin : `https://${linkedin}`,
    },
  ].filter(Boolean) as { icon: typeof Mail; label: string; value: string; href: string }[]

  const totalCards = (showDirector ? 1 : 0) + contacts.length
  const gridCols =
    totalCards === 0 ? '' :
    totalCards === 1 ? 'sm:grid-cols-1' :
    totalCards === 2 ? 'sm:grid-cols-2' :
    totalCards === 3 ? 'sm:grid-cols-3' :
    'sm:grid-cols-4'

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

      {totalCards > 0 && (
        <div className={`mt-4 grid w-full max-w-[900px] grid-cols-1 gap-4 ${gridCols}`}>
          {showDirector && (
            <div
              className="flex flex-col items-center gap-3 px-4 py-6 text-center"
              style={glassStyle}
            >
              <span className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/15 bg-white/10 text-xl font-bold text-white/60">
                {photoSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoSrc} alt={directorName ?? ''} className="h-full w-full object-cover" />
                ) : (
                  initials ?? '?'
                )}
              </span>
              {directorRole && (
                <span className="text-[0.65rem] uppercase tracking-[3px] text-white/40">
                  {directorRole}
                </span>
              )}
              {directorName && (
                <span className="text-sm font-medium text-white/80">{directorName}</span>
              )}
            </div>
          )}

          {contacts.map(({ icon: Icon, label, value, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group flex flex-col items-center gap-3 px-4 py-6 text-center transition-colors"
              style={glassStyle}
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
      )}
    </div>
  )
}
