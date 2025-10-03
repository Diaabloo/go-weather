package app

import (
	"log"

	"github.com/Diaabloo/go-weather/internal/app/config"
	"github.com/Diaabloo/go-weather/internal/app/http"
)

// Run initializes and starts the application
func Run() error {
	deps, err := config.InitDependencies()
	if err != nil {
		return err
	}

	server := http.NewServer(deps)
	log.Printf("Starting server on port %s", deps.Config.Port)
	return server.Start()
}
