# Documentation du projet Go-Weather

## 1. Aperçu du projet
**Go-Weather** est une application backend en Go qui fournit des endpoints d'authentification (signup, signin) et une API météo utilisant l'API OpenWeather. Elle utilise MongoDB pour stocker les utilisateurs et JWT pour sécuriser les endpoints. Le projet suit les bonnes pratiques de structuration de code, comme demandé par mon professeur, en utilisant le dossier `internal/` pour organiser le code.

Le projet est hébergé dans `C:\Users\XPS\Desktop\go-weather` (initialement dans `backend/`, mais déplacé pour éviter les problèmes de `$GOPATH`).

### Fonctionnalités
- **/api/health**: Vérifie si le serveur fonctionne (GET).
- **/api/signup**: Enregistre un nouvel utilisateur avec email et mot de passe (POST).
- **/api/signin**: Connecte un utilisateur et retourne un token JWT (POST).
- **/api/weather?city=<ville>**: Récupère les données météo pour une ville, protégé par JWT (GET).

## 2. Structure du projet
Le projet est organisé selon une architecture modulaire avec des dossiers bien définis pour respecter les standards Go et éviter les erreurs d'importation.

```
go-weather/
├── .env                    # Variables d'environnement (API keys, MongoDB URI, etc.)
├── .env.example            # Exemple de .env pour partager
├── .gitignore              # Ignore .env et fichiers temporaires
├── go.mod                  # Définitions du module Go
├── go.sum                  # Somme des dépendances
├── cmd/
│   └── app/
│       └── main.go         # Point d'entrée de l'application
├── internal/
│   └── app/
│       ├── app.go          # Initialisation et démarrage de l'application
│       ├── config/
│       │   ├── dependencies.go  # Gestion des dépendances (MongoDB, config)
│       │   └── environment.go   # Chargement des variables d'environnement
│       ├── http/
│       │   ├── auth_handler.go      # Gestion des endpoints signup/signin
│       │   ├── healthcheck_handler.go # Endpoint /api/health
│       │   ├── response.go          # Fonction utilitaire sendResponse
│       │   ├── server.go            # Configuration du serveur HTTP
│       │   └── weather_handler.go    # Endpoint /api/weather
│       ├── mongo/
│       │   └── user.go              # Opérations MongoDB pour les utilisateurs
│       ├── models/
│       │   ├── user.go              # Structure des données utilisateur
│       │   └── weather.go           # Structures pour les données météo
│       └── utils/
│           └── jwt.go               # Gestion des tokens JWT
├── tests/
│   └── auth_test.go                 # Tests pour l'authentification
```

### Explication des dossiers
- **`cmd/app/main.go`**: Contient la fonction `main` qui appelle `app.Run()` pour démarrer l'application.
- **`internal/app/`**: Contient tout le code principal, organisé en sous-modules :
  - `config/` : Gère les variables d’environnement et les dépendances (MongoDB, clés API).
  - `http/` : Gère les endpoints HTTP et les réponses JSON.
  - `mongo/` : Gère les interactions avec MongoDB (création/recherche d’utilisateurs).
  - `models/` : Définit les structs pour les utilisateurs et les données météo.
  - `utils/` : Contient les utilitaires, comme la gestion des JWT.
- **`tests/`**: Contient les tests unitaires (par exemple, pour l’authentification).

## 3. Contenu des fichiers clés

### go.mod
Définit le module et les dépendances utilisées :
```go
module github.com/Diaabloo/go-weather

go 1.25.1

require (
    github.com/golang-jwt/jwt/v4 v4.5.2
    github.com/joho/godotenv v1.5.1
    github.com/rs/cors v1.11.1
    go.mongodb.org/mongo-driver v1.17.4
    golang.org/x/crypto v0.42.0
)
```

### .env
Contient les variables d’environnement (non partagé dans le dépôt) :
```env
OPENWEATHER_API_KEY=5fceee4b9bf1d9a274a428ffd81ec5ae
PORT=8080
MONGODB_URI=mongodb+srv://amineelalami05:p2mshacO6mYpbTVn@cluster0.0i6tj3k.mongodb.net/
JWT_SECRET=3f9c2d78a1e4c7f1d0a9b6e5f4c2a7d1e8b9c0f5a6d3e7b2c8f4a1d9e6b3c7f8
```

### cmd/app/main.go
Point d’entrée qui démarre l’application :
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
Initialise les dépendances et démarre le serveur :
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
Définit la fonction utilitaire `sendResponse` pour envoyer des réponses JSON :
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
Gère les endpoints `/api/signup` et `/api/signin` :
- **Signup**: Crée un utilisateur avec email/mot de passe (haché avec bcrypt).
- **Signin**: Vérifie les identifiants et retourne un token JWT.

### internal/app/http/weather_handler.go
Gère l’endpoint `/api/weather` :
- Récupère les données météo via l’API OpenWeather pour une ville donnée.
- Protégé par un middleware JWT.

### internal/app/utils/jwt.go
Gère la création et la validation des tokens JWT :
- **GenerateJWT**: Crée un token avec l’email et une expiration (24h).
- **ValidateJWT**: Vérifie la validité du token.
- **AuthMiddleware**: Protège les routes (par exemple, `/api/weather`) en vérifiant le token JWT.

## 4. Problèmes rencontrés et solutions

### Erreur 1 : Importation de `github.com/Diaabloo/go-weather/internal/app` non trouvée
- **Problème** : `main.go` essayait d’importer des packages inexistants (`github.com/Diaabloo/go-weather/config` et `routes`).
- **Solution** : Corrigé en mettant à jour `main.go` pour importer `github.com/Diaabloo/go-weather/internal/app` et en vérifiant que `internal/app/app.go` existe avec le bon contenu.

