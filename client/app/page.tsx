"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cloud, Sun, CloudRain, Sparkles, Shield, Zap } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push("/weather")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen weather-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen weather-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16 pt-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="relative">
              <Sun className="h-12 w-12 text-yellow-400 animate-pulse" />
              <Cloud className="h-8 w-8 text-white/80 absolute -top-1 -right-1" />
            </div>
            <h1 className="text-6xl font-bold text-white text-balance">Weather App</h1>
            <CloudRain className="h-12 w-12 text-blue-300" />
          </div>
          <p className="text-2xl text-white/90 text-pretty max-w-3xl mx-auto mb-8">
            Découvrez la météo en temps réel dans le monde entier
          </p>
          <p className="text-lg text-white/70 text-pretty max-w-2xl mx-auto">
            Recherchez votre ville et obtenez des informations météorologiques détaillées avec des données en temps réel
          </p>
        </div>

        {/* CTA Cards */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6 mb-16">
          <Card className="glass-effect border-white/20 hover:border-white/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Nouveau ici ?</CardTitle>
              <CardDescription className="text-white/70 text-base">
                Créez un compte gratuit pour accéder à toutes les fonctionnalités
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/signup">
                <Button className="w-full bg-white text-blue-600 hover:bg-white/90 font-semibold text-lg py-6">
                  Créer un compte
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20 hover:border-white/40 transition-all">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Déjà membre ?</CardTitle>
              <CardDescription className="text-white/70 text-base">
                Connectez-vous pour accéder à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="w-full bg-white/10 text-white border-white/30 hover:bg-white/20 font-semibold text-lg py-6"
                >
                  Se connecter
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6 mb-16">
          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
              <Zap className="h-6 w-6 text-yellow-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Temps réel</h3>
            <p className="text-white/70">Données météo actualisées en temps réel via OpenWeatherMap</p>
          </div>

          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
              <Sparkles className="h-6 w-6 text-blue-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Interface moderne</h3>
            <p className="text-white/70">Design élégant et intuitif pour une expérience utilisateur optimale</p>
          </div>

          <div className="glass-effect rounded-lg p-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 mb-4">
              <Shield className="h-6 w-6 text-green-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Sécurisé</h3>
            <p className="text-white/70">Vos données sont stockées en toute sécurité localement</p>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-white/10">
          <p className="text-white/60">Créé avec v0 • Données météo en temps réel via OpenWeatherMap</p>
        </footer>
      </div>
    </div>
  )
}
