package storage

import (
	"sync"
	"time"

	"github.com/reyesossorio/wyrf/internal/models"
)

// MemoryStorage provides thread-safe in-memory storage for feelings
type MemoryStorage struct {
	feelings map[string]models.Feeling // key: date (YYYY-MM-DD)
	mu       sync.RWMutex
}

// NewMemoryStorage creates a new in-memory storage instance
func NewMemoryStorage() *MemoryStorage {
	return &MemoryStorage{
		feelings: make(map[string]models.Feeling),
	}
}

// SaveFeeling saves or updates a feeling for a specific date
func (s *MemoryStorage) SaveFeeling(date string, feelingType models.FeelingType) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.feelings[date] = models.Feeling{
		Date:      date,
		Feeling:   feelingType,
		UpdatedAt: time.Now(),
	}
	return nil
}

// GetAllFeelings returns all stored feelings
func (s *MemoryStorage) GetAllFeelings() []models.Feeling {
	s.mu.RLock()
	defer s.mu.RUnlock()

	feelings := make([]models.Feeling, 0, len(s.feelings))
	for _, feeling := range s.feelings {
		feelings = append(feelings, feeling)
	}
	return feelings
}

// GetFeeling retrieves a feeling for a specific date
func (s *MemoryStorage) GetFeeling(date string) (models.Feeling, bool) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	feeling, exists := s.feelings[date]
	return feeling, exists
}
