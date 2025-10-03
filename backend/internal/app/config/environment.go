package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Config holds environment variables
type Config struct {
	Port           string
	MongoURI       string
	OpenWeatherKey string
	JWTSecret      string
}

// LoadConfig loads environment variables
func LoadConfig() Config {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system env vars")
	}

	return Config{
		Port:           getEnv("PORT", "8080"),
		MongoURI:       getEnv("MONGODB_URI", ""),
		OpenWeatherKey: getEnv("OPENWEATHER_API_KEY", ""),
		JWTSecret:      getEnv("JWT_SECRET", ""),
	}
}

// getEnv retrieves env var with fallback
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}
