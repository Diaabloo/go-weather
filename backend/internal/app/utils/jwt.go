package utils

import (
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

func GenerateJWT(email, jwtSecret string) (string, error) {
	claims := jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(jwtSecret))
}

func ValidateJWT(tokenStr, jwtSecret string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, jwt.ErrSignatureInvalid
		}
		return []byte(jwtSecret), nil
	})
	if err != nil {
		return nil, err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, jwt.ErrSignatureInvalid
}

func AuthMiddleware(jwtSecret string) func(http.HandlerFunc) http.HandlerFunc {
	return func(next http.HandlerFunc) http.HandlerFunc {
		return func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			log.Println("AuthMiddleware: Authorization header:", authHeader) // Log pour débogage
			if authHeader == "" {
				log.Println("AuthMiddleware: Missing Authorization header")
				http.Error(w, "Token manquant", http.StatusUnauthorized)
				return
			}

			tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenStr == authHeader {
				log.Println("AuthMiddleware: Invalid token format")
				http.Error(w, "Format de token invalide", http.StatusUnauthorized)
				return
			}

			claims, err := ValidateJWT(tokenStr, jwtSecret)
			if err != nil {
				log.Println("AuthMiddleware: Invalid token:", err)
				http.Error(w, "Token invalide", http.StatusUnauthorized)
				return
			}

			log.Println("AuthMiddleware: Token valid, email:", claims["email"])
			next(w, r)
		}
	}
}
