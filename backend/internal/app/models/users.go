// Définition du modèle User (struct)
package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID              primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Name            string             `bson:"name" json:"name"`
	Email           string             `bson:"email" json:"email"`
	Password        string             `bson:"password" json:"password"` // Hashé
	ConfirmPassword string             `bson:"confirmPassword,omitempty" json:"confirmPassword,omitempty"`
}
