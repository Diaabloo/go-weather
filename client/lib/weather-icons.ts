export function getWeatherIcon(iconCode: string): string {
  const iconMap: Record<string, string> = {
    "01d": "☀️", "01n": "🌙",
    "02d": "🌤️", "02n": "☁️",
    "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️",
    "09d": "🌦️", "09n": "🌦️",
    "10d": "🌧️", "10n": "🌧️",
    "11d": "⛈️", "11n": "⛈️",
    "13d": "❄️", "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️",
  }

  return iconMap[iconCode] || "🌤️"
}

export function getBackgroundGradient(condition?: string): string {
  if (!condition) return "from-blue-400 to-blue-600" // fallback si undefined

  const conditionLower = condition.toLowerCase()

  if (conditionLower.includes("clear") || conditionLower.includes("sun")) {
    return "from-yellow-400 to-orange-500"
  } else if (conditionLower.includes("cloud")) {
    return "from-gray-400 to-gray-600"
  } else if (conditionLower.includes("rain") || conditionLower.includes("drizzle")) {
    return "from-blue-500 to-blue-700"
  } else if (conditionLower.includes("thunder") || conditionLower.includes("storm")) {
    return "from-purple-600 to-gray-800"
  } else if (conditionLower.includes("snow")) {
    return "from-blue-200 to-white"
  } else if (conditionLower.includes("mist") || conditionLower.includes("fog")) {
    return "from-gray-300 to-gray-500"
  } else {
    return "from-blue-400 to-blue-600"
  }
}
