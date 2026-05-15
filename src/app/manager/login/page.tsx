'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await authClient.signIn.username({
        username,
        password,
      })
      if (error) {
        toast.error('Usuário ou senha incorretos.')
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
              Entre com suas credenciais
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
            autoComplete="username"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30"
          />
          <Button
            type="submit"
            loading={loading}
            loadingLabel="Entrando…"
            disabled={!username || !password}
            className="mt-1 w-full rounded-lg border-0 bg-orange-800 px-4 py-2.5 text-sm font-medium text-orange-50 hover:bg-orange-700 disabled:opacity-50"
          >
            Entrar
          </Button>
        </div>
      </form>
    </div>
  )
}
