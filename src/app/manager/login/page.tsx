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
        setLoading(false)
        return
      }
      router.replace('/manager/contato')
      // Mantém loading até a nova rota montar (evita flash do botão «Entrar»).
    } catch {
      toast.error('Erro ao autenticar.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        aria-busy={loading}
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
            <h1 className="text-lg font-semibold text-white/90">
              Gestor Thais Dantas
            </h1>
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
            disabled={loading}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            disabled={loading}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <Button
            type="submit"
            loading={loading}
            loadingLabel="Entrando…"
            disabled={loading || !username.trim() || !password}
            className="mt-1 w-full rounded-lg border-0 bg-emerald-800 px-4 py-2.5 text-sm font-medium text-emerald-50 hover:bg-emerald-700 disabled:opacity-50"
          >
            Entrar
          </Button>
        </div>
      </form>
    </div>
  )
}
