'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { toast } from 'sonner'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await authClient.signIn.username({ username, password })
      if (error) {
        toast.error('Usuário ou senha incorretos.')
        setLoading(false)
        return
      }
      router.replace('/manager/contato')
    } catch {
      toast.error('Erro ao autenticar.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#556040] px-4">
      <div className="w-full max-w-sm">

        {/* Marca */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5">
            <Lock size={18} className="text-white/50" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-cinzel)] text-base font-medium tracking-wide text-white/90">
              Thais Dantas
            </p>
            <p className="mt-0.5 text-xs text-white/35">Área restrita</p>
          </div>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          aria-busy={loading}
          className="rounded-2xl px-8 py-8"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.09)',
            boxShadow: '0 8px 32px 0 rgba(0,0,0,0.4)',
          }}
        >
          <div className="grid gap-5">

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-white/60">
                Usuário
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
                autoComplete="username"
                disabled={loading}
                placeholder="seu usuário"
                className="border-white/10 !bg-white/5 text-white/90 placeholder:text-white/25 focus-visible:border-white/25 focus-visible:ring-white/10"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-white/60">
                Senha
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
                placeholder="••••••••"
                className="border-white/10 !bg-white/5 text-white/90 placeholder:text-white/25 focus-visible:border-white/25 focus-visible:ring-white/10"
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              loadingLabel="Entrando…"
              disabled={loading || !username.trim() || !password}
              className="mt-1 w-full bg-white text-[#3A4424] hover:bg-white/90 disabled:bg-white/20 disabled:text-white/40 disabled:shadow-none"
            >
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
