package models

import "time"

// FeelingType represents the three possible feelings
type FeelingType string

const (
	Happy  FeelingType = "happy"
	Normal FeelingType = "normal"
	Sad    FeelingType = "sad"
)

// Feeling represents a user's feeling for a specific date
type Feeling struct {
	Date    string      `json:"date"`    // Format: YYYY-MM-DD
	Feeling FeelingType `json:"feeling"` // happy, normal, or sad
	UpdatedAt time.Time `json:"updated_at"`
}

// IsValid checks if a feeling type is valid
func (f FeelingType) IsValid() bool {
	return f == Happy || f == Normal || f == Sad
}
