import { Parser } from 'htmlparser2'
import { DomHandler, type ChildNode, type Element } from 'domhandler'
import serialize from 'dom-serializer'
import {
  DEFAULT_IMAGE_WIDTH,
  clampImageWidth,
  getImageStyle,
  normalizeImageRadius,
  type ImageAlign,
} from './image-align'

const KNOWN_ALIGNS = new Set(Object.keys(DEFAULT_IMAGE_WIDTH))

const ALLOWED_TAGS = new Set([
  'p',
  'h2',
  'h3',
  'strong',
  'em',
  'u',
  's',
  'a',
  'ul',
  'ol',
  'li',
  'blockquote',
  'img',
  'br',
  'hr',
])

const ALLOWED_ATTRS: Record<string, string[]> = {
  a: ['href', 'target', 'rel'],
  img: ['src', 'alt', 'data-align', 'data-width', 'data-radius', 'style'],
}

function isElement(node: ChildNode): node is Element {
  return node.type === 'tag'
}

/**
 * Sanitiza recursivamente, removendo tags fora da allowlist (mantendo os
 * filhos — "unwrap") e restringindo atributos ao conjunto seguro por tag.
 * Escrito à mão (em vez de `sanitize-html`) porque essa lib faz
 * `require('postcss')` no top-level, o que quebra o bundling de dev do
 * Turbopack neste projeto.
 */
function sanitizeNodes(nodes: ChildNode[]): ChildNode[] {
  const result: ChildNode[] = []

  for (const node of nodes) {
    if (node.type === 'text') {
      result.push(node)
      continue
    }
    if (!isElement(node)) continue // comentários, doctype, etc.

    const tagName = node.name.toLowerCase()
    const children = sanitizeNodes(node.children as ChildNode[])

    if (!ALLOWED_TAGS.has(tagName)) {
      result.push(...children)
      continue
    }

    const attribs: Record<string, string> = {}
    for (const key of ALLOWED_ATTRS[tagName] ?? []) {
      if (node.attribs?.[key] != null) attribs[key] = node.attribs[key]
    }

    if (tagName === 'a') {
      if (!attribs.href || !/^https?:\/\//i.test(attribs.href)) {
        delete attribs.href
      }
      attribs.rel = 'noopener noreferrer'
      attribs.target = '_blank'
    }

    if (tagName === 'img') {
      if (!attribs.src || !/^(\/|https:\/\/)/.test(attribs.src)) continue
      const align = KNOWN_ALIGNS.has(attribs['data-align'])
        ? (attribs['data-align'] as ImageAlign)
        : 'center'
      const parsedWidth = Number(attribs['data-width'])
      const width = clampImageWidth(
        Number.isFinite(parsedWidth) ? parsedWidth : DEFAULT_IMAGE_WIDTH[align]
      )
      const radius = normalizeImageRadius(attribs['data-radius'])
      attribs['data-align'] = align
      attribs['data-width'] = String(width)
      attribs['data-radius'] = radius
      attribs.style = getImageStyle(align, width, radius)
    }

    node.attribs = attribs
    node.children = children
    result.push(node)
  }

  return result
}

export function sanitizeArticleHtml(html: string): string {
  const handler = new DomHandler()
  const parser = new Parser(handler)
  parser.write(html)
  parser.end()
  // encodeEntities: 'utf8' evita converter acentos (á, ç, ã…) em entidades
  // numéricas — mantém o HTML como UTF-8 legível (o documento já é UTF-8).
  return serialize(sanitizeNodes(handler.dom as ChildNode[]), {
    encodeEntities: 'utf8',
  })
}
