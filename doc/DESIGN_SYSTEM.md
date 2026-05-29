# Design System — Padrões de UI

**Stack:** Next.js · Tailwind CSS v4 · shadcn/ui · Radix UI · Lucide Icons

Este documento define padrões de interface para componentes, formulários e interações. **Paleta de cores e estrutura das páginas públicas ainda não estão definidas** — não documentar nem hardcodar esses aspectos até nova orientação.

---

## Índice

1. [Tipografia](#1-tipografia)
2. [Espaçamento e Raio de Borda](#2-espaçamento-e-raio-de-borda)
3. [Sombras](#3-sombras)
4. [Botões](#4-botões)
5. [Inputs e Campos de Formulário](#5-inputs-e-campos-de-formulário)
6. [Select e Combobox](#6-select-e-combobox)
7. [Labels e Descrições](#7-labels-e-descrições)
8. [Validação e Feedback de Erro](#8-validação-e-feedback-de-erro)
9. [Toasts e Notificações](#9-toasts-e-notificações)
10. [Dialogs e Modais](#10-dialogs-e-modais)
11. [Tabelas do Gestor](#11-tabelas-do-gestor)
12. [ScrollArea](#12-scrollarea)
13. [Ícones](#13-ícones)
14. [Imagens](#14-imagens)
15. [Animações](#15-animações)
16. [Padrões de Composição](#16-padrões-de-composição)

---

## 1. Tipografia

### Fontes do projeto

```typescript
// layout.tsx
const inter  = Inter({ subsets: ['latin'], variable: '--font-inter',  weight: ['300','400','500','600','700'] })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', weight: ['400','700','900'] })
```

| Fonte | Variável CSS | Uso |
|-------|-------------|-----|
| **Inter** | `--font-inter` | Corpo, formulários, tabelas, gestor |
| **Cinzel** | `--font-cinzel` | Marca/logo, títulos institucionais |

> Adicionar novas fontes apenas quando houver necessidade editorial clara. O gestor usa exclusivamente Inter.

### Escala tipográfica — Gestor

| Elemento | Classes Tailwind | Tamanho | Peso |
|----------|-----------------|---------|------|
| Título de página | `text-2xl font-semibold tracking-tight` | 24px | 600 |
| Título de seção | `text-lg font-semibold` | 18px | 600 |
| Título de dialog | `text-lg leading-none font-semibold` | 18px | 600 |
| Subtítulo / label de grupo | `text-sm font-medium` | 14px | 500 |
| Label de campo | `text-sm font-medium` | 14px | 500 |
| Corpo / valor | `text-sm` | 14px | 400 |
| Texto auxiliar / hint | `text-xs` | 12px | 400 |
| Erro de campo | `text-xs` | 12px | 400 |
| Description de dialog | `text-sm` | 14px | 400 |
| Badge / pill | `text-xs font-medium` | 12px | 500 |

### Regras

- **Nunca** usar `text-base` (16px) no gestor — usar `text-sm` (14px) como padrão
- Títulos de página e de dialog usam `font-semibold` (600), nunca `font-bold` (700)
- `antialiased` no `<body>` global — não repetir nos componentes

---

## 2. Espaçamento e Raio de Borda

### Raio de borda

Derivados da variável `--radius: 0.625rem` (10px):

| Token | Valor | Uso |
|-------|-------|-----|
| `rounded-sm` | 6px | Badges pequenos, pills |
| `rounded-md` | 8px | Botões sm, inputs menores |
| `rounded-lg` | 10px | **Padrão** — inputs, selects, cards |
| `rounded-xl` | 14px | Dialogs, popovers |
| `rounded-2xl` | 18px | Cards maiores, painéis |
| `rounded-full` | 9999px | Tags de seleção, avatares |

### Espaçamento em formulários

| Elemento | Espaçamento |
|----------|-------------|
| Gap entre campos de um form | `gap-4` (16px) |
| Gap entre label e campo | `gap-1.5` (6px) — usar `space-y-1.5` no wrapper |
| Padding interno de card/dialog body | `p-6` (24px) |
| Gap entre botões no footer | `gap-2` (8px) |
| Padding de tabela (célula) | `px-4 py-3` |

---

## 3. Sombras

### Sombras utilitárias

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

## 4. Botões

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
// Sempre usar loading + loadingLabel em submits assíncronos
<Button type="submit" loading={isLoading} loadingLabel="Salvando…">
  Salvar
</Button>
```

Regras:
- Todo botão de submit de formulário **deve** usar `loading={isSubmitting}`
- `loadingLabel` deve estar no gerúndio ("Salvando…", "Criando…", "Entrando…")
- Nunca desabilitar botão manualmente sem usar `loading` — o botão já se desabilita ao receber `loading={true}`

### Botões de ação em tabelas

```tsx
// Editar
<Button variant="ghost" size="icon-sm">
  <PencilIcon />
</Button>

// Apagar
<Button variant="ghost" size="icon-sm">
  <Trash2Icon />
</Button>
```

---

## 5. Inputs e Campos de Formulário

### Input — padrão

```tsx
<Input
  id="title"
  name="title"
  placeholder="Título"
  aria-invalid={!!errors.title}
/>
```

Especificações do componente:
- Altura: `h-9` (36px)
- Padding: `px-3 py-1`
- Borda: `border rounded-md`
- Foco: `focus-visible:ring-2`
- Erro: `aria-invalid` no campo
- Texto: `text-sm` (md+), `text-base` (mobile)
- Sombra: `shadow-xs`

### Textarea

```tsx
<Textarea
  rows={4}
  placeholder="Descrição…"
  className="resize-none"
  aria-invalid={!!errors.description}
/>
```

- Altura mínima: `min-h-16` (64px)
- `field-sizing-content` — expande automaticamente com o conteúdo
- **Sempre** `resize-none` — deixar o auto-expand fazer o trabalho
- Mesmas regras de foco e erro do Input

### Regras gerais de campos

- Todo campo **obrigatório** tem `*` no label: `Título *`
- Todo campo deve ter `id` e o Label correspondente com `htmlFor` igual
- Nunca usar `placeholder` como substituto do label — label é sempre obrigatório
- Hint abaixo do campo usa `<p className="text-xs">` com `id` e `aria-describedby` no input
- Campos desabilitados: `disabled` prop — nunca usar `opacity-50` manualmente

---

## 6. Select e Combobox

### Select (opções fixas, lista curta)

```tsx
<Select name="categoryId" defaultValue={categoryId}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Selecione uma opção" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="uuid-aqui">Nome da opção</SelectItem>
  </SelectContent>
</Select>
```

- Tamanhos: `size="default"` (h-9) ou `size="sm"` (h-8)
- Sempre `w-full` dentro de formulários
- O `SelectContent` usa `ScrollArea` internamente — listas longas funcionam automaticamente
- Erro: `aria-invalid` no `SelectTrigger`

### FilterCombobox (busca + seleção)

Usar quando:
- Lista > 8 itens
- Usuário precisa buscar dentro da lista

```tsx
<FilterCombobox
  value={selectedId}
  onChange={setSelectedId}
  placeholder="Buscar…"
  options={options}
  labelForValue={id => labels[id] ?? id}
/>
```

### Regras

- **Select** para listas curtas e fixas (até ~10 itens, sem busca)
- **FilterCombobox** para listas longas ou dinâmicas
- Nunca usar `<select>` nativo — sempre os componentes Radix
- Conteúdo do Select/Combobox dentro de Dialog: usar `useDialogContentRef()` para o portal

---

## 7. Labels e Descrições

### Label de campo

```tsx
// Obrigatório
<Label htmlFor="slug">
  Slug <span className="font-normal">(URL)</span> *
</Label>

// Com ícone de suporte
<Label htmlFor="date" className="flex items-center gap-2">
  <CalendarIcon className="size-3.5" />
  Data de início *
</Label>
```

Especificações:
- `text-sm font-medium` — sempre
- `leading-none` — evitar desalinhamento com o campo
- Espaçamento até o campo: `space-y-1.5` no wrapper `<div>`

### Hint / texto auxiliar

```tsx
<div className="space-y-1.5">
  <Label htmlFor="slug">Slug *</Label>
  <Input id="slug" aria-describedby="slug-hint" />
  <p id="slug-hint" className="text-xs">
    Usado na URL. Ex: minha-pagina
  </p>
</div>
```

### Texto de erro de campo

```tsx
{errors.slug && (
  <p className="text-xs">{errors.slug}</p>
)}
```

---

## 8. Validação e Feedback de Erro

### Padrão `aria-invalid`

Todos os componentes (Input, Textarea, Select, Button) aceitam `aria-invalid`. Quando `true`, o componente aplica estilo de erro conforme o tema.

```tsx
<Input
  name="email"
  aria-invalid={!!fieldError}
  aria-describedby={fieldError ? 'email-error' : undefined}
/>
{fieldError && (
  <p id="email-error" className="text-xs">{fieldError}</p>
)}
```

### Validação com Zod — padrão de schemas

```typescript
// src/lib/validation/my-form.ts
import { z } from 'zod'

export const myFormSchema = z.object({
  title: z.string().trim().min(1, 'Título obrigatório.').max(300, 'Máximo 300 caracteres.'),
  slug:  z.string().trim().min(1, 'Slug obrigatório.').max(200)
           .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Apenas minúsculas, números e hífens.'),
  url:   z.string().trim().url('URL inválida.').max(2000).nullable().optional(),
  date:  z.string().trim().min(1, 'Data obrigatória.').refine(s => !isNaN(Date.parse(s)), 'Data inválida.'),
})
```

Mensagens de erro:
- **Tom:** direto e instrucional ("Slug obrigatório.", "Selecione uma opção.")
- **Sem** "Campo inválido" genérico — sempre dizer o que fazer
- **Sempre** com ponto final
- Para campos de formato: incluir exemplo ("Apenas minúsculas, números e hífens.")

### Validação no submit (Client Component)

```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const fd = new FormData(e.currentTarget)

  const parsed = myFormSchema.safeParse(Object.fromEntries(fd))
  if (!parsed.success) {
    const errs = parsed.error.flatten().fieldErrors
    setErrors(errs)
    toast.error('Corrija os erros antes de continuar.')
    return
  }

  setLoading(true)
  try {
    const res = await fetch('/api/resources', { method: 'POST', body: fd })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      const msg = typeof body.error === 'string' ? body.error : 'Erro ao salvar.'
      toast.error(msg)
      return
    }
    toast.success('Criado com sucesso!')
    setOpen(false)
    router.refresh()
  } catch {
    toast.error('Erro de conexão. Tente novamente.')
  } finally {
    setLoading(false)
  }
}
```

---

## 9. Toasts e Notificações

### Biblioteca: Sonner

```tsx
import { toast } from 'sonner'

toast.success('Salvo com sucesso!')
toast.error('Erro ao salvar. Tente novamente.')
toast.loading('Salvando…')
```

### Ícones customizados

```tsx
import { CircleCheckIcon, OctagonXIcon, TriangleAlertIcon, Loader2Icon } from 'lucide-react'

toast.success('Salvo!',    { icon: <CircleCheckIcon  className="size-4" /> })
toast.error('Erro!',       { icon: <OctagonXIcon     className="size-4" /> })
toast.warning('Atenção!',  { icon: <TriangleAlertIcon className="size-4" /> })
toast.loading('Aguarde…',  { icon: <Loader2Icon      className="size-4 animate-spin" /> })
```

### Quando usar cada tipo

| Tipo | Quando |
|------|--------|
| `success` | Operação CRUD concluída |
| `error` | Falha na API, erro de conexão, erro inesperado |
| `warning` | Ação parcialmente bem-sucedida, avisos não bloqueantes |
| `loading` | Operação demorada — substituir por success/error ao concluir |

### Regras

- **Nunca** usar `alert()` ou `confirm()` — sempre Sonner + AlertDialog
- Para deleções: AlertDialog de confirmação + toast de sucesso/erro após
- Mensagens de sucesso: concisas ("Salvo.", "Removido.")
- Mensagens de erro: acionáveis ("Erro ao salvar. Tente novamente." não "Erro 500")

---

## 10. Dialogs e Modais

### Estrutura obrigatória

```tsx
<Dialog open={open} onOpenChange={handleOpenChange}>
  <DialogTrigger asChild>
    <Button variant="create" size="sm">
      <PlusIcon /> Novo item
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Criar item</DialogTitle>
      <DialogDescription>
        Preencha os dados.
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={handleSubmit} className="grid gap-4">
      {/* campos */}
    </form>

    <DialogFooter>
      <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
        Cancelar
      </Button>
      <Button type="submit" loading={loading} loadingLabel="Salvando…">
        Salvar
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Tamanhos de dialog

| Prop `className` | Largura | Uso |
|-----------------|---------|-----|
| padrão | 32rem (512px) | Formulários simples (1–4 campos) |
| `sm:max-w-lg` | 32rem | Formulários com até 6 campos |
| `sm:max-w-2xl` | 42rem | Formulários médios |
| `sm:max-w-4xl` | 56rem | Formulários complexos (grade de 2 colunas) |

Sempre incluir `max-h-[90vh] overflow-y-auto` em dialogs com muitos campos.

### Limpeza de estado ao fechar

```typescript
function handleOpenChange(next: boolean) {
  if (!next) {
    setErrors({})
    setLoading(false)
  }
  setOpen(next)
}
```

### Combobox/Select dentro de Dialog

```tsx
const dialogRef = useDialogContentRef()

<SelectContent container={dialogRef.current}>
  {/* ... */}
</SelectContent>
```

### AlertDialog — confirmação de deleção

```tsx
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="ghost" size="icon-sm">
      <Trash2Icon />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Apagar "{item.title}"?</AlertDialogTitle>
      <AlertDialogDescription>
        Esta ação não pode ser desfeita.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Apagar
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 11. Tabelas do Gestor

### Estrutura padrão

```tsx
<div className="rounded-xl border overflow-hidden">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead className="w-[300px]">Nome</TableHead>
        <TableHead>Categoria</TableHead>
        <TableHead className="text-right w-[100px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map(item => (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell>{item.category}</TableCell>
          <TableCell className="text-right">
            <div className="flex justify-end gap-1">
              {/* Botão editar */}
              {/* Botão apagar */}
            </div>
          </TableCell>
        </TableRow>
      ))}

      {items.length === 0 && (
        <TableRow>
          <TableCell colSpan={3} className="py-8 text-center text-sm">
            Nenhum registro encontrado.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</div>
```

### Padrões de célula

| Dado | Classes |
|------|---------|
| Nome / título principal | `font-medium` |
| Data | `tabular-nums` |
| Badge / status | Usar componente `<Badge>` |
| Coluna de ações | `text-right` no `TableHead`, `flex justify-end gap-1` no `TableCell` |
| Coluna de ícone/avatar | `w-10` no `TableHead` |

### Linha vazia

Sempre exibir mensagem quando a tabela está vazia. Nunca renderizar tabela com `<TableBody>` vazio.

---

## 12. ScrollArea

### Quando usar

| Situação | Componente |
|----------|-----------|
| Lista dentro de Dialog ou Popover com altura limitada | `ScrollArea` |
| Dropdown de Select com muitos itens | Automático — `SelectContent` já usa `ScrollArea` |
| Sidebar com navegação longa | `ScrollArea` na sidebar |
| Overflow simples de página | CSS `overflow-y-auto` nativo |

### Uso padrão

```tsx
<ScrollArea className="h-48">
  <div className="p-1">
    {items.map(item => (
      <div key={item.id}>
        {item.label}
      </div>
    ))}
  </div>
</ScrollArea>
```

### Regras

- Sempre definir altura máxima explícita em dialogs (`h-48`, `h-64`, `max-h-[60vh]`)
- Não usar `overflow-y: scroll` nativo dentro de dialogs — pode causar dupla scrollbar
- `overscroll-contain` no viewport para prevenir scroll da página ao atingir os limites

---

## 13. Ícones

### Biblioteca: Lucide React

```tsx
import { PlusIcon, PencilIcon, Trash2Icon, Loader2Icon } from 'lucide-react'
```

### Tamanhos padrão

| Contexto | Tamanho | Classe |
|----------|---------|--------|
| Ícone em botão default/sm | 16px | `size-4` (automático pelo Button) |
| Ícone em botão xs | 12px | `size-3` (automático pelo Button) |
| Ícone em label | 14px | `size-3.5` |
| Ícone em texto de hint | 12px | `size-3` |
| Ícone decorativo em card/seção | 20–24px | `size-5` / `size-6` |
| Ícone em cabeçalho de seção | 20px | `size-5` |

### Regras

- Ícones dentro de `<Button>` **não precisam** de `className="size-*"` — o Button já define o tamanho
- Adicionar `aria-hidden` em ícones puramente decorativos
- Nunca usar emojis como ícones funcionais — sempre Lucide

---

## 14. Imagens

### Next.js `<Image>` — padrão

```tsx
import Image from 'next/image'

<Image
  src="/foto.jpg"
  alt="Descrição acessível e específica"
  width={800}
  height={600}
  className="rounded-lg object-cover"
/>
```

### Configuração em `next.config.ts`

```typescript
images: {
  qualities: [75, 85],
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 2592000,
},
```

### Regras

- Sempre incluir `alt` descritivo
- Preferir `<Image>` do Next.js para assets estáticos em `public/`
- **Nunca** aceitar SVG em uploads de usuário — SVG pode conter scripts

---

## 15. Animações

### Transições de estado

Todos os componentes interativos usam `transition-[color,box-shadow]` para suavizar hover e focus. Nunca usar `transition-all` — é muito custoso.

### Animações de entrada (dialogs, popovers)

O Radix UI gerencia automaticamente via `data-[state=open/closed]`:

```css
data-[state=open]:animate-in
data-[state=closed]:animate-out
data-[state=closed]:fade-out-0
data-[state=open]:fade-in-0
data-[state=open]:zoom-in-95
```

### Spinner de loading

```tsx
<Loader2 className="size-4 animate-spin" aria-hidden />
```

### Regras

- Nunca criar animações CSS personalizadas sem necessidade clara
- `duration-150` é o padrão para micro-interações (hover, focus)
- `duration-300` para transições de estado maiores (dialog open/close)
- Respeitar `prefers-reduced-motion` — o Tailwind suporta via `motion-safe:` e `motion-reduce:`

---

## 16. Padrões de Composição

### Wrapper de campo de formulário

```tsx
<div className="space-y-1.5">
  <Label htmlFor="fieldId">
    Nome do campo {required && '*'}
  </Label>
  <Input
    id="fieldId"
    name="fieldName"
    aria-invalid={!!error}
    aria-describedby={error ? 'fieldId-error' : hint ? 'fieldId-hint' : undefined}
  />
  {hint && !error && (
    <p id="fieldId-hint" className="text-xs">{hint}</p>
  )}
  {error && (
    <p id="fieldId-error" className="text-xs">{error}</p>
  )}
</div>
```

### Grade de formulário em dialog

```tsx
// Formulário simples (1 coluna)
<form className="grid gap-4">

// Formulário com 2 colunas em tela larga
<form className="grid gap-4 sm:grid-cols-2">
  <div className="sm:col-span-2">
    <Label>Título *</Label>
    <Input name="title" />
  </div>
  <div>
    <Label>Data de início *</Label>
    <Input type="date" name="startDate" />
  </div>
  <div>
    <Label>Data de fim</Label>
    <Input type="date" name="endDate" />
  </div>
</form>
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

### Checklist antes de entregar um componente

- [ ] Labels com `htmlFor` em todos os campos
- [ ] `aria-invalid` nos campos com erro
- [ ] `aria-describedby` apontando para hint e/ou erro
- [ ] Botão de submit com `loading` + `loadingLabel`
- [ ] Estado vazio tratado (tabela, lista)
- [ ] Dialog limpa o estado ao fechar (`handleOpenChange`)
- [ ] Toast de feedback em todo submit (sucesso e erro)
- [ ] `router.refresh()` após mutations bem-sucedidas
- [ ] Campos obrigatórios marcados com `*` no label
