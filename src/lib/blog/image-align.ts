export type ImageAlign = 'left' | 'center' | 'right' | 'full'

export const DEFAULT_IMAGE_WIDTH: Record<ImageAlign, number> = {
  left: 50,
  right: 50,
  center: 100,
  full: 100,
}

const MIN_IMAGE_WIDTH = 15

export function clampImageWidth(width: number): number {
  if (!Number.isFinite(width)) return 100
  return Math.min(100, Math.max(MIN_IMAGE_WIDTH, Math.round(width)))
}

export type ImageRadius = 'none' | 'md' | 'full'

export const DEFAULT_IMAGE_RADIUS: ImageRadius = 'none'

export const IMAGE_RADIUS_PX: Record<ImageRadius, number> = {
  none: 0,
  md: 16,
  full: 9999,
}

export function normalizeImageRadius(value: unknown): ImageRadius {
  return value === 'md' || value === 'full' ? value : 'none'
}

/**
 * Estilo inline da imagem — sempre recalculado (nunca aceito bruto do
 * cliente) a partir de align + width + radius, tanto na sanitização quanto
 * no `renderHTML` do node do editor, para as duas fontes nunca divergirem.
 */
export function getImageStyle(
  align: ImageAlign,
  width: number,
  radius: ImageRadius = DEFAULT_IMAGE_RADIUS
): string {
  const w = clampImageWidth(width)
  const radiusRule = `border-radius:${IMAGE_RADIUS_PX[radius]}px;`
  switch (align) {
    case 'left':
      return `float:left;margin:0.25rem 1.5rem 1rem 0;width:${w}%;${radiusRule}`
    case 'right':
      return `float:right;margin:0.25rem 0 1rem 1.5rem;width:${w}%;${radiusRule}`
    case 'full':
      return `display:block;width:100%;margin:1.5rem 0;${radiusRule}`
    case 'center':
    default:
      return `display:block;margin:1.5rem auto;width:${w}%;${radiusRule}`
  }
}
