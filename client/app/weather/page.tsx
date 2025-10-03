"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useWeather } from "@/hooks/use-weather"
import { useAuth } from "@/context/auth-context"
import { SearchBar } from "@/components/search-bar"
import { WeatherCard } from "@/components/weather-card"
import { ErrorMessage } from "@/components/error-message"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { Cloud, Sun, CloudRain, LogOut, User } from "lucide-react"

export default function WeatherPage() {
  const { weather, loading, error, fetchWeather } = useWeather()
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen weather-gradient flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen weather-gradient">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <div className="glass-effect rounded-lg px-4 py-2 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-white" />
              <span className="text-white font-medium">{user.name}</span>
            </div>
            <Button onClick={logout} variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="relative">
              <Sun className="h-8 w-8 text-yellow-400 animate-pulse" />
              <Cloud className="h-6 w-6 text-white/80 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-5xl font-bold text-white text-balance">Weather App</h1>
            <CloudRain className="h-8 w-8 text-blue-300" />
          </div>
          <p className="text-xl text-white/80 text-pretty max-w-2xl mx-auto">
            Découvrez la météo en temps réel dans le monde entier. Recherchez votre ville et obtenez des informations
            détaillées.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <SearchBar onSearch={fetchWeather} loading={loading} />
        </div>

        {/* Content */}
        <div className="space-y-8">
          {loading && <LoadingSpinner />}

          {error && !loading && <ErrorMessage error={error} />}

          {weather && !loading && !error && (
            <div className="animate-in fade-in-50 duration-500">
              <WeatherCard weather={weather} />
            </div>
          )}

          {!weather && !loading && !error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌍</div>
              <h3 className="text-2xl font-semibold text-white mb-2">Prêt à explorer la météo ?</h3>
              <p className="text-white/70 text-lg">Recherchez une ville pour commencer</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-white/60">Données météo en temps réel via OpenWeatherMap</p>
        </footer>
      </div>
    </div>
  )
}
