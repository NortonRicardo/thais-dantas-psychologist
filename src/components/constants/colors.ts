export type AppColorOption = { key: string; className: string }

const COLOR_FAMILIES = [
  'red','rose','pink','fuchsia','purple','violet','indigo','blue','sky','cyan',
  'teal','emerald','green','lime','yellow','amber','orange','stone','slate','zinc','neutral',
] as const

const SHADES = [900, 800, 700, 600, 500, 400] as const

function buildColorOption(family: string, shade: number): AppColorOption {
  const className = `bg-${family}-${shade}`
  return { key: className, className }
}

export const COLOR_OPTIONS: AppColorOption[] = SHADES.flatMap(shade =>
  COLOR_FAMILIES.map(family => buildColorOption(family, shade))
)

export const COLOR_HEX_MAP: Record<string, string> = {
  'bg-red-900':'#7f1d1d','bg-red-800':'#991b1b','bg-red-700':'#b91c1c','bg-red-600':'#dc2626','bg-red-500':'#ef4444','bg-red-400':'#f87171',
  'bg-rose-900':'#881337','bg-rose-800':'#9f1239','bg-rose-700':'#be123c','bg-rose-600':'#e11d48','bg-rose-500':'#f43f5e','bg-rose-400':'#fb7185',
  'bg-pink-900':'#831843','bg-pink-800':'#9d174d','bg-pink-700':'#be185d','bg-pink-600':'#db2777','bg-pink-500':'#ec4899','bg-pink-400':'#f472b6',
  'bg-fuchsia-900':'#701a75','bg-fuchsia-800':'#86198f','bg-fuchsia-700':'#a21caf','bg-fuchsia-600':'#c026d3','bg-fuchsia-500':'#d946ef','bg-fuchsia-400':'#e879f9',
  'bg-purple-900':'#581c87','bg-purple-800':'#6b21a8','bg-purple-700':'#7e22ce','bg-purple-600':'#9333ea','bg-purple-500':'#a855f7','bg-purple-400':'#c084fc',
  'bg-violet-900':'#4c1d95','bg-violet-800':'#5b21b6','bg-violet-700':'#6d28d9','bg-violet-600':'#7c3aed','bg-violet-500':'#8b5cf6','bg-violet-400':'#a78bfa',
  'bg-indigo-900':'#312e81','bg-indigo-800':'#3730a3','bg-indigo-700':'#4338ca','bg-indigo-600':'#4f46e5','bg-indigo-500':'#6366f1','bg-indigo-400':'#818cf8',
  'bg-blue-900':'#1e3a8a','bg-blue-800':'#1e40af','bg-blue-700':'#1d4ed8','bg-blue-600':'#2563eb','bg-blue-500':'#3b82f6','bg-blue-400':'#60a5fa',
  'bg-sky-900':'#0c4a6e','bg-sky-800':'#075985','bg-sky-700':'#0369a1','bg-sky-600':'#0284c7','bg-sky-500':'#0ea5e9','bg-sky-400':'#38bdf8',
  'bg-cyan-900':'#164e63','bg-cyan-800':'#155e75','bg-cyan-700':'#0e7490','bg-cyan-600':'#0891b2','bg-cyan-500':'#06b6d4','bg-cyan-400':'#22d3ee',
  'bg-teal-900':'#134e4a','bg-teal-800':'#115e59','bg-teal-700':'#0f766e','bg-teal-600':'#0d9488','bg-teal-500':'#14b8a6','bg-teal-400':'#2dd4bf',
  'bg-emerald-900':'#064e3b','bg-emerald-800':'#065f46','bg-emerald-700':'#047857','bg-emerald-600':'#059669','bg-emerald-500':'#10b981','bg-emerald-400':'#34d399',
  'bg-green-900':'#14532d','bg-green-800':'#166534','bg-green-700':'#15803d','bg-green-600':'#16a34a','bg-green-500':'#22c55e','bg-green-400':'#4ade80',
  'bg-lime-900':'#365314','bg-lime-800':'#3f6212','bg-lime-700':'#4d7c0f','bg-lime-600':'#65a30d','bg-lime-500':'#84cc16','bg-lime-400':'#a3e635',
  'bg-yellow-900':'#713f12','bg-yellow-800':'#854d0e','bg-yellow-700':'#a16207','bg-yellow-600':'#ca8a04','bg-yellow-500':'#eab308','bg-yellow-400':'#facc15',
  'bg-amber-900':'#78350f','bg-amber-800':'#92400e','bg-amber-700':'#b45309','bg-amber-600':'#d97706','bg-amber-500':'#f59e0b','bg-amber-400':'#fbbf24',
  'bg-orange-900':'#7c2d12','bg-orange-800':'#9a3412','bg-orange-700':'#c2410c','bg-orange-600':'#ea580c','bg-orange-500':'#f97316','bg-orange-400':'#fb923c',
  'bg-stone-900':'#1c1917','bg-stone-800':'#292524','bg-stone-700':'#44403c','bg-stone-600':'#57534e','bg-stone-500':'#78716c','bg-stone-400':'#a8a29e',
  'bg-slate-900':'#0f172a','bg-slate-800':'#1e293b','bg-slate-700':'#334155','bg-slate-600':'#475569','bg-slate-500':'#64748b','bg-slate-400':'#94a3b8',
  'bg-zinc-900':'#18181b','bg-zinc-800':'#27272a','bg-zinc-700':'#3f3f46','bg-zinc-600':'#52525b','bg-zinc-500':'#71717a','bg-zinc-400':'#a1a1aa',
  'bg-neutral-900':'#171717','bg-neutral-800':'#262626','bg-neutral-700':'#404040','bg-neutral-600':'#525252','bg-neutral-500':'#737373','bg-neutral-400':'#a3a3a3',
}
