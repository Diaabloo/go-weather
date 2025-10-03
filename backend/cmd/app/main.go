package main

import (
	"log"

	"github.com/Diaabloo/go-weather/internal/app"
)

func main() {
	if err := app.Run(); err != nil {
		log.Fatal("Failed to start application: ", err)
	}
}
