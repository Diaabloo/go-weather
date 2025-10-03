// Configure the HTTP server and routes.
package http

import (
	"net/http"

	"github.com/Diaabloo/go-weather/internal/app/config"
	"github.com/Diaabloo/go-weather/internal/app/mongo"
	"github.com/Diaabloo/go-weather/internal/app/utils"
	"github.com/rs/cors"
)

// Server represents the HTTP server
type Server struct {
	mux       *http.ServeMux
	config    config.Config
	userRepo  *mongo.UserRepository
	JWTSecret string
	Router    *http.ServeMux
}

// NewServer creates a new HTTP server
func NewServer(deps *config.Dependencies) *Server {
	s := &Server{
		mux:      http.NewServeMux(),
		config:   deps.Config,
		userRepo: mongo.NewUserRepository(deps.UserCollection),
	}

	// Initialize handlers
	authHandler := NewAuthHandler(s.userRepo, deps.Config)
	weatherHandler := NewWeatherHandler(deps.Config)

	// Define routes
	s.mux.HandleFunc("/api/health", HealthCheckHandler)
	s.mux.HandleFunc("/api/signup", authHandler.SignupHandler)
	s.mux.HandleFunc("/api/signin", authHandler.SigninHandler)
	s.mux.HandleFunc("/api/weather", utils.AuthMiddleware(deps.Config.JWTSecret)(weatherHandler.WeatherHandler))

	return s
}

// Start runs the HTTP server
func (s *Server) Start() error {
	corsOptions := cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
		Debug:            true,
	}
	handler := cors.New(corsOptions).Handler(s.mux)

	return http.ListenAndServe(":"+s.config.Port, handler)
}
