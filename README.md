# Documentation du projet Go-Weather

## 1. Project Overview
**Go-Weather** is a backend application in Go that provides authentication endpoints (signup, signin) and a weather API using the OpenWeather API. It uses MongoDB to store users and JWT to secure the endpoints. The project follows best code structuring practices, as required by my professor, by using the internal/ directory to organize the code.

The project is hosted in C:\Users\XPS\Desktop\go-weather (initially in backend/, but moved to avoid $GOPATH issues).

### Features
- **/api/health**: Checks if the server is running (GET).
- **/api/signup**: Registers a new user with email and password (POST).
- **/api/signin**: Logs in a user and returns a JWT token (POST).
- **/api/weather?city=<ville>**: Retrieves weather data for a given city, protected by JWT (GET).

## 2. Project Structure
The project is organized according to a modular architecture with well-defined folders to respect Go standards and avoid import errors.

```
go-weather/
├── .env                    # Environment variables (API keys, MongoDB URI, etc.)
├── .env.example            # Example of .env for sharing
├── .gitignore              # Ignore .env and temporary files
├── go.mod                  # Go module definitions
├── go.sum                  # Dependencies checksum
├── cmd/
│   └── app/
│       └── main.go         # Application entry point
├── internal/
│   └── app/
│       ├── app.go          # Initialization and application startup
│       ├── config/
│       │   ├── dependencies.go  # Dependency management (MongoDB, config)
│       │   └── environment.go   # Environment variables loading
│       ├── http/
│       │   ├── auth_handler.go      # Handles signup/signin endpoints
│       │   ├── healthcheck_handler.go # /api/health endpoint
│       │   ├── response.go          # Utility function sendResponse
│       │   ├── server.go            # HTTP server configuration
│       │   └── weather_handler.go   # /api/weather endpoint
│       ├── mongo/
│       │   └── user.go              # MongoDB operations for users
│       ├── models/
│       │   ├── user.go              # User data structures
│       │   └── weather.go           # Weather data structures
│       └── utils/
│           └── jwt.go               # JWT token management
├── tests/
│   └── auth_test.go                 # Authentication tests

```

### Folder Explanation
- **`cmd/app/main.go`**: Contains the main function that calls app.Run() to start the application.
- **`internal/app/`**: Contains all core code, organized into submodules:
  - `config/` : Handles environment variables and dependencies (MongoDB, API keys).
  - `http/` : Handles HTTP endpoints and JSON responses.
  - `mongo/` : Handles MongoDB interactions (user creation/search).
  - `models/` : Defines structs for users and weather data.
  - `utils/` : Contains utilities, such as JWT management.
- **`tests/`**: Contains unit tests (e.g., authentication).

## 3. Key Files Content

### go.mod
Defines the module and dependencies used:
```module github.com/Diaabloo/go-weather

go 1.25.1

require (
    github.com/golang-jwt/jwt/v4 v4.5.2
    github.com/joho/godotenv v1.5.1
    github.com/rs/cors v1.11.1
    go.mongodb.org/mongo-driver v1.17.4
    golang.org/x/crypto v0.42.0
)

```


### cmd/app/main.go
Entry point that starts the application:
```go
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
```

### internal/app/app.go
Initializes dependencies and starts the server:
```go
package app

import (
    "log"
    "github.com/Diaabloo/go-weather/internal/app/config"
    "github.com/Diaabloo/go-weather/internal/app/http"
)

func Run() error {
    deps, err := config.InitDependencies()
    if err != nil {
        return err
    }
    server := http.NewServer(deps)
    log.Printf("Starting server on port %s", deps.Config.Port)
    return server.Start()
}
```

### internal/app/http/response.go
Defines the utility function sendResponse to send JSON responses:
```go
package http

import (
    "encoding/json"
    "log"
    "net/http"
    "github.com/Diaabloo/go-weather/internal/app/models"
)

func sendResponse(w http.ResponseWriter, statusCode int, response models.Response) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    if err := json.NewEncoder(w).Encode(response); err != nil {
        log.Println("Erreur lors de l'encodage JSON:", err)
    }
}
```

### internal/app/http/auth_handler.go
Handles /api/signup and /api/signin endpoints:
- **Signup**: Creates a user with email/password (hashed with bcrypt).
- **Signin**: Validates credentials and returns a JWT token.

### internal/app/http/weather_handler.go
Handles /api/weather endpoint:
- Fetches weather data from OpenWeather API for a given city.
- Protected by a JWT middleware.

### internal/app/utils/jwt.go
Manages JWT token creation and validation:
- **GenerateJWT**: Creates a token with email and expiration (24h).
- **ValidateJWT**: Validates the token.
- **AuthMiddleware**: Protects routes (e.g., /api/weather) by checking JWT token.

## 4. Concepts appris
- **Go Modules** : Utilisation de `go.mod` pour gérer les dépendances et éviter les problèmes liés à `$GOPATH`.
- **Structs vs map[string]interface{}** : Les `structs` (par exemple, `models.User`, `models.Weather`) sont plus sûrs et clairs que `map[string]interface{}` pour manipuler les données JSON.
- **Packages internes** : Utilisation de `internal/` pour organiser le code et restreindre l’accès aux packages en dehors du module.
- **Middleware JWT** : Sécurisation des routes avec des tokens JWT pour protéger l’endpoint `/api/weather`.
- **MongoDB** : Connexion à MongoDB pour stocker les utilisateurs et hachage des mots de passe avec `bcrypt`.
- **CORS** : Configuration de `github.com/rs/cors` pour autoriser les requêtes provenant d’un frontend (exemple : `http://localhost:3000`).
- **Gestion des erreurs** : Résolution d’erreurs comme `compilerUnusedImport`, `compilerDuplicateDecl` et `compilerUnusedVar` en nettoyant les imports et en consolidant les fonctions.

---

## 5. Étapes pour exécuter le projet

1. **Configurer l’environnement** :
   - Vérifier que le projet est bien dans :
     `C:\Users\XPS\Desktop\go-weather`
   - S’assurer que le fichier `.env` contient les bonnes clés (OpenWeather, MongoDB, JWT).
   - Définir la variable d’environnement Go :
     ```powershell
     setx GO111MODULE on
     ```

2. **Installer les dépendances** :
   ```powershell
   cd C:\Users\XPS\Desktop\go-weather
   go mod tidy
