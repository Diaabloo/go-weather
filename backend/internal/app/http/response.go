package http

import (
	"encoding/json"
	"net/http"

	"github.com/Diaabloo/go-weather/internal/app/models"
)

func sendResponse(w http.ResponseWriter, statusCode int, response models.Response) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(response)
}
