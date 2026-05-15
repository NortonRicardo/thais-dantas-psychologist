# Design System — Padrões de UI

**Stack:** Next.js · Tailwind CSS v4 · shadcn/ui · Radix UI · Lucide Icons

Este documento define os padrões de interface que devem ser seguidos à risca em todo o projeto. Para adaptar a outro projeto, troque apenas os valores na seção [1. Tokens de Cor](#1-tokens-de-cor). Todo o resto permanece igual.

---

## Índice

1. [Tokens de Cor](#1-tokens-de-cor)
2. [Tipografia](#2-tipografia)
3. [Espaçamento e Raio de Borda](#3-espaçamento-e-raio-de-borda)
4. [Sombras e Superfícies](#4-sombras-e-superfícies)
5. [Botões](#5-botões)
6. [Inputs e Campos de Formulário](#6-inputs-e-campos-de-formulário)
7. [Select e Combobox](#7-select-e-combobox)
8. [Labels e Descrições](#8-labels-e-descrições)
9. [Validação e Feedback de Erro](#9-validação-e-feedback-de-erro)
10. [Toasts e Notificações](#10-toasts-e-notificações)
11. [Dialogs e Modais](#11-dialogs-e-modais)
12. [Tabelas do Gestor](#12-tabelas-do-gestor)
13. [ScrollArea](#13-scrollarea)
14. [Ícones](#14-ícones)
15. [Imagens](#15-imagens)
16. [Temas: Público vs. Gestor](#16-temas-público-vs-gestor)
17. [Animações](#17-animações)
18. [Padrões de Composição](#18-padrões-de-composição)

---

## 1. Tokens de Cor

> **Para adaptar a outro projeto: substitua apenas os valores oklch abaixo.**  
> O resto do sistema usa estes tokens por referência — nada de hardcode de cor fora daqui.

### globals.css — variáveis semânticas

```css
:root {
  --radius: 0.625rem;

  /* Superfícies */
  --background:         oklch(1 0 0);
  --foreground:         oklch(0.145 0 0);
  --card:               oklch(1 0 0);
  --card-foreground:    oklch(0.145 0 0);
  --popover:            oklch(1 0 0);
  --popover-foreground: oklch(0.145 0 0);

  /* Ação principal */
  --primary:            oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);

  /* Ação secundária */
  --secondary:            oklch(0.97 0 0);
  --secondary-foreground: oklch(0.205 0 0);

  /* Neutro */
  --muted:            oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --accent:           oklch(0.97 0 0);
  --accent-foreground:oklch(0.205 0 0);

  /* Destrutivo */
  --destructive: oklch(0.577 0.245 27.325);

  /* Formulários */
  --border: oklch(0.922 0 0);
  --input:  oklch(0.922 0 0);
  --ring:   oklch(0.708 0 0);
}

.dark {
  --background:         oklch(14.1% 0.005 285.823);
  --foreground:         oklch(0.985 0 0);
  --card:               oklch(0.205 0 0);
  --card-foreground:    oklch(0.985 0 0);
  --popover:            oklch(0.205 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary:            oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary:          oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted:              oklch(0.269 0 0);
  --muted-foreground:   oklch(0.708 0 0);
  --accent:             oklch(0.269 0 0);
  --accent-foreground:  oklch(0.985 0 0);
  --destructive:        oklch(0.704 0.191 22.216);
  --border:             oklch(1 0 0 / 10%);
  --input:              oklch(1 0 0 / 15%);
  --ring:               oklch(0.556 0 0);
}
```

### Hierarquia de uso

| Token | Quando usar |
|-------|-------------|
| `background` / `foreground` | Fundo e texto da página |
| `card` / `card-foreground` | Superfícies elevadas (cards, painéis) |
| `primary` | Botão principal, links de ação |
| `destructive` | Erros, deleções, alertas críticos |
| `muted-foreground` | Texto secundário, placeholders de contexto |
| `border` | Bordas de inputs, divisores |
| `ring` | Anel de foco em todos os elementos interativos |

### Cores de acento (fixas por projeto)

Estas cores não são tokens — são escolhas do projeto específico que **não mudam entre temas**:

| Cor | Uso |
|-----|-----|
| `teal-700` / `teal-600` | Botão de criação (`variant="create"`) |
| `sky-400` | Hover de botão de edição |
| `rose-500` | Hover de botão destrutivo (tabela) |
| `orange-*` | Seleção de multi-tags (temas, categorias) |

---

## 2. Tipografia

### Fontes do projeto

```typescript
// layout.tsx
const inter  = Inter({ subsets: ['latin'], variable: '--font-inter',  weight: ['300','400','500','600','700'] })
const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel', weight: ['400','700','900'] })
```

| Fonte | Variável CSS | Uso |
|-------|-------------|-----|
| **Inter** | `--font-inter` | Corpo, formulários, tabelas, gestor inteiro |
| **Cinzel** | `--font-cinzel` | Marca/logo, títulos institucionais |

> Adicionar novas fontes apenas quando há uma necessidade editorial clara (ex.: Orbitron para hero de landing). O gestor usa exclusivamente Inter.

### Escala tipográfica — Gestor

| Elemento | Classes Tailwind | Tamanho | Peso |
|----------|-----------------|---------|------|
| Título de página | `text-2xl font-semibold tracking-tight` | 24px | 600 |
| Título de seção | `text-lg font-semibold` | 18px | 600 |
| Título de dialog | `text-lg leading-none font-semibold` | 18px | 600 |
| Subtítulo / label de grupo | `text-sm font-medium text-muted-foreground` | 14px | 500 |
| Label de campo | `text-sm font-medium` | 14px | 500 |
| Corpo / valor | `text-sm` | 14px | 400 |
| Texto auxiliar / hint | `text-xs text-muted-foreground` | 12px | 400 |
| Erro de campo | `text-xs text-destructive` | 12px | 400 |
| Description de dialog | `text-sm text-muted-foreground` | 14px | 400 |
| Badge / pill | `text-xs font-medium` | 12px | 500 |

### Escala tipográfica — Site público

| Elemento | Classes Tailwind | Notas |
|----------|-----------------|-------|
| H1 hero | `text-[clamp(1.65rem,5vw,3.75rem)] font-black uppercase leading-[1.05] tracking-tight` | Fluido com clamp |
| H2 seção | `text-3xl font-bold tracking-tight` ou `text-4xl` | |
| H3 card | `text-xl font-semibold` | |
| Corpo principal | `text-[0.9375rem] sm:text-[1.0625rem] leading-relaxed` | 15px/17px |
| Label de contexto | `text-xs uppercase tracking-[2px] text-white/55` | Orbitron, acento decorativo |

### Regras

- **Nunca** usar `text-base` (16px) no gestor — usar `text-sm` (14px) como padrão
- Títulos de página e de dialog usam `font-semibold` (600), nunca `font-bold` (700)
- Texto auxiliar e hints sempre em `text-muted-foreground`, nunca cor hardcoded
- `antialiased` no `<body>` global — não repetir nos componentes

---

## 3. Espaçamento e Raio de Borda

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

## 4. Sombras e Superfícies

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

/* Uso: superfícies secundárias (inputs com elevação, popovers leves) */
.shadow-rounded {
  box-shadow:
    0px 6px 10px rgba(0,0,0,0.1),
    0px 2px 6px rgba(0,0,0,0.1),
    inset 0px 1px 2px rgba(255,255,255,0.03);
}
```

`shadow-xs` (Tailwind padrão) → inputs, selects, botões — sombra mínima para profundidade.

### Superfícies do gestor (tema escuro)

| Superfície | Classe / valor |
|-----------|----------------|
| Fundo do dialog | `bg-[#071525]` ou `bg-card` |
| Input sobre fundo escuro | `bg-white/5 border-white/10` |
| Input focado | `border-white/30` |
| Texto principal | `text-white` |
| Texto secundário | `text-white/70` |
| Texto de placeholder | `text-white/30` |
| Separadores / bordas | `border-white/10` |

---

## 5. Botões

### Variantes

| Variant | Quando usar | Aparência |
|---------|-------------|-----------|
| `default` | Ação principal neutra | `bg-primary text-primary-foreground` |
| `create` | Criar novo registro | `bg-teal-700 text-white` |
| `destructive` | Apagar, ação irreversível (modal de confirmação) | `bg-destructive text-white` |
| `outline` | Ação secundária com borda | Fundo transparente + borda |
| `secondary` | Alternativa suave ao outline | `bg-zinc-200 dark:bg-zinc-700` |
| `ghost` | Ações em tabelas, ícone + texto, sem destaque | Hover sutil |
| `link` | Navegação inline | Texto com underline |

### Tamanhos

| Size | Altura | Uso |
|------|--------|-----|
| `xs` | 24px | Ações em linha, chips, ações secundárias em tabela |
| `sm` | 32px | Botões em cabeçalho de tabela, filtros |
| `default` | 36px | **Padrão** — formulários, footers de dialog |
| `lg` | 40px | CTA do site público |
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
<Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-sky-400 hover:bg-sky-400/10">
  <PencilIcon />
</Button>

// Apagar
<Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-rose-400 hover:bg-rose-500/10">
  <Trash2Icon />
</Button>
```

---

## 6. Inputs e Campos de Formulário

### Input — padrão (fundo claro)

```tsx
<Input
  id="title"
  name="title"
  placeholder="Título do projeto"
  aria-invalid={!!errors.title}
/>
```

Especificações do componente:
- Altura: `h-9` (36px)
- Padding: `px-3 py-1`
- Borda: `border border-input rounded-md`
- Foco: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-2`
- Erro: `aria-invalid:border-destructive aria-invalid:ring-destructive/20`
- Texto: `text-sm` (md+), `text-base` (mobile)
- Sombra: `shadow-xs`

### Input — sobre fundo escuro (gestor)

```tsx
const INPUT_CLS = 'bg-white/5 border-white/10 text-white placeholder:text-white/30 focus-visible:ring-0 focus-visible:border-white/30'

<Input className={INPUT_CLS} />
```

### Textarea

```tsx
<Textarea
  rows={4}
  placeholder="Descreva o projeto…"
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
- Hint abaixo do campo usa `<p className="text-xs text-muted-foreground">` com `id` e `aria-describedby` no input
- Campos desabilitados: `disabled` prop — nunca usar `opacity-50` manualmente

---

## 7. Select e Combobox

### Select (opções fixas, lista curta)

```tsx
<Select name="categoryId" defaultValue={categoryId}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Selecione uma categoria" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="uuid-aqui">Nome da categoria</SelectItem>
  </SelectContent>
</Select>
```

- Tamanhos: `size="default"` (h-9) ou `size="sm"` (h-8)
- Sempre `w-full` dentro de formulários
- O `SelectContent` usa `ScrollArea` internamente — listas longas funcionam automaticamente
- Erro: `aria-invalid` no `SelectTrigger`

### FilterCombobox (busca + multi-select)

Usar quando:
- Lista > 8 itens
- Usuário precisa buscar dentro da lista
- Seleção múltipla (ex.: temas de um projeto)

```tsx
<FilterCombobox
  options={themes.map(t => ({ value: t.id, label: t.name }))}
  selected={selectedIds}
  onSelectedChange={setSelectedIds}
  placeholder="Buscar tema…"
/>
```

### Regras

- **Select** para listas curtas e fixas (até ~10 itens, sem busca)
- **FilterCombobox** para listas longas, dinâmicas ou com multi-seleção
- Nunca usar `<select>` nativo — sempre os componentes Radix
- Conteúdo do Select/Combobox dentro de Dialog: usar `useDialogContentRef()` para o portal

---

## 8. Labels e Descrições

### Label de campo

```tsx
// Obrigatório
<Label htmlFor="slug">
  Slug <span className="text-muted-foreground font-normal">(URL)</span> *
</Label>

// Sobre fundo escuro (gestor)
<Label htmlFor="title" className="text-white/70">
  Título *
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
  <p id="slug-hint" className="text-xs text-muted-foreground">
    Usado na URL do projeto. Ex: weather-brasil
  </p>
</div>
```

### Texto de erro de campo

```tsx
{errors.slug && (
  <p className="text-xs text-destructive">{errors.slug}</p>
)}
```

---

## 9. Validação e Feedback de Erro

### Padrão `aria-invalid`

Todos os componentes (Input, Textarea, Select, Button) aceitam `aria-invalid`. Quando `true`, o componente automaticamente aplica borda e anel na cor destrutiva.

```tsx
<Input
  name="email"
  aria-invalid={!!fieldError}
  aria-describedby={fieldError ? 'email-error' : undefined}
/>
{fieldError && (
  <p id="email-error" className="text-xs text-destructive">{fieldError}</p>
)}
```

### Validação com Zod — padrão de schemas

```typescript
// src/lib/validation/my-form.ts
import { z } from 'zod'

export const myFormSchema = z.object({
  title:      z.string().trim().min(1, 'Título obrigatório.').max(300, 'Máximo 300 caracteres.'),
  slug:       z.string().trim().min(1, 'Slug obrigatório.').max(200)
                .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Apenas minúsculas, números e hífens.'),
  categoryId: z.string().uuid('Selecione uma categoria.'),
  url:        z.string().trim().url('URL inválida.').max(2000).nullable().optional(),
  date:       z.string().trim().min(1, 'Data obrigatória.').refine(s => !isNaN(Date.parse(s)), 'Data inválida.'),
})
```

Mensagens de erro:
- **Tom:** direto e instrucional ("Slug obrigatório.", "Selecione uma categoria.")
- **Sem** "Campo inválido" genérico — sempre dizer o que fazer
- **Sempre** com ponto final
- Para campos de formato: incluir exemplo ("Apenas minúsculas, números e hífens.")

### Validação no submit (Client Component)

```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const fd = new FormData(e.currentTarget)
  
  // Validar antes de enviar
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
      const msg = await readApiError(res)
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

## 10. Toasts e Notificações

### Biblioteca: Sonner

```tsx
import { toast } from 'sonner'

toast.success('Projeto criado com sucesso!')
toast.error('Erro ao salvar. Tente novamente.')
toast.loading('Salvando…')
```

### Ícones customizados (padrão do projeto)

```tsx
import { CircleCheckIcon, OctagonXIcon, TriangleAlertIcon, Loader2Icon } from 'lucide-react'

toast.success('Salvo!',   { icon: <CircleCheckIcon  className="size-4" /> })
toast.error('Erro!',      { icon: <OctagonXIcon     className="size-4" /> })
toast.warning('Atenção!', { icon: <TriangleAlertIcon className="size-4" /> })
toast.loading('Aguarde…', { icon: <Loader2Icon      className="size-4 animate-spin" /> })
```

### Estilo do toast de erro (globals.css)

```css
[data-sonner-toast][data-type='error'] {
  background-color: rgba(127, 29, 29, 0.94) !important;
  border: 1px solid rgba(248, 113, 113, 0.55) !important;
  color: rgb(254 242 242) !important;
}
```

### Quando usar cada tipo

| Tipo | Quando |
|------|--------|
| `success` | Operação CRUD concluída |
| `error` | Falha na API, erro de conexão, erro inesperado |
| `warning` | Ação parcialmente bem-sucedida, avisos não bloqueantes |
| `loading` | Operação demorada (upload, geração) — substituir por success/error ao concluir |

### Regras

- **Nunca** usar `alert()` ou `confirm()` — sempre Sonner + AlertDialog
- Para deleções: AlertDialog de confirmação + toast de sucesso/erro após
- Mensagens de sucesso: concisas ("Projeto criado.", "Membro removido.")
- Mensagens de erro: acionáveis ("Erro ao salvar. Tente novamente." não "Erro 500")

---

## 11. Dialogs e Modais

### Estrutura obrigatória

```tsx
<Dialog open={open} onOpenChange={handleOpenChange}>
  <DialogTrigger asChild>
    <Button variant="create" size="sm">
      <PlusIcon /> Novo projeto
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Criar projeto</DialogTitle>
      <DialogDescription>
        Preencha os dados do novo projeto.
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
    // resetar campos controlados se necessário
  }
  setOpen(next)
}
```

### Combobox/Select dentro de Dialog

Usar o contexto de ref para evitar portal issues:

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
    <Button variant="ghost" size="icon-sm" className="hover:text-rose-400 hover:bg-rose-500/10">
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
      <AlertDialogAction
        className="bg-destructive text-white hover:bg-destructive/90"
        onClick={handleDelete}
      >
        Apagar
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 12. Tabelas do Gestor

### Estrutura padrão

```tsx
<div className="rounded-xl border overflow-hidden">
  <Table>
    <TableHeader>
      <TableRow className="bg-muted/50">
        <TableHead className="w-[300px]">Nome</TableHead>
        <TableHead>Categoria</TableHead>
        <TableHead className="text-right w-[100px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {items.map(item => (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell className="text-muted-foreground">{item.category}</TableCell>
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
          <TableCell colSpan={3} className="py-8 text-center text-sm text-muted-foreground">
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
| Dado secundário | `text-muted-foreground` |
| Data | `text-muted-foreground tabular-nums` |
| Badge / status | Usar componente `<Badge>` |
| Coluna de ações | `text-right` no `TableHead`, `flex justify-end gap-1` no `TableCell` |
| Coluna de ícone/avatar | `w-10` no `TableHead` |

### Linha vazia

Sempre exibir mensagem quando a tabela está vazia. Nunca renderizar tabela com `<TableBody>` vazio.

---

## 13. ScrollArea

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
      <div key={item.id} className="...">
        {item.label}
      </div>
    ))}
  </div>
</ScrollArea>
```

### Scrollbar em fundo escuro

Adicionar a classe utilitária `.scrollbar-dark` quando o ScrollArea estiver sobre fundo escuro:

```tsx
<ScrollArea className="h-64 scrollbar-dark">
```

### Regras

- Sempre definir altura máxima explícita em dialogs (`h-48`, `h-64`, `max-h-[60vh]`)
- Não usar `overflow-y: scroll` nativo dentro de dialogs — pode causar dupla scrollbar
- `overscroll-contain` no viewport para prevenir scroll da página ao atingir os limites

---

## 14. Ícones

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

- Ícones dentro de `<Button>` **não precisam** de `className="size-*"` — o Button já define o tamanho via CSS `[&_svg:not([class*='size-'])]:size-4`
- Adicionar `aria-hidden` em ícones puramente decorativos
- Nunca usar emojis como ícones funcionais — sempre Lucide

---

## 15. Imagens

### Next.js `<Image>` — padrão

```tsx
import Image from 'next/image'

// Imagem local (public/)
<Image
  src="/foto-laboratorio.jpg"
  alt="Descrição acessível e específica"
  width={800}
  height={600}
  className="rounded-lg object-cover"
/>

// Imagem remota (requer configuração em next.config.ts)
<Image
  src="https://images.unsplash.com/photo-xxx"
  alt="Foto do laboratório"
  fill
  className="object-cover"
/>
```

### Configuração em `next.config.ts`

```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'images.unsplash.com' },
    // adicionar outros domínios conforme necessário
  ],
  qualities: [75, 85],
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 2592000,  // 30 dias
},
```

### Imagens servidas pelo banco (bytea)

```tsx
// Usar a rota de API como src — o Next.js não otimiza bytea
<img
  src={`/api/projects/${id}/image`}
  alt={title}
  className="w-full h-48 object-cover rounded-lg"
  loading="lazy"
/>
```

> Não usar `<Image>` do Next.js para rotas internas de bytea — ele tenta otimizar e falha. Usar `<img>` nativo com `loading="lazy"`.

### Uploads — regras de aceite

| Tipo | Formatos | Tamanho máximo | Validação |
|------|----------|----------------|-----------|
| Foto de membro | JPEG, PNG | 5 MB | Magic bytes `FF D8 FF` / `89 50 4E 47` |
| Imagem de projeto/evento | JPEG, PNG | 5 MB | Magic bytes |
| PDF | PDF | 20 MB | Magic bytes `25 50 44 46` |

**Nunca** aceitar SVG em uploads de usuário — SVG pode conter scripts.

### Avatar / foto de membro

```tsx
<Avatar className="size-10">
  <AvatarImage src={`/api/team/${id}/photo`} alt={name} />
  <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
    {initials}
  </AvatarFallback>
</Avatar>
```

Sempre fornecer `AvatarFallback` com iniciais para quando a foto não carrega.

---

## 16. Temas: Público vs. Gestor

O projeto tem dois contextos visuais distintos:

### Site público (`(public)/`)

| Aspecto | Padrão |
|---------|--------|
| Fundo | Gradientes escuros (slate, zinc, navy) |
| Texto | `text-white`, `text-slate-300`, `text-slate-400` |
| Acentos | Cyan, emerald, tailwind coloridos por categoria |
| Fonte de destaque | Cinzel (`font-brand-title`) |
| Radius de cards | `rounded-2xl` |
| Sombras | `shadow-shape` em superfícies principais |

### Gestor (`manager/`)

| Aspecto | Padrão |
|---------|--------|
| Fundo | `bg-background` (sistema light/dark) |
| Inputs sobre fundo escuro | `bg-white/5 border-white/10` |
| Texto | Tokens semânticos (`text-foreground`, `text-muted-foreground`) |
| Acentos | teal (criar), sky (editar), rose (apagar) |
| Fonte | Inter exclusivamente |
| Radius padrão | `rounded-lg` |
| Sombras | `shadow-xs` em inputs; `shadow-shape` em dialogs |

### Troca de tema (dark mode)

O dark mode é controlado pela classe `.dark` no `<html>`. Usar `next-themes` para gerenciar:

```tsx
// providers.tsx
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  {children}
</ThemeProvider>
```

---

## 17. Animações

### Transições de estado

Todos os componentes interativos usam `transition-[color,box-shadow]` para suavizar hover e focus. Nunca usar `transition-all` — é muito custoso.

```css
/* Input, Select, Button base */
transition-[color,box-shadow]
```

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

## 18. Padrões de Composição

### Wrapper de campo de formulário

```tsx
// Padrão consistente para qualquer campo
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
    <p id="fieldId-hint" className="text-xs text-muted-foreground">{hint}</p>
  )}
  {error && (
    <p id="fieldId-error" className="text-xs text-destructive">{error}</p>
  )}
</div>
```

### Grade de formulário em dialog

```tsx
// Formulário simples (1 coluna)
<form className="grid gap-4">

// Formulário com 2 colunas em tela larga
<form className="grid gap-4 sm:grid-cols-2">
  <div className="sm:col-span-2">  {/* campo full-width */}
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

### Padrão de leitura de erro da API

```typescript
// src/lib/read-api-error.ts
export async function readApiError(res: Response): Promise<string> {
  try {
    const json = await res.json()
    return json.error ?? 'Erro desconhecido.'
  } catch {
    return 'Erro de comunicação com o servidor.'
  }
}

// Uso em qualquer fetch mutation
const res = await fetch('/api/resources', { method: 'POST', body: fd })
if (!res.ok) {
  toast.error(await readApiError(res))
  return
}
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
