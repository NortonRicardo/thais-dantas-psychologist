import { HardwareWorkspace } from './_components/hardware-workspace'

export const metadata = {
  title: 'Hardware | Gestor LEMM',
}

export default function HardwareManagerPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8">
      <HardwareWorkspace />
    </div>
  )
}
