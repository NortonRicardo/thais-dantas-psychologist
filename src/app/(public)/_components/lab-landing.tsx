'use client'

import { ArrowRight, ChevronDown, Phone } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import type { CarouselApi } from '@/components/ui/carousel'
import type { GooglePlaceData } from '../_constants/google-reviews-fallback'
import { homeNavItems } from '../_constants/home-nav-items'
import { WHATSAPP_BOOKING_URL } from '../_constants/contact-links'

function ReviewAvatar({ name, photoUrl }: { name: string; photoUrl?: string }) {
  const [failed, setFailed] = useState(false)

  if (!photoUrl || failed) {
    return (
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#556040]/10 text-[11px] font-semibold text-[#556040]">
        {name.charAt(0)}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- avatar externo do Google, sem necessidade de otimização
    <img
      src={photoUrl}
      alt={name}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="size-9 shrink-0 rounded-full object-cover"
    />
  )
}

function StarRow({
  rating,
  className = 'size-3.5',
}: {
  rating: number
  className?: string
}) {
  const filled = Math.round(rating)
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${className} ${i < filled ? 'text-[#556040]' : 'text-[#556040]/20'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function LabLanding({
  googlePlace,
}: {
  googlePlace: GooglePlaceData | null
}) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!carouselApi) return
    intervalRef.current = setInterval(() => carouselApi.scrollNext(), 3500)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [carouselApi])
  return (
    <div className="text-[#2D2D2D]">
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-svh flex-col overflow-hidden bg-[#556040]">
        {/* Nav */}
        <header className="relative z-30 px-5 py-6 sm:px-10 sm:py-8">
          <div className="absolute top-full inset-x-0 px-5 pt-14 sm:px-10 sm:pt-16">
            <div className="mx-auto flex max-w-7xl justify-between">
              <div className="flex flex-col items-start gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                  Blog
                </p>
                <div className="flex flex-col gap-0.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                    Artigos & Reflexões
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                    Saúde Mental no Dia a Dia
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                    Publicações em Breve
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/40">
                  Atendimento
                </p>
                <div className="flex flex-col items-end gap-0.5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                    Psicóloga CRP registrada
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                    Online e presencial
                  </p>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/70">
                    Sessões sigilosas
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto flex max-w-7xl items-center gap-4 sm:gap-5">
            <nav
              aria-label="Navegação principal"
              className="relative flex min-w-0 flex-1 items-center rounded-full bg-[linear-gradient(to_right,rgba(255,255,255,0.18),rgba(255,255,255,0.18)_45%,rgba(255,255,255,0.12)_60%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.02)_88%,transparent)] py-2.5 pl-5 pr-3 backdrop-blur-sm sm:py-3 sm:pl-8 sm:pr-4"
            >
              <Link
                href="/"
                className="relative z-10 shrink-0 font-[family-name:var(--font-cinzel)] text-sm font-medium tracking-wide text-white transition-colors hover:text-white/90 sm:text-base"
              >
                Thais Dantas
              </Link>

              <ul className="pointer-events-none absolute inset-0 flex list-none items-center justify-center gap-x-4 p-0 sm:gap-x-8">
                {homeNavItems.map(({ href, label }) => (
                  <li key={label} className="pointer-events-auto">
                    <Link
                      href={href}
                      className="text-sm font-medium text-white/80 transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <a
              href={WHATSAPP_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#3A4424] shadow-sm transition-colors hover:bg-white sm:px-6 sm:py-2.5"
            >
              Agendar horário
            </a>
          </div>
        </header>

        {/* Chair image */}
        <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-8 pb-28 pt-36 sm:pb-24 sm:pt-40 lg:pt-44">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-[40%] w-full bg-[linear-gradient(to_bottom,transparent_0%,rgba(24,32,26,0.30)_50%,rgba(24,32,26,0.62)_100%)]"
          />

          <div className="relative z-10 w-full max-w-xl translate-y-4 sm:max-w-2xl sm:translate-y-6 lg:max-w-4xl lg:translate-y-8 xl:max-w-5xl">
            <Image
              src="/chair.png"
              alt="Consultório com duas cadeiras e mesa de apoio"
              width={960}
              height={640}
              priority
              className="relative z-10 h-auto w-full object-contain brightness-75"
            />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 pb-7 sm:px-10 sm:pb-9">
          <div className="pointer-events-auto relative mx-auto flex max-w-7xl items-end">
            {/* Description – centered absolutely */}
            <p className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[1100px] text-center text-[10px] font-medium uppercase leading-loose tracking-[0.18em] text-white/80 sm:text-[11px]">
              <span className="block">
                Um espaço calmo para tratar obesidade, emagrecimento,
                transtornos alimentares, cirurgia bariátrica e endometriose.
              </span>
              <span className="block">
                Terapia Cognitivo Comportamental — atendimento online ou
                presencial, com acompanhamento personalizado.
              </span>
            </p>

            {/* More – bottom right */}
            <div className="pointer-events-auto ml-auto flex items-center gap-2.5">
              <Link
                href="#sobre"
                className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80 transition-opacity hover:opacity-100"
              >
                Mais
              </Link>
              <Link
                href="#sobre"
                aria-label="Ver mais conteúdo"
                className="flex size-8 items-center justify-center rounded-full border border-white/60 text-white/80 transition-colors hover:border-white hover:text-white"
              >
                <ChevronDown className="size-3.5" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECIALTY SECTIONS ───────────────────────────────────────────── */}
      {[
        {
          tag: 'Especialidade',
          title: 'Obesidade',
          titleEm: '& Corpo',
          body: 'A obesidade vai além do aspecto físico — ela é moldada por gatilhos emocionais, padrões comportamentais e pela história de cada pessoa. O acompanhamento psicológico cria um espaço seguro para identificar esses padrões, trabalhar a relação com a comida e o próprio corpo, e construir mudanças duradouras sem julgamento.',
          src: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&q=80',
          alt: 'Reflexão e autocuidado',
          label: 'Obesidade',
          flip: false,
          light: true,
        },
        {
          tag: 'Especialidade',
          title: 'Emagrecimento',
          titleEm: 'consciente',
          body: 'Emagrecer de forma sustentável começa na mente. Mais do que controlar o peso, o processo envolve compreender o que leva ao comer emocional, romper ciclos de culpa e restrição, e cultivar uma relação mais leve com a alimentação. A psicoterapia oferece as ferramentas para que essa transformação venha de dentro.',
          src: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=900&q=80',
          alt: 'Equilíbrio alimentar',
          label: 'Emagrecimento',
          flip: true,
          light: false,
        },
        {
          tag: 'Especialidade',
          title: 'Transtornos',
          titleEm: 'Alimentares',
          body: 'Anorexia, bulimia, compulsão alimentar e outros transtornos carregam sofrimentos que vão muito além da mesa. O tratamento psicológico é peça central nesse caminho — ajudando a ressignificar a relação com o corpo, a comida e a autoimagem, com escuta acolhedora e abordagem baseada em evidências.',
          src: '/Transtornos Alimentares.png',
          alt: 'Transtornos Alimentares',
          label: 'Transtornos Alimentares',
          flip: false,
          light: true,
        },
        {
          tag: 'Especialidade',
          title: 'Cirurgia',
          titleEm: 'Bariátrica',
          body: 'A cirurgia bariátrica transforma o corpo, mas a mente precisa acompanhar essa mudança. O suporte psicológico — antes e depois do procedimento — é fundamental para avaliar a prontidão emocional, prevenir transtornos no pós-operatório e garantir que os resultados sejam mantidos a longo prazo.',
          src: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900&q=80',
          alt: 'Cuidado e preparo',
          label: 'Cirurgia Bariátrica',
          flip: true,
          light: false,
        },
        {
          tag: 'Abordagem',
          title: 'Terapia Cognitivo',
          titleEm: 'Comportamental',
          body: 'A TCC é uma das abordagens mais bem estudadas da psicologia. Ela parte da compreensão de que nossos pensamentos influenciam diretamente nossas emoções e comportamentos — e que é possível mudá-los. Com técnicas práticas e foco nos objetivos de cada pessoa, a TCC oferece resultados concretos e duradouros.',
          src: '/TCC.png',
          alt: 'Terapia Cognitivo Comportamental',
          label: 'TCC',
          flip: false,
          light: true,
        },
        {
          tag: 'Experiência Clínica',
          title: 'Endometriose',
          titleEm: '& Saúde Mental',
          body: 'Viver com endometriose é carregar uma dor que muitas vezes não é vista. A dor crônica, o longo caminho até o diagnóstico e os impactos na fertilidade e na vida social geram ansiedade, depressão e isolamento. O acompanhamento psicológico oferece um espaço de escuta real — para que a mulher seja cuidada em todas as dimensões.',
          src: '/endometrioze.png',
          alt: 'Endometriose e saúde mental',
          label: 'Endometriose',
          flip: true,
          light: false,
        },
      ].map(({ tag, title, titleEm, body, src, alt, label, flip, light }) => {
        const bg = light ? 'bg-[#B8AEA4]' : 'bg-[#7A9068]'

        const colorSide = (
          <div
            key="color"
            className={`relative flex items-center px-10 py-20 sm:px-16 xl:px-24 ${bg}`}
          >
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
            <div className="relative z-10 flex max-w-[460px] flex-col gap-6">
              <span className="text-[0.57rem] font-light uppercase tracking-[0.3em] text-[#2e2b28] opacity-40">
                {tag}
              </span>
              <h2 className="font-[family-name:var(--font-cormorant)] text-[clamp(2.4rem,3.8vw,4rem)] font-light leading-[1.06] text-[#2e2b28]">
                {title}
                <br />
                <em className="italic opacity-50">{titleEm}</em>
              </h2>
              <div className="h-px w-8 bg-[#2e2b28] opacity-20" />
              <p className="max-w-[40ch] text-sm leading-[1.9] text-[#2e2b28] opacity-55">
                {body}
              </p>
              <a
                href={WHATSAPP_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex items-center gap-2 text-[0.59rem] font-light uppercase tracking-[0.24em] text-[#2e2b28] opacity-40 transition-opacity hover:opacity-80"
              >
                Agendar consulta <ArrowRight className="size-3" />
              </a>
            </div>
          </div>
        )

        const blendColor = light ? '#938B83' : '#627353'

        const imageSide = (
          <div key="image" className="group relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="absolute inset-0 h-full w-full object-cover object-top brightness-90 transition-transform duration-[1100ms] ease-in-out group-hover:scale-105"
            />
            {/* Dark overlay — same level as colorSide */}
            <div className="pointer-events-none absolute inset-0 z-10 bg-black/20" />
            {/* Blend into solid color — above dark overlay */}
            <div
              className={`pointer-events-none absolute top-0 z-20 h-full w-[55%] ${flip ? 'right-0' : 'left-0'}`}
              style={{
                background: flip
                  ? `linear-gradient(to left, ${blendColor}, transparent)`
                  : `linear-gradient(to right, ${blendColor}, transparent)`,
              }}
            />
            {/* Shadow on screen edge — above dark overlay */}
            <div
              className={`pointer-events-none absolute top-0 z-20 h-full w-[20%] ${flip ? 'left-0' : 'right-0'}`}
              style={{
                background: flip
                  ? 'linear-gradient(to right, rgba(0,0,0,0.35), transparent)'
                  : 'linear-gradient(to left, rgba(0,0,0,0.35), transparent)',
              }}
            />
            <span
              className={`absolute bottom-7 z-30 text-[0.58rem] font-extralight uppercase tracking-[0.22em] text-white opacity-50 ${flip ? 'left-6' : 'right-6'}`}
            >
              {label}
            </span>
          </div>
        )

        return (
          <section
            key={title}
            className={`grid min-h-svh overflow-hidden ${flip ? 'grid-cols-[40fr_60fr]' : 'grid-cols-[60fr_40fr]'}`}
          >
            {flip ? (
              <>
                {imageSide}
                {colorSide}
              </>
            ) : (
              <>
                {colorSide}
                {imageSide}
              </>
            )}
          </section>
        )
      })}

      {/* ── CONTENT SECTIONS ─────────────────────────────────────────────── */}
      <div className="bg-white">
        {/* ── REVIEWS ──────────────────────────────────────────────────────── */}
        {googlePlace && googlePlace.reviews.length > 0 && (
          <section className="border-t border-[#556040]/30 px-6 py-20 sm:px-10">
            <div className="mx-auto max-w-5xl">
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]">
                    Avaliações
                  </span>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="font-[family-name:var(--font-cormorant)] text-4xl font-light text-[#2D2D2D]">
                      {googlePlace.rating.toLocaleString('pt-BR', {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      })}
                    </span>
                    <div className="flex flex-col gap-1">
                      <StarRow rating={googlePlace.rating} />
                      <p className="text-[11px] text-[#2D2D2D]/50">
                        {googlePlace.userRatingCount} avaliaç
                        {googlePlace.userRatingCount === 1 ? 'ão' : 'ões'} no
                        Google
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={googlePlace.mapsUri ?? undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 opacity-40 transition-opacity hover:opacity-70"
                  >
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span className="text-[11px] font-medium text-[#2D2D2D]">
                      Google
                    </span>
                  </a>
                </div>
              </div>

              {/* Carousel */}
              <Carousel
                className="mt-10"
                opts={{ loop: true }}
                setApi={setCarouselApi}
              >
                <CarouselContent className="-ml-4">
                  {googlePlace.reviews.map((review, i) => (
                    <CarouselItem
                      key={i}
                      className="pl-4 basis-[80%] sm:basis-1/2 lg:basis-1/3"
                    >
                      <div className="flex h-full flex-col gap-5 rounded-sm border border-[#556040]/12 p-6 transition-all duration-300 hover:scale-[1.06] hover:border-[#556040]/30 hover:shadow-lg">
                        <div className="flex items-center gap-3">
                          <ReviewAvatar
                            name={review.authorName}
                            photoUrl={review.photoUrl}
                          />
                          <div>
                            <p className="text-[12px] font-medium text-[#2D2D2D]">
                              {review.authorName}
                            </p>
                            <p className="text-[10px] text-[#2D2D2D]/40">
                              {review.relativeTime}
                            </p>
                          </div>
                        </div>
                        <StarRow rating={review.rating} className="size-3" />
                        <p className="flex-1 text-[12px] leading-relaxed text-[#2D2D2D]/65">
                          {review.text}
                        </p>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 border-[#556040]/20 text-[#556040]/60 hover:border-[#556040] hover:text-[#556040] hover:bg-transparent" />
                <CarouselNext className="-right-4 border-[#556040]/20 text-[#556040]/60 hover:border-[#556040] hover:text-[#556040] hover:bg-transparent" />
              </Carousel>
            </div>
          </section>
        )}

        {/* ── BLOG ─────────────────────────────────────────────────────────── */}
        <section className="flex min-h-[90vh] flex-col bg-[#556040] px-6 py-16 sm:px-10">
          <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
                Blog & Reflexões
              </span>
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
                Em breve
              </span>
            </div>
            <div className="py-12">
              <h2 className="font-[family-name:var(--font-cormorant)] text-[clamp(3.2rem,7vw,6.5rem)] font-light leading-[1.02] text-white">
                Onde a ciência
                <br />
                <em className="italic text-white/45">encontra o cotidiano.</em>
              </h2>
              <p className="mt-6 max-w-md text-[13px] leading-relaxed text-white/50">
                Artigos sobre saúde mental, alimentação emocional e bem-estar —
                escritos para quem quer entender mais sobre si mesmo.
              </p>
            </div>
            <div className="mt-auto grid flex-1 grid-cols-1 gap-px border-t border-white/15 sm:grid-cols-[2fr_1fr_1fr]">
              <article className="group flex cursor-default flex-col justify-between py-8 sm:pr-10">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/35">
                    Saúde Mental
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-cormorant)] text-[clamp(1.5rem,2.8vw,2.2rem)] font-light leading-[1.1] text-white transition-opacity group-hover:opacity-70">
                    Comer emocional: por que comemos quando não estamos com
                    fome?
                  </h3>
                  <p className="mt-4 text-[12px] leading-relaxed text-white/45">
                    Entender a relação entre emoções e alimentação é o primeiro
                    passo para transformar padrões que parecem impossíveis de
                    mudar.
                  </p>
                </div>
                <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="text-[10px] text-white/35">
                    8 min de leitura
                  </span>
                  <span className="text-white/20">·</span>
                  <span className="text-[10px] text-white/35">Em breve</span>
                </div>
              </article>
              <article className="group flex cursor-default flex-col justify-between py-8 sm:border-l sm:border-white/15 sm:px-8">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/35">
                    TCC
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-cormorant)] text-xl font-light leading-[1.15] text-white transition-opacity group-hover:opacity-70">
                    Como nossos pensamentos moldam o que comemos
                  </h3>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="text-[10px] text-white/35">5 min</span>
                </div>
              </article>
              <article className="group flex cursor-default flex-col justify-between py-8 sm:border-l sm:border-white/15 sm:px-8">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.3em] text-white/35">
                    Endometriose
                  </span>
                  <h3 className="mt-4 font-[family-name:var(--font-cormorant)] text-xl font-light leading-[1.15] text-white transition-opacity group-hover:opacity-70">
                    Dor invisível: saúde mental e endometriose
                  </h3>
                </div>
                <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                  <span className="text-[10px] text-white/35">6 min</span>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="sobre"
          className="scroll-mt-20 border-t border-[#556040]/30 px-6 py-14 sm:px-10"
        >
          <div className="mx-auto max-w-3xl">
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]">
              Sobre
            </span>
            <p className="mt-5 text-sm leading-relaxed text-[#2D2D2D]/90 sm:text-base sm:leading-relaxed">
              Sou Thais Dantas, psicóloga dedicada a oferecer um ambiente seguro
              e acolhedor. Cada encontro é conduzido com escuta qualificada,
              respeito ao seu ritmo e foco no que faz sentido para você. O
              processo terapêutico pode ajudar a compreender padrões emocionais,
              desenvolver recursos internos e construir relações mais saudáveis
              consigo e com os outros — sempre com confidencialidade e cuidado.
            </p>
          </div>
        </section>

        <section
          id="especialidades"
          className="scroll-mt-20 border-t border-[#556040]/30 px-6 py-14 sm:px-10"
        >
          <div className="mx-auto flex max-w-5xl items-center gap-10 sm:gap-14">
            <div className="relative hidden aspect-square w-52 shrink-0 self-center overflow-hidden rounded-full sm:block">
              <Image
                src="/thais dantas.png"
                alt="Thais Dantas"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="hidden h-full w-px shrink-0 self-stretch bg-[#556040]/15 sm:block" />
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]">
                Especialidades
              </span>
              <div className="mt-10 grid grid-cols-1 gap-px sm:grid-cols-[1fr_1px_1fr]">
                <div className="flex flex-col">
                  <span className="mb-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]/50">
                    Saúde & Corpo
                  </span>
                  {[
                    'Obesidade',
                    'Emagrecimento',
                    'Cirurgia Bariátrica',
                    'Endometriose',
                  ].map(t => (
                    <p
                      key={t}
                      className="border-t border-[#556040]/15 py-2.5 text-sm text-[#2D2D2D]/80"
                    >
                      {t}
                    </p>
                  ))}
                </div>
                <div className="hidden bg-[#556040]/15 sm:block" />
                <div className="mt-12 flex flex-col sm:mt-0 sm:pl-16">
                  <span className="mb-6 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]/50">
                    Abordagem
                  </span>
                  {[
                    'Transtornos Alimentares',
                    'Terapia Cognitivo Comportamental',
                  ].map(t => (
                    <p
                      key={t}
                      className="border-t border-[#556040]/15 py-2.5 text-sm text-[#2D2D2D]/80"
                    >
                      {t}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CONTACT ──────────────────────────────────────────────────────── */}
        <section className="border-t border-[#556040]/20 px-6 py-10 sm:px-10">
          <div className="mx-auto flex max-w-5xl items-center gap-8">
            {/* Map + Address */}
            <div className="flex flex-1 items-center gap-6">
              <div className="h-32 w-48 shrink-0 overflow-hidden rounded-sm">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3822.5896755297!2d-49.26997518508!3d-16.68921308748!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935ef15a77fc9bab%3A0x9d5dfaa6e0d78ec4!2sPontif%C3%ADcia%20Universidade%20Cat%C3%B3lica%20de%20Goi%C3%A1s!5e0!3m2!1spt-BR!2sbr!4v1657549036!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização PUC Goiás"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]">
                  Localização
                </p>
                <p className="mt-1 text-sm font-medium text-[#2D2D2D]">
                  PUC Goiás
                </p>
                <p className="text-sm text-[#2D2D2D]/60">
                  Av. Universitária, 1440
                </p>
                <p className="text-sm text-[#2D2D2D]/60">Setor Universitário</p>
                <p className="text-sm text-[#2D2D2D]/60">Goiânia – GO</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-28 w-px shrink-0 bg-[#556040]/15" />

            {/* Info */}
            <div className="flex flex-1 flex-col gap-1.5">
              <p className="text-base font-medium text-[#2D2D2D]">
                Thais Dantas
              </p>
              <p className="text-sm text-[#2D2D2D]/55">Psicóloga — CRP 09/</p>
              <p className="text-sm text-[#2D2D2D]/55">
                Especialista em Saúde Alimentar
              </p>
              <div className="mt-1 flex flex-col gap-1">
                <a
                  href="tel:+5562992016959"
                  className="inline-flex items-center gap-1.5 text-sm text-[#556040] hover:opacity-75 transition-opacity"
                >
                  <Phone className="size-3.5" strokeWidth={1.5} />
                  (62) 9 9201-6959
                </a>
                <a
                  href={WHATSAPP_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-[#556040] hover:opacity-75 transition-opacity"
                >
                  <svg
                    className="size-3.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.112 1.523 5.84L0 24l6.338-1.499A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.493-5.184-1.357l-.372-.22-3.862.913.978-3.768-.242-.387A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Divider */}
            <div className="h-28 w-px shrink-0 bg-[#556040]/15" />

            {/* Consultas */}
            <div
              id="consultas"
              className="flex flex-1 flex-col gap-4 scroll-mt-20"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#556040]">
                Consultas
              </p>
              <p className="text-sm leading-relaxed text-[#2D2D2D]/70">
                Atendimentos online ou presenciais, com horários combinados
                previamente.
              </p>
              <a
                href={WHATSAPP_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#556040] px-5 py-2.5 text-sm font-medium text-[#3A4424] transition-colors hover:bg-[#556040]/10"
              >
                Agendar uma consulta
                <ArrowRight className="size-3.5" strokeWidth={2} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
