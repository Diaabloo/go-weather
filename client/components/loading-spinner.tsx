"use client"

export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🌤️</span>
        </div>
      </div>
      <p className="text-white/80 text-lg">Récupération des données météo...</p>
    </div>
  )
}
