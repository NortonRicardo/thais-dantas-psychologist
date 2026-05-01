import type { FocusEvent } from 'react'

/**
 * Handler for input onFocus that collapses selection to the end (no select-all).
 * When a dialog opens, focus is often moved to the first input programmatically;
 * many browsers then select all text. Deferring to the next tick runs after that
 * default behavior. Use in update/edit modals where inputs are pre-filled.
 */
export function onFocusCollapseSelectionToEnd(
  e: FocusEvent<HTMLInputElement, Element>
): void {
  const input = e.target
  const len = input.value.length
  setTimeout(() => input.setSelectionRange(len, len), 0)
}
