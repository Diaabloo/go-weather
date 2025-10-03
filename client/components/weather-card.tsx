"use client"

import type { WeatherData } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Thermometer, Droplets, Wind, Gauge } from "lucide-react"
import { getWeatherIcon, getBackgroundGradient } from "@/lib/weather-icons"

interface WeatherCardProps {
  weather: WeatherData
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const weatherIcon = getWeatherIcon(weather.icon)
  const backgroundGradient = getBackgroundGradient(weather.condition)

  return (
    <Card className="w-full max-w-2xl mx-auto glass-effect border-white/20 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${backgroundGradient}`} />

      <CardContent className="p-8">
        {/* Header avec ville et pays */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{weather.city}</h2>
          {weather.country && <p className="text-white/70 text-lg">{weather.country}</p>}
        </div>

        {/* Température principale */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4 weather-icon">{weatherIcon}</div>
          <div className="text-6xl font-bold text-white mb-2">{weather.temperature}°C</div>
          <p className="text-xl text-white/80 capitalize mb-2">{weather.description}</p>
          <p className="text-white/60">Ressenti {weather.feelsLike}°C</p>
        </div>

        {/* Détails météo */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-effect rounded-lg p-4 text-center border border-white/10">
            <Droplets className="h-6 w-6 text-blue-400 mx-auto mb-2" />
            <p className="text-white/60 text-sm">Humidité</p>
            <p className="text-white font-semibold text-lg">{weather.humidity}%</p>
          </div>

          <div className="glass-effect rounded-lg p-4 text-center border border-white/10">
            <Wind className="h-6 w-6 text-green-400 mx-auto mb-2" />
            <p className="text-white/60 text-sm">Vent</p>
            <p className="text-white font-semibold text-lg">{weather.windSpeed} km/h</p>
          </div>

          <div className="glass-effect rounded-lg p-4 text-center border border-white/10">
            <Gauge className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-white/60 text-sm">Pression</p>
            <p className="text-white font-semibold text-lg">{weather.pressure} hPa</p>
          </div>

          <div className="glass-effect rounded-lg p-4 text-center border border-white/10">
            <Thermometer className="h-6 w-6 text-red-400 mx-auto mb-2" />
            <p className="text-white/60 text-sm">Ressenti</p>
            <p className="text-white font-semibold text-lg">{weather.feelsLike}°C</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
