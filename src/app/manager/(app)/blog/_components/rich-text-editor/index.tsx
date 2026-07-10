'use client'

import { useEffect, useRef, useState } from 'react'
import { type Editor, EditorContent, useEditor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { NodeSelection } from '@tiptap/pm/state'
import StarterKit from '@tiptap/starter-kit'
import TiptapLink from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Circle,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Maximize,
  Pilcrow,
  Quote,
  Redo2,
  Square,
  Squircle,
  Strikethrough,
  Trash2,
  Undo2,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { AlignedImage, type ImageAlign, type ImageRadius } from './aligned-image'
import { DEFAULT_IMAGE_WIDTH } from '@/lib/blog/image-align'

async function uploadImage(file: File): Promise<{ url: string } | null> {
  const formData = new FormData()
  formData.append('file', file)
  try {
    const res = await fetch('/api/blog/upload', {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(
        typeof body.error === 'string' ? body.error : 'Erro ao enviar imagem.'
      )
    }
    return await res.json()
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Erro ao enviar imagem.')
    return null
  }
}

function ToolbarButton({
  active,
  onClick,
  disabled,
  title,
  children,
}: {
  active?: boolean
  onClick: () => void
  disabled?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => e.preventDefault()}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md text-white/50 transition-colors hover:bg-white/10 hover:text-white/85 disabled:pointer-events-none disabled:opacity-30',
        active && 'bg-white/15 text-white/90'
      )}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div className="mx-1 h-5 w-px shrink-0 bg-white/10" />
}

