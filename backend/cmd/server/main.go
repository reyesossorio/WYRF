package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/reyesossorio/wyrf/internal/handlers"
	"github.com/reyesossorio/wyrf/internal/middleware"
	"github.com/reyesossorio/wyrf/internal/storage"
)

func main() {
	// Initialize storage
	store := storage.NewMemoryStorage()

	// Initialize handlers
	feelingsHandler := handlers.NewFeelingsHandler(store)

	// Create router
	mux := http.NewServeMux()

	// Register routes
	mux.HandleFunc("/api/feelings", func(w http.ResponseWriter, r *http.Request) {
		switch r.Method {
		case http.MethodGet:
			feelingsHandler.GetFeelings(w, r)
		case http.MethodPost:
			feelingsHandler.SaveFeeling(w, r)
		default:
			http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		}
	})
	mux.HandleFunc("/health", handlers.Health)

	// Apply CORS middleware
	handler := middleware.CORS(mux)

	// Start server
	port := "8080"
	fmt.Printf("🚀 Server starting on http://localhost:%s\n", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
