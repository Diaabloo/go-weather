package http

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/Diaabloo/go-weather/internal/app/config"
	"github.com/Diaabloo/go-weather/internal/app/models"
	"github.com/Diaabloo/go-weather/internal/app/mongo"
	"github.com/Diaabloo/go-weather/internal/app/utils"
	"golang.org/x/crypto/bcrypt"
)

type AuthHandler struct {
	userRepo *mongo.UserRepository
	config   config.Config
}

func NewAuthHandler(userRepo *mongo.UserRepository, config config.Config) *AuthHandler {
	return &AuthHandler{userRepo: userRepo, config: config}
}

func (h *AuthHandler) SignupHandler(w http.ResponseWriter, r *http.Request) {
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		log.Println("Signup: Invalid JSON", err) // Log pour débogage
		sendResponse(w, http.StatusBadRequest, models.Response{Status: "error", Error: "JSON invalide"})
		return
	}

	log.Println("Signup: Received user:", user) // Log pour débogage

	if user.Name == "" || user.Email == "" || user.Password == "" || user.ConfirmPassword == "" {
		log.Println("Signup: Missing required fields") // Log pour débogage
		sendResponse(w, http.StatusBadRequest, models.Response{Status: "error", Error: "Name, email, password, and confirmPassword are required"})
		return
	}

	if user.Password != user.ConfirmPassword {
		log.Println("Signup: Passwords do not match") // Log pour débogage
		sendResponse(w, http.StatusBadRequest, models.Response{Status: "error", Error: "Passwords do not match"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	existingUser, err := h.userRepo.GetUserByEmail(ctx, user.Email)
	if err != nil {
		log.Println("Signup: Error GetUserByEmail:", err) // Log pour débogage
		sendResponse(w, http.StatusInternalServerError, models.Response{Status: "error", Error: "Erreur serveur"})
		return
	}
	if existingUser != nil {
		log.Println("Signup: Email already exists:", user.Email) // Log pour débogage
		sendResponse(w, http.StatusConflict, models.Response{Status: "error", Error: "Email déjà utilisé"})
		return
	}

	// Repository will hash the password; avoid double-hashing here
	user.ConfirmPassword = ""

	if err := h.userRepo.CreateUser(ctx, &user); err != nil {
		log.Println("Signup: Error CreateUser:", err) // Log pour débogage
		sendResponse(w, http.StatusInternalServerError, models.Response{Status: "error", Error: "Erreur lors de l'inscription"})
		return
	}

	log.Println("Signup: User created successfully:", user.Email) // Log pour débogage
	sendResponse(w, http.StatusCreated, models.Response{Status: "success", Data: "Utilisateur créé"})
}

func (h *AuthHandler) SigninHandler(w http.ResponseWriter, r *http.Request) {
	var creds struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
		log.Println("Signin: Invalid JSON", err) // Log pour débogage
		sendResponse(w, http.StatusBadRequest, models.Response{Status: "error", Error: "JSON invalide"})
		return
	}

	log.Println("Signin: Received credentials:", creds.Email) // Log pour débogage

	if creds.Email == "" || creds.Password == "" {
		log.Println("Signin: Missing email or password") // Log pour débogage
		sendResponse(w, http.StatusBadRequest, models.Response{Status: "error", Error: "Email et mot de passe requis"})
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	user, err := h.userRepo.GetUserByEmail(ctx, creds.Email)
	if err != nil || user == nil {
		log.Println("Signin: User not found or error:", err, creds.Email) // Log pour débogage
		sendResponse(w, http.StatusUnauthorized, models.Response{Status: "error", Error: "Email ou mot de passe incorrect"})
		return
	}

	log.Println("Signin: Found user:", user.Email, user.Password) // Log pour débogage
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password)); err != nil {
		log.Println("Signin: Password mismatch:", err) // Log pour débogage
		sendResponse(w, http.StatusUnauthorized, models.Response{Status: "error", Error: "Email ou mot de passe incorrect"})
		return
	}

	token, err := utils.GenerateJWT(user.Email, h.config.JWTSecret)
	if err != nil {
		log.Println("Signin: Error generating JWT:", err) // Log pour débogage
		sendResponse(w, http.StatusInternalServerError, models.Response{Status: "error", Error: "Erreur lors de la génération du token"})
		return
	}

	log.Println("Signin: Success for user:", user.Email) // Log pour débogage
	sendResponse(w, http.StatusOK, models.Response{
		Status: "success",
		Data: map[string]string{
			"token": token,
			"name":  user.Name,
		},
	})
}