function LinkButton({ editor }: { editor: Editor | null }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  function openPopover() {
    setUrl((editor?.getAttributes('link').href as string | undefined) ?? '')
    setOpen(true)
  }

  function applyLink() {
    if (!editor) return
    const trimmed = url.trim()
    if (!trimmed) {
      editor.chain().focus().unsetLink().run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: trimmed })
        .run()
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ToolbarButton
          title="Link"
          active={editor?.isActive('link')}
          onClick={openPopover}
        >
          <LinkIcon size={15} />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="scheme-dark w-64 border-white/10 bg-[#1e2a14] p-2"
      >
        <div className="flex items-center gap-1.5">
          <input
            autoFocus
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                applyLink()
              }
            }}
            placeholder="https://…"
            className="h-8 flex-1 rounded-md border border-white/10 bg-white/5 px-2 text-xs text-white/85 placeholder:text-white/25 outline-none focus:border-white/25"
          />
          <button
            type="button"
            onClick={applyLink}
            className="flex h-8 shrink-0 items-center rounded-md bg-white/10 px-2.5 text-xs text-white/80 transition-colors hover:bg-white/15"
          >
            Aplicar
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function RichTextEditor({
  content,
  onChange,
  placeholder,
}: {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}) {
  const onChangeRef = useRef(onChange)
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  const editorRef = useRef<Editor | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  const editor = useEditor({
    immediatelyRender: false,
    content,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, link: false }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Escreva o artigo…',
      }),
      TiptapLink.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      AlignedImage.configure({ inline: false }),
    ],
    editorProps: {
      attributes: {
        class:
          'article-body prose prose-invert prose-sm sm:prose-base max-w-none min-h-[50vh] focus:outline-none',
      },
      handleDrop: (view, event, _slice, moved) => {
        if (moved) return false
        const files = Array.from(event.dataTransfer?.files ?? []).filter(f =>
          f.type.startsWith('image/')
        )
        if (files.length === 0) return false
        event.preventDefault()
        const coords = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        })
        const pos = coords?.pos ?? view.state.selection.from
        files.forEach(async file => {
          const result = await uploadImage(file)
          const current = editorRef.current
          if (!result || !current) return
          current
            .chain()
            .focus()
            .insertContentAt(pos, {
              type: 'alignedImage',
              attrs: { src: result.url, align: 'center' },
            })
            .run()
        })
        return true
      },
      handlePaste: (_view, event) => {
        const files = Array.from(event.clipboardData?.files ?? []).filter(f =>
          f.type.startsWith('image/')
        )
        if (files.length === 0) return false
        event.preventDefault()
        files.forEach(async file => {
          const result = await uploadImage(file)
          const current = editorRef.current
          if (!result || !current) return
          current
            .chain()
            .focus()
            .insertContent({
              type: 'alignedImage',
              attrs: { src: result.url, align: 'center' },
            })
            .run()
        })
        return true
      },
    },
    onUpdate: ({ editor }) => onChangeRef.current(editor.getHTML()),
  })

  useEffect(() => {
    editorRef.current = editor
  }, [editor])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !editor) return
    setUploading(true)
    const result = await uploadImage(file)
    setUploading(false)
    if (!result) return
    editor
      .chain()
      .focus()
      .insertContent({
        type: 'alignedImage',
        attrs: { src: result.url, align: 'center' },
      })
      .run()
  }

  function setAlign(align: ImageAlign) {
    if (!editor) return
    const currentWidth = editor.getAttributes('alignedImage').width as
      | number
      | undefined
    // Ao trocar de alinhamento, só reaplica a largura padrão se a imagem
    // ainda estiver no tamanho padrão anterior — preserva um redimensionamento manual.
    const previousDefault =
      Object.values(DEFAULT_IMAGE_WIDTH).includes(currentWidth ?? -1) &&
      currentWidth !== DEFAULT_IMAGE_WIDTH[align]
    const width =
      !currentWidth || previousDefault
        ? DEFAULT_IMAGE_WIDTH[align]
        : currentWidth
    editor
      .chain()
      .focus()
      .updateAttributes('alignedImage', { align, width })
      .run()
  }

  function setRadius(radius: ImageRadius) {
    editor?.chain().focus().updateAttributes('alignedImage', { radius }).run()
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-white/10 bg-[#1b2412]/95 px-2 py-1.5 backdrop-blur-sm">
        <ToolbarButton
          title="Desfazer"
          onClick={() => editor?.chain().focus().undo().run()}
          disabled={!editor?.can().undo()}
        >
          <Undo2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Refazer"
          onClick={() => editor?.chain().focus().redo().run()}
          disabled={!editor?.can().redo()}
        >
          <Redo2 size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Parágrafo"
          active={editor?.isActive('paragraph')}
          onClick={() => editor?.chain().focus().setParagraph().run()}
        >
          <Pilcrow size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Título 2"
          active={editor?.isActive('heading', { level: 2 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Título 3"
          active={editor?.isActive('heading', { level: 3 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Alinhar texto à esquerda"
          active={editor?.isActive({ textAlign: 'left' })}
          onClick={() => editor?.chain().focus().setTextAlign('left').run()}
        >
          <AlignLeft size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Centralizar texto"
          active={editor?.isActive({ textAlign: 'center' })}
          onClick={() => editor?.chain().focus().setTextAlign('center').run()}
        >
          <AlignCenter size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Alinhar texto à direita"
          active={editor?.isActive({ textAlign: 'right' })}
          onClick={() => editor?.chain().focus().setTextAlign('right').run()}
        >
          <AlignRight size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Negrito"
          active={editor?.isActive('bold')}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Itálico"
          active={editor?.isActive('italic')}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Tachado"
          active={editor?.isActive('strike')}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
        >
          <Strikethrough size={15} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          title="Lista"
          active={editor?.isActive('bulletList')}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Lista numerada"
          active={editor?.isActive('orderedList')}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered size={15} />
        </ToolbarButton>
        <ToolbarButton
          title="Citação"
          active={editor?.isActive('blockquote')}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote size={15} />
        </ToolbarButton>

        <Divider />

        <LinkButton editor={editor} />
        <ToolbarButton
          title="Inserir imagem"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <ImagePlus size={15} />
          )}
        </ToolbarButton>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <EditorContent editor={editor} className="px-6 py-4 sm:px-10" />

      {editor && (
        <BubbleMenu
          editor={editor}
          shouldShow={({ state }) => {
            const { selection } = state
            return (
              selection instanceof NodeSelection &&
              selection.node.type.name === 'alignedImage'
            )
          }}
          className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#1e2a14] p-1 shadow-xl"
        >
          <ToolbarButton
            title="Alinhar à esquerda"
            active={editor.isActive('alignedImage', { align: 'left' })}
            onClick={() => setAlign('left')}
          >
            <AlignLeft size={14} />
          </ToolbarButton>
          <ToolbarButton
            title="Centralizar"
            active={editor.isActive('alignedImage', { align: 'center' })}
            onClick={() => setAlign('center')}
          >
            <AlignCenter size={14} />
          </ToolbarButton>
          <ToolbarButton
            title="Alinhar à direita"
            active={editor.isActive('alignedImage', { align: 'right' })}
            onClick={() => setAlign('right')}
          >
            <AlignRight size={14} />
          </ToolbarButton>
          <ToolbarButton
            title="Largura total"
            active={editor.isActive('alignedImage', { align: 'full' })}
            onClick={() => setAlign('full')}
          >
            <Maximize size={14} />
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            title="Sem bordas arredondadas"
            active={editor.isActive('alignedImage', { radius: 'none' })}
            onClick={() => setRadius('none')}
          >
            <Square size={14} />
          </ToolbarButton>
          <ToolbarButton
            title="Bordas arredondadas"
            active={editor.isActive('alignedImage', { radius: 'md' })}
            onClick={() => setRadius('md')}
          >
            <Squircle size={14} />
          </ToolbarButton>
          <ToolbarButton
            title="Bordas circulares"
            active={editor.isActive('alignedImage', { radius: 'full' })}
            onClick={() => setRadius('full')}
          >
            <Circle size={14} />
          </ToolbarButton>
          <Divider />
          <ToolbarButton
            title="Remover imagem"
            onClick={() => editor.chain().focus().deleteSelection().run()}
          >
            <Trash2 size={14} />
          </ToolbarButton>
        </BubbleMenu>
      )}
    </div>
  )
}
