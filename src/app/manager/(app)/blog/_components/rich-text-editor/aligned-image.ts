import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import {
  DEFAULT_IMAGE_WIDTH,
  clampImageWidth,
  getImageStyle,
  normalizeImageRadius,
  type ImageAlign,
  type ImageRadius,
} from '@/lib/blog/image-align'
import { ResizableImageView } from './resizable-image-view'

export type { ImageAlign, ImageRadius }

/**
 * Extende o node de imagem padrão do Tiptap com os atributos `align`,
 * `width` e `radius`, serializados como `data-align`/`data-width`/
 * `data-radius` (lidos de volta ao carregar o HTML) e como `style` inline
 * (para renderizar corretamente fora do editor também). O `style` é sempre
 * recalculado a partir desses três atributos — nunca lido do HTML — para as
 * duas fontes nunca divergirem (ver `getImageStyle`).
 */
export const AlignedImage = Image.extend({
  name: 'alignedImage',
  // Junto com o `data-drag-handle` no node view, permite arrastar a imagem
  // para qualquer outro ponto do texto (reordenar), sem tornar a imagem
  // inteira "arrastável" (o que atrapalharia clique/seleção/redimensionar).
  draggable: true,

  addAttributes() {
    return {
      ...this.parent?.(),
      align: {
        default: 'center',
        parseHTML: element => element.getAttribute('data-align') || 'center',
        renderHTML: attributes => {
          const align = (attributes.align as ImageAlign) || 'center'
          const width = clampImageWidth(
            Number(attributes.width) || DEFAULT_IMAGE_WIDTH[align]
          )
          const radius = normalizeImageRadius(attributes.radius)
          return {
            'data-align': align,
            'data-width': String(width),
            'data-radius': radius,
            style: getImageStyle(align, width, radius),
          }
        },
      },
      width: {
        default: 100,
        parseHTML: element => {
          const raw = Number(element.getAttribute('data-width'))
          return Number.isFinite(raw) ? raw : 100
        },
        // combinado ao style de `align` acima — não gera atributos próprios
        renderHTML: () => ({}),
      },
      radius: {
        default: 'none',
        parseHTML: element =>
          normalizeImageRadius(element.getAttribute('data-radius')),
        // combinado ao style de `align` acima — não gera atributos próprios
        renderHTML: () => ({}),
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageView)
  },
})
