import { ViewTracker } from './_components/view-tracker'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ViewTracker />
      {children}
    </div>
  )
}
