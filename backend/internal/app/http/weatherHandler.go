package http

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"

	"github.com/Diaabloo/go-weather/internal/app/config"
	"github.com/Diaabloo/go-weather/internal/app/models"
)

// WeatherHandler handles weather API requests
type WeatherHandler struct {
	config config.Config
}

// NewWeatherHandler creates a new WeatherHandler
func NewWeatherHandler(config config.Config) *WeatherHandler {
	return &WeatherHandler{config: config}
}

// WeatherHandler handles /api/weather
func (h *WeatherHandler) WeatherHandler(w http.ResponseWriter, r *http.Request) {
	city := r.URL.Query().Get("city")
	if city == "" {
		sendResponse(w, http.StatusBadRequest, models.Response{Status: "error", Error: "Veuillez entrer le nom d'une ville"})
		return
	}

	cityQuery := strings.TrimSpace(strings.Split(city, ",")[0])
	if cityQuery == "" {
		sendResponse(w, http.StatusBadRequest, models.Response{Status: "error", Error: "Nom de ville invalide"})
		return
	}

	url := fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?q=%s&appid=%s&units=metric&lang=fr", cityQuery, h.config.OpenWeatherKey)
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get(url)
	if err != nil {
		sendResponse(w, http.StatusInternalServerError, models.Response{Status: "error", Error: "Impossible de récupérer les données météo"})
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil || len(body) == 0 {
		sendResponse(w, http.StatusInternalServerError, models.Response{Status: "error", Error: "Erreur lors de la lecture de la réponse"})
		return
	}

	if resp.StatusCode != http.StatusOK {
		var apiErr models.OpenWeatherError
		if err := json.Unmarshal(body, &apiErr); err != nil {
			sendResponse(w, http.StatusInternalServerError, models.Response{Status: "error", Error: "Erreur décodage erreur"})
			return
		}
		var statusCode int
		var errorMsg string
		switch apiErr.Cod {
		case 401:
			statusCode = http.StatusUnauthorized
			errorMsg = "Clé API invalide."
		case 404:
			statusCode = http.StatusNotFound
			errorMsg = "Ville non trouvée."
		default:
			statusCode = http.StatusInternalServerError
			errorMsg = apiErr.Message
		}
		sendResponse(w, statusCode, models.Response{Status: "error", Error: errorMsg})
		return
	}

	var apiResp models.OpenWeatherResponse
	if err := json.Unmarshal(body, &apiResp); err != nil {
		sendResponse(w, http.StatusInternalServerError, models.Response{Status: "error", Error: "Erreur décodage données"})
		return
	}

	if len(apiResp.Weather) == 0 {
		sendResponse(w, http.StatusInternalServerError, models.Response{Status: "error", Error: "Aucune donnée météo"})
		return
	}

	weather := models.Weather{
		City:        apiResp.Name,
		Country:     apiResp.Sys.Country,
		Temperature: apiResp.Main.Temp,
		Description: apiResp.Weather[0].Description,
		Humidity:    apiResp.Main.Humidity,
		Pressure:    apiResp.Main.Pressure,
		WindSpeed:   apiResp.Wind.Speed,
		FeelsLike:   apiResp.Main.FeelsLike,
		Icon:        apiResp.Weather[0].Icon,
		Condition:   apiResp.Weather[0].Main,
	}

	sendResponse(w, http.StatusOK, models.Response{Data: weather, Status: "success"})
}
