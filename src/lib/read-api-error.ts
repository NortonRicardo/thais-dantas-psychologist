/** Corpo JSON `{ error: string }` ou texto cru da resposta (API gestor). */
export async function readApiError(res: Response): Promise<string> {
  const text = await res.text()
  try {
    const j = JSON.parse(text) as { error?: unknown }
    if (typeof j.error === 'string') return j.error
  } catch {
    /* ignore */
  }
  return text.trim() || `Erro HTTP ${res.status}`
}
