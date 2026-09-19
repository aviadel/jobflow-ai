export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#ECEBE7] dark:bg-[#0F0F0E]">
      {children}
    </div>
  )
}
