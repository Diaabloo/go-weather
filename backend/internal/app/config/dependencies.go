// internal/app/config/dependencies.go
package config

import (
	"context"
	"errors"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Dependencies struct {
	Config         Config
	UserCollection *mongo.Collection
}

func InitDependencies() (*Dependencies, error) {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system environment variables")
	}

	cfg := Config{
		OpenWeatherKey: os.Getenv("OPENWEATHER_API_KEY"),
		Port:           os.Getenv("PORT"),
		MongoURI:       os.Getenv("MONGODB_URI"),
		JWTSecret:      os.Getenv("JWT_SECRET"),
	}

	if cfg.MongoURI == "" {
		return nil, errors.New("MONGODB_URI is required")
	}

	clientOptions := options.Client().ApplyURI(cfg.MongoURI)
	client, err := mongo.Connect(context.Background(), clientOptions)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := client.Ping(ctx, nil); err != nil {
		return nil, err
	}
	log.Println("Connexion à MongoDB établie")

	userCollection := client.Database("weatherdb").Collection("users")

	return &Dependencies{
		Config:         cfg,
		UserCollection: userCollection,
	}, nil
}
