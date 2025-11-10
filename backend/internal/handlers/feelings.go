package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/reyesossorio/wyrf/internal/models"
	"github.com/reyesossorio/wyrf/internal/storage"
)

// FeelingsHandler handles all feelings-related requests
type FeelingsHandler struct {
	storage *storage.MemoryStorage
}

// NewFeelingsHandler creates a new feelings handler
func NewFeelingsHandler(storage *storage.MemoryStorage) *FeelingsHandler {
	return &FeelingsHandler{storage: storage}
}

// GetFeelings handles GET /api/feelings
func (h *FeelingsHandler) GetFeelings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	feelings := h.storage.GetAllFeelings()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(feelings)
}

// SaveFeeling handles POST /api/feelings
func (h *FeelingsHandler) SaveFeeling(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var feeling models.Feeling
	if err := json.NewDecoder(r.Body).Decode(&feeling); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Validate feeling type
	if !feeling.Feeling.IsValid() {
		http.Error(w, "Invalid feeling type. Must be: happy, normal, or sad", http.StatusBadRequest)
		return
	}

	// Validate date is present
	if feeling.Date == "" {
		http.Error(w, "Date is required", http.StatusBadRequest)
		return
	}

	// Save to storage
	if err := h.storage.SaveFeeling(feeling.Date, feeling.Feeling); err != nil {
		http.Error(w, "Failed to save feeling", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Feeling saved successfully"})
}

// Health handles GET /health
func Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
}
