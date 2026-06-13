# Design System — Padrões de UI

**Stack:** Next.js · Tailwind CSS v4 · shadcn/ui · Radix UI · Lucide Icons

Este documento define padrões de interface para todas as áreas do projeto: **páginas públicas** (landing, blog, contato) e **gestor** (back-office).

---

## Índice

**Páginas Públicas**
1. [Paleta de Cores](#1-paleta-de-cores)
2. [Tipografia](#2-tipografia)
3. [Layout e Grid](#3-layout-e-grid)
4. [Navegação (Nav Pill)](#4-navegação-nav-pill)
5. [Hero Sections](#5-hero-sections)
6. [Cards do Blog](#6-cards-do-blog)
7. [Filtros e Busca](#7-filtros-e-busca)
8. [Paginação](#8-paginação)
9. [Carousel de Avaliações](#9-carousel-de-avaliações)
10. [Seções de Conteúdo](#10-seções-de-conteúdo)

**Gestor (Back-office)**
11. [Espaçamento e Raio de Borda](#11-espaçamento-e-raio-de-borda)
12. [Sombras](#12-sombras)
13. [Botões](#13-botões)
14. [Inputs e Campos de Formulário](#14-inputs-e-campos-de-formulário)
15. [Select e Combobox](#15-select-e-combobox)
16. [Labels e Descrições](#16-labels-e-descrições)
17. [Validação e Feedback de Erro](#17-validação-e-feedback-de-erro)
18. [Toasts e Notificações](#18-toasts-e-notificações)
19. [Dialogs e Modais](#19-dialogs-e-modais)
20. [Tabelas do Gestor](#20-tabelas-do-gestor)
21. [ScrollArea](#21-scrollarea)
22. [Ícones](#22-ícones)
23. [Imagens](#23-imagens)
24. [Animações](#24-animações)
25. [Padrões de Composição](#25-padrões-de-composição)

---

# Páginas Públicas

## 1. Paleta de Cores

| Token | Hex | Uso |
|-------|-----|-----|
| **Verde musgo** | `#556040` | Hero, CTAs, tags, destaques, cards escuros, fundo das seções principais |
| **Verde musgo escuro** | `#3A4424` | Texto do botão "Agendar" sobre fundo branco |
| **Pedra clara** | `#B8AEA4` | Cards alternados sem imagem, bordas sutis |
| **Areia / creme** | `#F4F0EA` | Fundos neutros de seções intermediárias |
| **Texto principal** | `#2D2D2D` | Nunca usar preto puro |
| **Branco** | `#FFFFFF` | Fundo de seções claras, cards com imagem |

### Opacidades e overlays recorrentes

```css
/* Overlay sobre imagem de hero */
bg-[#556040]/20

/* Overlay escuro sobre imagens de card */
bg-[#556040]/15

/* Borda sutil em fundos brancos */
border-[#2D2D2D]/8

/* Borda sutil em fundos escuros */
border-white/15

/* Texto mudo sobre fundo branco */
text-[#2D2D2D]/50
text-[#2D2D2D]/40
text-[#2D2D2D]/35

/* Texto mudo sobre fundo verde */
text-white/50
text-white/45
text-white/35
```

### Gradiente de hero (sombra de profundidade sob imagem)

```css
/* Aplicado sobre imagem de fundo — cria impressão de profundidade no rodapé */
background: linear-gradient(to bottom, transparent, rgba(24,32,26,0.30) 50%, rgba(24,32,26,0.62) 100%)
```

---

## 2. Tipografia

### Fontes do projeto

```typescript
// src/app/layout.tsx
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
})
const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  weight: ['400', '700', '900'],
})
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400'],
  style: ['normal', 'italic'],
})
```

| Fonte | Variável CSS | Uso |
|-------|-------------|-----|
| **Inter** | `--font-inter` | Corpo, formulários, tabelas, gestor, textos de apoio nas páginas públicas |
| **Cinzel** | `--font-cinzel` | Marca/logo ("Thais Dantas"), títulos institucionais |
| **Cormorant Garamond** | `--font-cormorant` | Headlines editoriais nas páginas públicas, títulos de seção, h1 do blog |

### Escala tipográfica — Páginas públicas

| Elemento | Classes | Tamanho |
|----------|---------|---------|
| H1 de hero (blog, contato) | `font-[family-name:var(--font-cormorant)] text-[clamp(2.5rem,5vw,5rem)] font-light leading-[1.02]` | Responsivo |
| H1 de landing | `font-[family-name:var(--font-cormorant)] text-[clamp(3rem,7vw,7rem)] font-light` | Responsivo |
| H2 de seção | `font-[family-name:var(--font-cormorant)] text-[clamp(2rem,4vw,4rem)] font-light` | Responsivo |
| Título de card featured | `font-[family-name:var(--font-cormorant)] text-[clamp(1.6rem,2.4vw,2.4rem)] font-light leading-[1.1]` | Responsivo |
| Título de card grid | `font-[family-name:var(--font-cormorant)] text-xl font-light leading-snug` | 20px |
| Texto de apoio / excerpt | `text-sm leading-relaxed` | 14px |
| Label editorial (eyebrow) | `text-[10px] font-semibold uppercase tracking-[0.3em]` | 10px |
| Metadata de card (data, tempo, views) | `text-[10px]` ou `text-[11px]` | 10–11px |
| Tag de categoria | `text-[9px] font-semibold uppercase tracking-[0.22em]` | 9px |

### Uso do itálico Cormorant

O itálico do Cormorant é usado para criar contraste dentro do título — parte do H1 em opacidade reduzida:

```tsx
<h1 className="font-[family-name:var(--font-cormorant)] ... text-white">
  Onde a ciência{' '}
  <em className="italic text-white/45">encontra o cotidiano.</em>
</h1>
```

### Números decorativos de fundo

Usados em cards sem imagem para criar profundidade visual:

```tsx
/* Em card pequeno */
<span className="absolute -right-3 -top-4 select-none font-[family-name:var(--font-cormorant)] text-[8rem] font-light leading-none text-white/6" aria-hidden>
  {article.num}
</span>

/* Em card featured */
<span className="font-[family-name:var(--font-cormorant)] text-[6rem] font-light leading-none text-[#556040]/8 select-none">
  {article.num}
</span>
```

---

## 3. Layout e Grid

### Max-width global

```tsx
// Todas as páginas públicas usam max-w-7xl com padding lateral consistente
<div className="mx-auto max-w-7xl px-6 sm:px-10">
```

### Padding de seção

```tsx
// Seção padrão
<section className="px-6 py-10 sm:px-10">

// Seção hero (mais compacta)
<section className="px-6 py-6 sm:px-10 sm:py-8">

// Seção de conteúdo grande
<section className="px-6 py-16 sm:px-10 sm:py-24">
```

### Grid de 2 colunas (50/50)

```tsx
<div className="grid sm:grid-cols-2 gap-8">
```

### Grid assimétrico (contato, featured card)

```tsx
// Featured card do blog
<div className="grid sm:grid-cols-[55fr_45fr]">

// Contato (mapa + info)
<div className="grid sm:grid-cols-2">
```

---

## 4. Navegação (Nav Pill)

### Padrão adotado em todas as páginas públicas

```tsx
<header>
  <div className="mx-auto flex max-w-7xl items-center gap-4 sm:gap-5">
    {/* Pill com gradiente branco → transparente */}
    <nav className="relative flex min-w-0 flex-1 items-center rounded-full
      bg-[linear-gradient(to_right,rgba(255,255,255,0.18),rgba(255,255,255,0.18)_45%,rgba(255,255,255,0.12)_60%,rgba(255,255,255,0.06)_75%,rgba(255,255,255,0.02)_88%,transparent)]
      py-2.5 pl-5 pr-3 backdrop-blur-sm sm:py-3 sm:pl-8 sm:pr-4">

      {/* Logo — alinhado à esquerda */}
      <Link href="/" className="relative z-10 shrink-0 font-[family-name:var(--font-cinzel)] text-sm font-medium tracking-wide text-white sm:text-base">
        Thais Dantas
      </Link>

      {/* Links — centralizados via position absolute */}
      <ul className="pointer-events-none absolute inset-0 flex list-none items-center justify-center gap-x-4 p-0 sm:gap-x-8">
        {homeNavItems.map(({ href, label }) => (
          <li key={label} className="pointer-events-auto">
            <Link href={href} className="text-sm font-medium text-white/80 transition-colors hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>

    {/* CTA — fora do pill */}
    <a href={WHATSAPP_BOOKING_URL} target="_blank" rel="noopener noreferrer"
      className="shrink-0 rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-[#3A4424] shadow-sm hover:bg-white sm:px-6 sm:py-2.5">
      Agendar horário
    </a>
  </div>
</header>
```

### Âncoras de navegação

Links que apontam para seções da home usam `/#hash` (e não `#hash`) para funcionar corretamente a partir de qualquer rota:

```typescript
// src/app/(public)/_constants/home-nav-items.ts
export const homeNavItems = [
  { href: '/#sobre', label: 'Sobre' },
  { href: '/#especialidades', label: 'Especialidades' },
  { href: '/blog', label: 'Blog' },
  { href: '/contato', label: 'Contato' },
] as const
```

```css
/* src/app/globals.css */
html { scroll-behavior: smooth; }
```

---

## 5. Hero Sections

### Hero compacto (blog, contato)

```tsx
<section className="flex flex-col bg-[#556040] px-6 py-6 sm:px-10 sm:py-8">
  {/* Nav aqui dentro */}
  <header>...</header>

  {/* Conteúdo editorial */}
  <div className="mx-auto w-full max-w-7xl">
    {/* Eyebrow + contagem */}
    <div className="flex items-center justify-between border-b border-white/15 pb-4 pt-8">
      <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/50">
        Blog & Reflexões
      </span>
      <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
        8 artigos
      </span>
    </div>

    {/* H1 + subtítulo */}
    <div className="pb-8 pt-6">
      <h1 className="font-[family-name:var(--font-cormorant)] text-[clamp(2.5rem,5vw,5rem)] font-light leading-[1.02] text-white">
        Onde a ciência <em className="italic text-white/45">encontra o cotidiano.</em>
      </h1>
      <p className="mt-3 max-w-lg text-[13px] leading-relaxed text-white/50">
        Subtítulo descritivo curto.
      </p>
    </div>
  </div>
</section>
```

---

## 6. Cards do Blog

### Card em destaque (featured)

Primeiro artigo da listagem. Grid assimétrico 55/45 com imagem à esquerda ou fundo verde quando sem imagem.

```tsx
<Link href={`/blog/${article.slug}`}
  className="group mb-6 grid overflow-hidden rounded-2xl border border-[#2D2D2D]/8 transition-shadow hover:shadow-lg sm:grid-cols-[55fr_45fr]">

  {/* Lado esquerdo — imagem ou fundo verde */}
  {article.image ? (
    <div className="relative min-h-[280px] overflow-hidden">
      <img src={article.image} alt={article.title}
        className="absolute inset-0 h-full w-full object-cover brightness-90 transition-transform duration-700 group-hover:scale-[1.03]" />
      <div className="absolute inset-0 bg-[#556040]/20" />
      <TagBadge category={article.category} className="absolute bottom-5 left-5" light />
    </div>
  ) : (
    <div className="relative flex min-h-[280px] flex-col justify-end overflow-hidden bg-[#556040] p-8">
      <span className="pointer-events-none absolute -right-4 -top-4 select-none font-[family-name:var(--font-cormorant)] text-[14rem] font-light leading-none text-white/5">
        {article.num}
      </span>
      <TagBadge category={article.category} light />
    </div>
  )}

  {/* Lado direito — texto */}
  <div className="flex flex-col justify-between bg-white p-8">
    <div>
      <span className="font-[family-name:var(--font-cormorant)] text-[6rem] font-light leading-none text-[#556040]/8 select-none">
        {article.num}
      </span>
      <h2 className="-mt-4 font-[family-name:var(--font-cormorant)] text-[clamp(1.6rem,2.4vw,2.4rem)] font-light leading-[1.1] text-[#2D2D2D]">
        {article.title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-[#2D2D2D]/50">{article.excerpt}</p>
    </div>
    <div className="mt-6 flex items-center gap-4 border-t border-[#556040]/10 pt-5">
      <span className="text-[11px] text-[#2D2D2D]/40">{article.date}</span>
      <Clock className="size-3 text-[#2D2D2D]/25" strokeWidth={1.5} />
      <span className="text-[11px] text-[#2D2D2D]/40">{article.readTime}</span>
      <Eye className="ml-1 size-3 text-[#2D2D2D]/25" strokeWidth={1.5} />
      <span className="text-[11px] text-[#2D2D2D]/40">{article.views.toLocaleString('pt-BR')}</span>
      <ArrowRight className="ml-auto size-4 text-[#556040]/40 transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
    </div>
  </div>
</Link>
```

### Cards de grid (3 colunas)

Grid com `gap-5` e `rounded-2xl`. Duas variações baseadas na presença de imagem de capa:

**Com imagem:**
- Fundo branco, foto no topo (`h-48`), overlay verde sutil, tag no canto inferior esquerdo da foto

**Sem imagem:**
- Alterna entre `bg-[#556040]` (escuro) e `bg-[#B8AEA4]/30` (pedra) por índice
- Número decorativo de fundo (Cormorant, 8rem, opacity muito baixa)

```tsx
// Regra de alternância de fundo (sem imagem)
const isDark = !hasImage && index % 2 === 0
const bg = isDark ? 'bg-[#556040]' : hasImage ? 'bg-white' : 'bg-[#B8AEA4]/30'
```

**Hover em cards de grid:**

```tsx
className="... transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
```

### TagBadge — componente de categoria

```tsx
function TagBadge({ category, className = '', light = false }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.22em]
      ${light ? 'bg-white/20 text-white' : 'bg-[#556040]/10 text-[#556040]'}
      ${className}`}>
      {category}
    </span>
  )
}
```

- `light={true}` — fundo branco translúcido, texto branco (sobre imagem ou fundo escuro)
- `light={false}` — fundo verde translúcido, texto verde (sobre fundo branco ou pedra)

### Footer de card (metadata)

```tsx
<div className="flex items-center gap-3 border-t pt-4">
  <span>{article.date}</span>
  <Clock className="ml-auto size-3" strokeWidth={1.5} />
  <span>{article.readTime}</span>
  <Eye className="size-3" strokeWidth={1.5} />
  <span>{article.views.toLocaleString('pt-BR')}</span>
</div>
```

---

## 7. Filtros e Busca

### Barra de filtros do blog

Sticky no topo, `z-40`, fundo semi-transparente com blur.

```tsx
<div className="sticky top-0 z-40 border-b border-[#2D2D2D]/8 bg-white/95 backdrop-blur-sm">
  <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-6 py-3 sm:px-10">

    {/* Busca por texto */}
    <div className="relative min-w-[200px] flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#2D2D2D]/35" />
      <input type="text" placeholder="Buscar artigos…"
        className="h-9 w-full rounded-full border border-[#2D2D2D]/12 bg-[#556040]/4 pl-8 pr-4 text-sm placeholder:text-[#2D2D2D]/35 focus:border-[#556040]/40 focus:outline-none" />
    </div>

    {/* Multi-select de categorias — dropdown customizado */}
    <div ref={catRef} className="relative">
      <button className="flex h-9 items-center gap-2 rounded-full border border-[#2D2D2D]/12 bg-[#556040]/4 px-4 text-sm text-[#2D2D2D]/70">
        {selectedCategories.length === 0 ? 'Temas' : `${selectedCategories.length} tema(s)`}
        <ChevronDown className="size-3.5" />
      </button>
      {catOpen && (
        <div className="absolute top-full mt-1.5 z-50 min-w-[200px] rounded-xl border border-[#2D2D2D]/10 bg-white p-1.5 shadow-lg">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-[#556040]/6">
              <input type="checkbox" className="size-3.5 rounded accent-[#556040]" />
              <span className="text-[12px] text-[#2D2D2D]/70">{cat}</span>
            </label>
          ))}
        </div>
      )}
    </div>

    {/* Ordenação — shadcn Select */}
    <Select value={sort} onValueChange={setSort}>
      <SelectTrigger className="h-9 w-auto min-w-[150px] rounded-full border-[#2D2D2D]/12 bg-[#556040]/4 px-4 text-sm text-[#2D2D2D]/70">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">Mais recentes</SelectItem>
        <SelectItem value="oldest">Mais antigos</SelectItem>
        <SelectItem value="most_read">Mais lidos</SelectItem>
        <SelectItem value="az">A → Z</SelectItem>
        <SelectItem value="za">Z → A</SelectItem>
      </SelectContent>
    </Select>

    {/* Limpar filtros — só aparece quando há filtros ativos */}
    {hasFilters && (
      <button className="flex h-9 items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-4 text-sm text-red-500 hover:bg-red-100">
        <X className="size-3.5" />
        Limpar filtros
      </button>
    )}

    {/* Contador de resultados */}
    <span className="ml-auto text-[11px] text-[#2D2D2D]/35">
      {count} resultado(s)
    </span>
  </div>
</div>
```

### Regras de filtros

- **Nunca** usar `<select>` nativo — sempre shadcn `<Select>` ou dropdown customizado
- O botão "Limpar filtros" só aparece quando `search !== '' || selectedCategories.length > 0 || sort !== 'recent'`
- Qualquer mudança de filtro deve resetar `page` para `1`
- O dropdown de multi-select fecha ao clicar fora (`mousedown` no `document`)
- Estado de "Nenhum resultado" usa Cormorant em opacidade baixa para manter o estilo editorial

---

## 8. Paginação

Usa o componente shadcn `<Pagination>` com texto em **português**.

> O arquivo `src/components/ui/pagination.tsx` foi modificado: "Previous" → **"Anterior"**, "Next" → **"Próximo"**.

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        href="#"
        onClick={e => { e.preventDefault(); goToPage(page - 1) }}
        className={page === 1 ? 'pointer-events-none opacity-40' : ''}
      />
    </PaginationItem>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
      <PaginationItem key={p}>
        <PaginationLink href="#" isActive={p === page} onClick={e => { e.preventDefault(); goToPage(p) }}>
          {p}
        </PaginationLink>
      </PaginationItem>
    ))}

    <PaginationItem>
      <PaginationNext
        href="#"
        onClick={e => { e.preventDefault(); goToPage(page + 1) }}
        className={page === totalPages ? 'pointer-events-none opacity-40' : ''}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

- `goToPage` sempre faz `window.scrollTo({ top: 0, behavior: 'smooth' })`
- A paginação só renderiza quando `totalPages > 1`
- Por padrão: **4 artigos por página** (`PER_PAGE = 4`) — o primeiro da página 1 é o "featured"

---

## 9. Carousel de Avaliações

Implementação **customizada** — sem Embla (conflito com Turbopack na resolução de módulos).

### Por que `overflow-x: clip` e não `overflow-x: hidden`

`overflow-x: hidden` cria um Block Formatting Context, forçando `overflow-y: auto` e cortando o efeito de `scale` nos cards. `overflow-x: clip` recorta geometricamente sem criar BFC, mantendo `overflow-y: visible`.

```tsx
// CarouselContent — wrapper que permite scale sem clip
<div style={{ overflowX: 'clip' }}>
  <div
    className="flex transition-transform duration-500 ease-in-out"
    style={{ transform: `translateX(calc(${-currentIndex} * var(--slide-w, 0px)))` }}
  >
    {slides}
  </div>
</div>
```

### Autoplay

```typescript
// setInterval de 3500ms — sem biblioteca externa
useEffect(() => {
  const id = setInterval(() => api?.scrollNext(), 3500)
  return () => clearInterval(id)
}, [api])
```

### CSS var `--slide-w`

Cada `CarouselItem` usa `ResizeObserver` para definir a variável que o wrapper usa no `transform`:

```tsx
// CarouselItem
const ref = useRef<HTMLDivElement>(null)
useEffect(() => {
  if (!ref.current) return
  const ro = new ResizeObserver(() => {
    ref.current?.style.setProperty('--slide-w', `${ref.current.offsetWidth}px`)
  })
  ro.observe(ref.current)
  return () => ro.disconnect()
}, [])
```

---

## 10. Seções de Conteúdo

### Separação entre seções

Seções são diferenciadas por **mudança de cor de fundo**, nunca por margin extra. A sequência padrão:

```
[#556040] Hero / Blog / Blog preview
[white]   Avaliações
[white]   Blog & Reflexões (com bg interno #556040)
[white]   Sobre
[#B8AEA4] Especialidades (alternado por seção)
[white]   Contato
```

### Especialidades — grid 60/40

Cada especialidade tem imagem e texto em grid assimétrico com gradiente de blendagem:

```tsx
// O blendColor é calculado multiplicando o RGB por 0.8 (simula bg-black/20 sobre o verde)
// Fundo verde: rgb(85,96,64) × 0.8 = rgb(68,77,51) → #444D33
// Gradiente vai da cor sólida para a imagem com overlay
```

---

# Gestor (Back-office)

## 11. Espaçamento e Raio de Borda

### Raio de borda

Derivados da variável `--radius: 0.625rem` (10px):

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-sm` | 6px | Badges pequenos, pills |
| `rounded-md` | 8px | Botões sm, inputs menores |
| `rounded-lg` | 10px | **Padrão** — inputs, selects, cards |
| `rounded-xl` | 14px | Dialogs, popovers, mapa de contato |
| `rounded-2xl` | 18px | Cards do blog, painéis maiores |
| `rounded-full` | 9999px | Nav pill, tags de filtro, botão "Agendar" |

### Espaçamento em formulários

| Elemento | Espaçamento |
|----------|-------------|
| Gap entre campos de um form | `gap-4` (16px) |
| Gap entre label e campo | `gap-1.5` (6px) — usar `space-y-1.5` no wrapper |
| Padding interno de card/dialog body | `p-6` (24px) |
| Gap entre botões no footer | `gap-2` (8px) |
| Padding de tabela (célula) | `px-4 py-3` |

---

## 12. Sombras

```css
/* Uso: elementos elevados sobre o fundo (cards, dropdowns, dialogs) */
.shadow-shape {
  box-shadow:
    0px 8px 8px rgba(0,0,0,0.1),
    0px 4px 4px rgba(0,0,0,0.1),
    0px 2px 2px rgba(0,0,0,0.1),
    0px 0px 0px 1px rgba(0,0,0,0.1),
    inset 0px 0px 0px 1px rgba(255,255,255,0.03),
    inset 0px 1px 0px rgba(255,255,255,0.03);
}
```

`shadow-xs` (Tailwind padrão) → inputs, selects, botões — sombra mínima para profundidade.

---

## 13. Botões

### Variantes

| Variant | Quando usar |
|---------|-------------|
| `default` | Ação principal neutra |
| `create` | Criar novo registro |
| `destructive` | Apagar, ação irreversível (modal de confirmação) |
| `outline` | Ação secundária com borda |
| `secondary` | Alternativa suave ao outline |
| `ghost` | Ações em tabelas, ícone + texto, sem destaque |
| `link` | Navegação inline |

### Tamanhos

| Size | Altura | Uso |
|------|--------|-----|
| `xs` | 24px | Ações em linha, chips, ações secundárias em tabela |
| `sm` | 32px | Botões em cabeçalho de tabela, filtros |
| `default` | 36px | **Padrão** — formulários, footers de dialog |
| `lg` | 40px | CTAs de destaque |
| `icon` | 36×36px | Ícone sem texto |
| `icon-sm` | 32×32px | Ícone secundário |
| `icon-xs` | 24×24px | Ícone em linha |

### Estado de loading

```tsx
<Button type="submit" loading={isLoading} loadingLabel="Salvando…">
  Salvar
</Button>
```

Regras:
- Todo botão de submit de formulário **deve** usar `loading={isSubmitting}`
- `loadingLabel` deve estar no gerúndio ("Salvando…", "Criando…", "Entrando…")
- Nunca desabilitar botão manualmente sem usar `loading`

### Botões de ação em tabelas

```tsx
<Button variant="ghost" size="icon-sm"><PencilIcon /></Button>
<Button variant="ghost" size="icon-sm"><Trash2Icon /></Button>
```

---

## 14. Inputs e Campos de Formulário

### Input — padrão

```tsx
<Input id="title" name="title" placeholder="Título" aria-invalid={!!errors.title} />
```

- Altura: `h-9` (36px) · Padding: `px-3 py-1` · Borda: `border rounded-md`
- Foco: `focus-visible:ring-2` · Erro: `aria-invalid` · Texto: `text-sm` · Sombra: `shadow-xs`

### Textarea

```tsx
<Textarea rows={4} placeholder="Descrição…" className="resize-none" aria-invalid={!!errors.description} />
```

- Altura mínima: `min-h-16` · `field-sizing-content` · **Sempre** `resize-none`

### Regras gerais de campos

- Todo campo obrigatório tem `*` no label
- Todo campo deve ter `id` e o Label com `htmlFor` correspondente
- Nunca usar `placeholder` como substituto do label
- Hint: `<p className="text-xs">` com `id` + `aria-describedby` no input
- Campos desabilitados: prop `disabled` — nunca `opacity-50` manual

---

## 15. Select e Combobox

### Select (opções fixas, lista curta)

```tsx
<Select name="categoryId" defaultValue={categoryId}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Selecione uma opção" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="id">Nome da opção</SelectItem>
  </SelectContent>
</Select>
```

- Tamanhos: `size="default"` (h-9) ou `size="sm"` (h-8)
- Sempre `w-full` dentro de formulários
- **Nunca** usar `<select>` nativo — sempre shadcn ou dropdown customizado

### FilterCombobox (busca + seleção)

Usar quando lista > 8 itens ou usuário precisa buscar:

```tsx
<FilterCombobox value={selectedId} onChange={setSelectedId} placeholder="Buscar…" options={options} />
```

### Combobox/Select dentro de Dialog

```tsx
const dialogRef = useDialogContentRef()
<SelectContent container={dialogRef.current}>...</SelectContent>
```

---

## 16. Labels e Descrições

```tsx
// Obrigatório
<Label htmlFor="slug">Slug <span className="font-normal">(URL)</span> *</Label>

// Com ícone
<Label htmlFor="date" className="flex items-center gap-2">
  <CalendarIcon className="size-3.5" /> Data de início *
</Label>
```

- `text-sm font-medium leading-none` — sempre
- `space-y-1.5` no wrapper `<div>` entre label e campo

---

## 17. Validação e Feedback de Erro

### Padrão `aria-invalid`

```tsx
<Input name="email" aria-invalid={!!fieldError} aria-describedby={fieldError ? 'email-error' : undefined} />
{fieldError && <p id="email-error" className="text-xs">{fieldError}</p>}
```

### Validação com Zod

```typescript
export const myFormSchema = z.object({
  title: z.string().trim().min(1, 'Título obrigatório.').max(300, 'Máximo 300 caracteres.'),
  slug:  z.string().trim().min(1, 'Slug obrigatório.').regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Apenas minúsculas, números e hífens.'),
  url:   z.string().trim().url('URL inválida.').nullable().optional(),
})
```

Mensagens: direto e instrucional, sempre com ponto final, nunca genérico ("Campo inválido").

---

## 18. Toasts e Notificações

```tsx
import { toast } from 'sonner'
toast.success('Salvo com sucesso!')
toast.error('Erro ao salvar. Tente novamente.')
```

| Tipo | Quando |
|------|--------|
| `success` | Operação CRUD concluída |
| `error` | Falha na API, erro de conexão |
| `warning` | Ação parcialmente bem-sucedida |
| `loading` | Operação demorada |

- **Nunca** usar `alert()` ou `confirm()` — sempre Sonner + AlertDialog
- Para deleções: AlertDialog de confirmação + toast após

---

## 19. Dialogs e Modais

```tsx
<Dialog open={open} onOpenChange={handleOpenChange}>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Criar item</DialogTitle>
      <DialogDescription>Preencha os dados.</DialogDescription>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* campos */}
    </form>
    <DialogFooter>
      <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancelar</Button>
      <Button type="submit" loading={loading} loadingLabel="Salvando…">Salvar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tamanhos de dialog

| className | Largura | Uso |
|-----------|---------|-----|
| padrão | 32rem | Formulários simples (1–4 campos) |
| `sm:max-w-2xl` | 42rem | Formulários médios |
| `sm:max-w-4xl` | 56rem | Formulários complexos (grade 2 colunas) |

### Limpeza de estado ao fechar

```typescript
function handleOpenChange(next: boolean) {
  if (!next) { setErrors({}); setLoading(false) }
  setOpen(next)
}
```

### AlertDialog — confirmação de deleção

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="ghost" size="icon-sm"><Trash2Icon /></Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Apagar "{item.title}"?</AlertDialogTitle>
      <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>Apagar</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 20. Tabelas do Gestor

```tsx
<div className="rounded-xl border overflow-hidden">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[300px]">Nome</TableHead>
        <TableHead className="text-right w-[100px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map(item => (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-1">
              {/* botões de ação */}
            </div>
          </TableCell>
        </TableRow>
      ))}
      {items.length === 0 && (
        <TableRow>
          <TableCell colSpan={2} className="py-8 text-center text-sm">
            Nenhum registro encontrado.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</div>
```

---

## 21. ScrollArea

| Situação | Componente |
|----------|-----------|
| Lista em Dialog/Popover com altura limitada | `ScrollArea` |
| Dropdown de Select com muitos itens | Automático — `SelectContent` já usa `ScrollArea` |
| Overflow simples de página | CSS `overflow-y-auto` nativo |

---

## 22. Ícones

```tsx
import { PlusIcon, PencilIcon, Trash2Icon, Loader2Icon } from 'lucide-react'
```

| Contexto | Tamanho | Classe |
|----------|---------|--------|
| Ícone em botão default/sm | 16px | `size-4` (automático pelo Button) |
| Ícone em botão xs | 12px | `size-3` |
| Ícone em label | 14px | `size-3.5` |
| Ícone de metadata em card | 12px | `size-3` |
| Ícone decorativo em seção | 20–24px | `size-5` / `size-6` |

- Ícones dentro de `<Button>` **não precisam** de `className="size-*"` — o Button já define o tamanho
- `aria-hidden` em ícones puramente decorativos
- Nunca usar emojis como ícones funcionais

---

## 23. Imagens

```tsx
// Assets estáticos em public/ — usar next/image
import Image from 'next/image'
<Image src="/foto.jpg" alt="Descrição acessível" width={800} height={600} className="rounded-lg object-cover" />

// URLs externas (Unsplash, CDN) nas páginas públicas — <img> nativo permitido
<img src={article.image} alt={article.title} className="h-full w-full object-cover" />
```

### CSP em `next.config.ts`

```typescript
// Unsplash permitido como fonte de imagem
"img-src 'self' data: blob: https://images.unsplash.com"
```

- **Nunca** aceitar SVG em uploads de usuário

---

## 24. Animações

- `transition-[color,box-shadow]` para hover/focus — nunca `transition-all`
- `duration-150` para micro-interações · `duration-300` para transições maiores
- `duration-500` para o carousel (translate entre slides)
- `duration-700 group-hover:scale-[1.03]` para imagens de card featured (zoom suave)
- Radix UI gerencia animações de dialogs/popovers via `data-[state=open/closed]`
- Respeitar `prefers-reduced-motion` via `motion-safe:` / `motion-reduce:`

---

## 25. Padrões de Composição

### Wrapper de campo de formulário

```tsx
<div className="space-y-1.5">
  <Label htmlFor="fieldId">Nome do campo *</Label>
  <Input id="fieldId" name="fieldName" aria-invalid={!!error} />
  {error && <p id="fieldId-error" className="text-xs">{error}</p>}
</div>
```

### Estado de loading em lista (skeleton)

```tsx
if (isLoading) {
  return (
    <div className="space-y-2">
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}
```

### Skeleton de página (Suspense)

```tsx
// page.tsx
export default function Page() {
  return <Suspense fallback={<MySkeleton />}><MySection /></Suspense>
}

// skeleton usa bg-white/10 animate-pulse para fundos escuros
// ou bg-[#2D2D2D]/8 animate-pulse para fundos brancos
```

### Checklist antes de entregar um componente (gestor)

- [ ] Labels com `htmlFor` em todos os campos
- [ ] `aria-invalid` nos campos com erro
- [ ] `aria-describedby` apontando para hint e/ou erro
- [ ] Botão de submit com `loading` + `loadingLabel`
- [ ] Estado vazio tratado (tabela, lista)
- [ ] Dialog limpa o estado ao fechar (`handleOpenChange`)
- [ ] Toast de feedback em todo submit (sucesso e erro)
- [ ] `router.refresh()` após mutations bem-sucedidas
- [ ] Campos obrigatórios marcados com `*` no label

### Checklist antes de entregar uma página pública

- [ ] Nav pill com logo, links centralizados e botão "Agendar"
- [ ] Links de âncora usando `/#hash` (não `#hash`)
- [ ] Fonte Cormorant nos títulos editoriais
- [ ] Paleta respeitada: verde `#556040`, pedra `#B8AEA4`, texto `#2D2D2D`
- [ ] `max-w-7xl` com `px-6 sm:px-10` em todo conteúdo
- [ ] Cards com `rounded-2xl` e `border border-[#2D2D2D]/8`
- [ ] Hover nos cards: `hover:-translate-y-0.5 hover:shadow-md`
- [ ] Imagens de fundo com overlay verde sutil `bg-[#556040]/15`
- [ ] Paginação usando shadcn com texto em português