### Erreur 2 : Importation inutilisée de `go.mongodb.org/mongo-driver/mongo`
- **Problème** : Dans `auth_handler.go`, le package `mongo` était importé mais non utilisé, causant une erreur `compilerUnusedImport`.
- **Solution** : Supprimé l’importation inutile, car les opérations MongoDB sont gérées dans `internal/app/mongo/user.go`.

### Erreur 3 : Déclaration en double de `sendResponse`
- **Problème** : La fonction `sendResponse` était définie dans `auth_handler.go` et `weather_handler.go`, causant une erreur `compilerDuplicateDecl`.
- **Solution** : Déplacé `sendResponse` dans un nouveau fichier `response.go` pour une seule définition partagée dans le package `http`.

### Erreur 4 : Variable `ctx` non utilisée
- **Problème** : Dans `app.go`, une variable `ctx` était déclarée pour stocker `JWTSecret` mais non utilisée, causant une erreur `compilerUnusedVar`.
- **Solution** : Supprimé `ctx` et modifié `utils/jwt.go` pour passer `JWTSecret` directement au middleware via l’injection de dépendances.

### Erreur 5 : Fichier `response.go` vide
- **Problème** : `response.go` était vide, causant une erreur `expected 'package', found 'EOF'`.
- **Solution** : Créé `response.go` avec la déclaration correcte du package et la fonction `sendResponse`.

### Erreur 6 : Avertissement `$GOPATH`
- **Problème** : Go ignorait `go.mod` car le projet était dans un sous-dossier de `$GOPATH` (`C:\Users\XPS\go`).
- **Solution** : Déplacé le projet vers `C:\Users\XPS\Desktop\go-weather` (en dehors de `$GOPATH`) et défini `GO111MODULE=on` pour forcer le mode module. Vérifié qu’aucun `go.mod` parasite n’existait dans `C:\Users\XPS\go`.

## 5. Tests avec Postman
Pour vérifier que l’application fonctionne, j’ai testé les endpoints avec Postman :
- **/api/health** (GET) :
  - URL : `http://localhost:8080/api/health`
  - Réponse : `{"status": "OK"}` (code 200)
- **/api/signup** (POST) :
  - URL : `http://localhost:8080/api/signup`
  - Corps : `{"email": "test@example.com", "password": "password123"}`
  - Réponse : `{"status": "success", "data": "Utilisateur créé"}` (code 201)
- **/api/signin** (POST) :
  - URL : `http://localhost:8080/api/signin`
  - Corps : `{"email": "test@example.com", "password": "password123"}`
  - Réponse : `{"status": "success", "data": {"token": "eyJ..."}}` (code 200)
- **/api/weather** (GET) :
  - URL : `http://localhost:8080/api/weather?city=Paris`
  - En-tête : `Authorization: Bearer <token>`
  - Réponse : Données météo (température, humidité, etc.) (code 200)
  - Sans token : `{"error": "Token manquant"}` (code 401)

## 6. Concepts appris
- **Go Modules** : Utilisation de `go.mod` pour gérer les dépendances et éviter les problèmes de `$GOPATH`.
- **Structs vs map[string]interface{}** : Les structs (par exemple, `models.User`, `models.Weather`) sont plus sûrs et clairs que `map[string]interface{}` pour gérer les données JSON.
- **Packages internes** : Utilisation de `internal/` pour organiser le code et restreindre l’accès aux packages en dehors du module.
- **Middleware JWT** : Sécurisation des routes avec des tokens JWT pour protéger l’endpoint `/api/weather`.
- **MongoDB** : Connexion à MongoDB pour stocker les utilisateurs et hachage des mots de passe avec `bcrypt`.
- **CORS** : Configuration de `github.com/rs/cors` pour permettre les requêtes depuis un frontend (par exemple, `http://localhost:3000`).
- **Gestion des erreurs** : Résolution d’erreurs comme `compilerUnusedImport`, `compilerDuplicateDecl`, et `compilerUnusedVar` en nettoyant les imports et en consolidant les fonctions.

## 7. Étapes pour exécuter le projet
1. **Configurer l’environnement** :
   - S’assurer que le projet est dans `C:\Users\XPS\Desktop\go-weather`.
   - Vérifier que `.env` contient les bonnes clés (OpenWeather, MongoDB, JWT).
   - Définir `GO111MODULE=on` :
     ```powershell
     setx GO111MODULE on
     ```

2. **Installer les dépendances** :
   ```powershell
   cd C:\Users\XPS\Desktop\go-weather
   go mod tidy
   ```

3. **Compiler et exécuter** :
   ```powershell
   go build cmd/app/main.go
   go run cmd/app/main.go
   ```

4. **Tester avec Postman** : Suivre les tests décrits dans la section 5.

## 8. Notes pour le professeur
- Le projet respecte les bonnes pratiques Go, avec une séparation claire entre la logique métier (`internal/app/`), les modèles (`models/`), et les utilitaires (`utils/`).
- Les erreurs rencontrées (imports, déclarations en double, `$GOPATH`) ont été résolues en suivant les recommandations de structuration et en utilisant le mode module.
- Le code est commenté et testé avec Postman pour garantir que les endpoints fonctionnent.
- J’ai appris à gérer les dépendances, sécuriser les routes avec JWT, et interagir avec MongoDB, ce qui m’a aidé à mieux comprendre Go en tant que débutant.

Si vous avez des suggestions pour améliorer le projet ou des points à clarifier, je suis prêt à les intégrer !