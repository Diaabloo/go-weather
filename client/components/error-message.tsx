"use client"

import type { WeatherError } from "@/lib/types"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ErrorMessageProps {
  error: WeatherError
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <Alert className="w-full max-w-2xl mx-auto glass-effect border-red-500/50 bg-red-500/10">
      <AlertCircle className="h-4 w-4 text-red-400" />
      <AlertDescription className="text-red-200">{error.message}</AlertDescription>
    </Alert>
  )
}
