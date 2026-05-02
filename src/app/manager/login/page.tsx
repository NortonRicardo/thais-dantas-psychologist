'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        toast.error('Senha incorreta.')
        return
      }
      router.replace('/manager')
    } catch {
      toast.error('Erro ao autenticar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl px-8 py-10"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)',
        }}
      >
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Lock size={20} className="text-white/60" />
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-white/90">Gestor LEMM</h1>
            <p className="mt-0.5 text-sm text-white/40">
              Digite a senha para continuar
            </p>
          </div>
        </div>

        <div className="grid gap-4">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoFocus
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
          />
          <button
            type="submit"
            disabled={loading || !password}
            className="rounded-lg bg-orange-800 px-4 py-2.5 text-sm font-medium text-orange-50 transition hover:bg-orange-700 disabled:opacity-50"
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </div>
      </form>
    </div>
  )
}
