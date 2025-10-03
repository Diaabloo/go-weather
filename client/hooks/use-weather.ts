"use client";

import { useState, useCallback } from "react";
import type { WeatherData, WeatherError } from "@/lib/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<WeatherError | null>(null);

  const fetchWeather = useCallback(async (city: string) => {
    if (!city.trim()) {
      setError({ message: "Veuillez entrer le nom d'une ville" });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      console.log("Fetching weather with token:", token); // Log pour débogage
      if (!token) {
        throw new Error("Aucun token trouvé. Veuillez vous connecter.");
      }

      const response = await fetch(`${API_BASE_URL}/api/weather?city=${encodeURIComponent(city)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ajout du token
        },
      });

      const data = await response.json();
      console.log("Weather response:", data); // Log pour débogage

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Non autorisé : veuillez vous reconnecter");
        } else if (response.status === 404) {
          throw new Error("Ville non trouvée");
        } else if (response.status === 500) {
          throw new Error("Erreur du serveur");
        } else {
          throw new Error(data.error || `Erreur HTTP: ${response.status}`);
        }
      }

      setWeather(data?.data); // Utiliser la propriété data renvoyée par l'API backend
    } catch (err) {
      console.error("Weather API Error:", err);
      setError({
        message:
          err instanceof Error ? err.message : "Erreur lors de la récupération des données météo. Veuillez réessayer.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearWeather = useCallback(() => {
    setWeather(null);
    setError(null);
  }, []);

  return {
    weather,
    loading,
    error,
    fetchWeather,
    clearWeather,
  };
}