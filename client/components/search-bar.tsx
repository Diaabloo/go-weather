"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"

interface SearchBarProps {
  onSearch: (city: string) => void
  loading?: boolean
}

export function SearchBar({ onSearch, loading = false }: SearchBarProps) {
  const [city, setCity] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])

  // Simple local list for suggestions (no backend change)
  const ALL_CITIES = [
    "Paris",
    "London",
    "Tokyo",
    "New York",
    "Los Angeles",
    "Chicago",
    "Berlin",
    "Madrid",
    "Barcelona",
    "Rome",
    "Milan",
    "Lisbon",
    "Amsterdam",
    "Brussels",
    "Vienna",
    "Prague",
    "Budapest",
    "Warsaw",
    "Zurich",
    "Geneva",
    "Copenhagen",
    "Stockholm",
    "Oslo",
    "Helsinki",
    "Dublin",
    "Toronto",
    "Montreal",
    "Sydney",
    "Melbourne",
    "Auckland",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim() && !loading) {
      onSearch(city.trim())
    }
  }

  const popularCities = ["Paris", "London", "Tokyo", "New York"]

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            type="text"
            value={city}
            onChange={(e) => {
              const value = e.target.value
              setCity(value)
              if (value.trim().length >= 2) {
                const v = value.toLowerCase()
                const next = ALL_CITIES.filter((c) => c.toLowerCase().includes(v)).slice(0, 6)
                setSuggestions(next)
              } else {
                setSuggestions([])
              }
            }}
            placeholder="Rechercher une ville..."
            className="pl-12 pr-24 h-14 text-lg glass-effect border-white/20 text-white placeholder:text-white/70 focus:border-primary"
            disabled={loading}
          />
          <Button
            type="submit"
            disabled={!city.trim() || loading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
          {suggestions.length > 0 && city.trim().length >= 2 && (
            <div className="absolute z-10 mt-2 w-full bg-black/60 backdrop-blur-md border border-white/10 rounded-md shadow-lg">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="w-full text-left px-4 py-2 hover:bg-white/10 text-white"
                  onMouseDown={() => {
                    setCity(s)
                    setSuggestions([])
                    if (!loading) onSearch(s)
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </form>

      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-white/80 text-sm font-medium">Villes populaires:</span>
        {popularCities.map((popularCity) => (
          <Button
            key={popularCity}
            variant="outline"
            size="sm"
            onClick={() => {
              setCity(popularCity)
              onSearch(popularCity)
            }}
            disabled={loading}
            className="glass-effect border-white/20 text-white hover:bg-white/20 hover:text-white"
          >
            {popularCity}
          </Button>
        ))}
      </div>
    </div>
  )
}
