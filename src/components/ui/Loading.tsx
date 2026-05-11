export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center p-12">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-200 border-t-[var(--academic-navy)]" />
        <p className="text-sm text-zinc-400">Loading...</p>
      </div>
    </div>
  )
}
