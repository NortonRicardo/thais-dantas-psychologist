'use client'

import { useCallback, useRef, useState } from 'react'
import { NodeViewWrapper, type NodeViewProps } from '@tiptap/react'
import { GripVertical } from 'lucide-react'
import {
  IMAGE_RADIUS_PX,
  clampImageWidth,
  normalizeImageRadius,
  type ImageAlign,
  type ImageRadius,
} from '@/lib/blog/image-align'

export function ResizableImageView({
  node,
  updateAttributes,
  selected,
  editor,
  getPos,
}: NodeViewProps) {
  const { src, alt, align, width, radius } = node.attrs as {
    src: string
    alt: string | null
    align: ImageAlign
    width: number
    radius: ImageRadius
  }

  const wrapperRef = useRef<HTMLDivElement>(null)
  const dragState = useRef<{ startX: number; startWidth: number } | null>(
    null
  )
  const [moving, setMoving] = useState(false)
  const isFull = align === 'full'
  const displayWidth = isFull ? 100 : clampImageWidth(width)

  const onMoveHandlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const startPos = getPos()
      if (typeof startPos !== 'number') return
      const view = editor.view
      setMoving(true)
      let dropPos: number | null = null

      const indicator = document.createElement('div')
      indicator.style.position = 'fixed'
      indicator.style.height = '3px'
      indicator.style.borderRadius = '2px'
      indicator.style.background = '#10b981'
      indicator.style.boxShadow = '0 0 0 3px rgba(16,185,129,0.25)'
      indicator.style.pointerEvents = 'none'
      indicator.style.zIndex = '9999'
      document.body.appendChild(indicator)

      // Limita as coordenadas à área do editor para sempre resolver uma
      // posição válida (ex: soltar acima/abaixo do texto vira início/fim).
      const updateIndicator = (clientX: number, clientY: number) => {
        const rect = view.dom.getBoundingClientRect()
        const x = Math.min(Math.max(clientX, rect.left + 1), rect.right - 1)
        const y = Math.min(Math.max(clientY, rect.top + 1), rect.bottom - 1)
        const coords = view.posAtCoords({ left: x, top: y })
        if (!coords) return
        dropPos = coords.pos
        const box = view.coordsAtPos(coords.pos)
        indicator.style.top = `${box.top - 1}px`
        indicator.style.left = `${rect.left}px`
        indicator.style.width = `${rect.width}px`
      }
      updateIndicator(e.clientX, e.clientY)

      const onMove = (ev: PointerEvent) => updateIndicator(ev.clientX, ev.clientY)
      const onUp = () => {
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        indicator.remove()
        setMoving(false)
        if (dropPos == null) return
        const targetNode = view.state.doc.nodeAt(startPos)
        if (!targetNode) return
        const tr = view.state.tr
        tr.delete(startPos, startPos + targetNode.nodeSize)
        tr.insert(tr.mapping.map(dropPos), targetNode)
        view.dispatch(tr)
        view.focus()
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [editor, getPos]
  )

  const onResizeStart = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const container = wrapperRef.current?.closest(
        '.article-body'
      ) as HTMLElement | null
      const containerWidth =
        container?.clientWidth ?? wrapperRef.current?.clientWidth ?? 1
      dragState.current = { startX: e.clientX, startWidth: width }

      const onMove = (ev: PointerEvent) => {
        if (!dragState.current) return
        const deltaPercent =
          ((ev.clientX - dragState.current.startX) / containerWidth) * 100
        const direction = align === 'right' ? -1 : 1
        updateAttributes({
          width: clampImageWidth(
            dragState.current.startWidth + deltaPercent * direction
          ),
        })
      }
      const onUp = () => {
        dragState.current = null
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
      }
      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
    },
    [align, updateAttributes, width]
  )

  return (
    <NodeViewWrapper
      ref={wrapperRef}
      as="span"
      data-align={align}
      className="group/image relative inline-block align-top"
      style={{
        width: `${displayWidth}%`,
        opacity: moving ? 0.4 : 1,
        ...alignStyle(align),
      }}
    >
      <img
        src={src}
        alt={alt ?? ''}
        draggable={false}
        className={selected ? 'ring-2 ring-emerald-500 ring-offset-2' : ''}
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          borderRadius: `${IMAGE_RADIUS_PX[normalizeImageRadius(radius)]}px`,
        }}
      />
      {editor.isEditable && (
        <span
          onPointerDown={onMoveHandlePointerDown}
          title="Arraste para mover a imagem no texto"
          className="absolute top-1 left-1 flex h-6 w-6 cursor-grab items-center justify-center rounded-md border border-white/40 bg-black/60 text-white opacity-0 shadow transition-opacity group-hover/image:opacity-100 active:cursor-grabbing"
        >
          <GripVertical size={14} />
        </span>
      )}
      {editor.isEditable && !isFull && (
        <span
          onPointerDown={onResizeStart}
          title="Arraste para redimensionar"
          className="absolute right-0 bottom-0 h-4 w-4 translate-x-1/2 translate-y-1/2 cursor-nwse-resize rounded-full border-2 border-white bg-emerald-500 opacity-0 shadow transition-opacity group-hover/image:opacity-100"
        />
      )}
    </NodeViewWrapper>
  )
}

function alignStyle(align: ImageAlign): React.CSSProperties {
  switch (align) {
    case 'left':
      return { float: 'left', margin: '0.25rem 1.5rem 1rem 0' }
    case 'right':
      return { float: 'right', margin: '0 0 1rem 1.5rem' }
    case 'full':
      return { display: 'block', margin: '1.5rem 0' }
    case 'center':
    default:
      return { display: 'block', margin: '1.5rem auto' }
  }
}
