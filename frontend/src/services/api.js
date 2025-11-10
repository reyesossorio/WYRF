const API_BASE_URL = 'http://localhost:8080';

/**
 * Fetch all feelings from the backend
 * @returns {Promise<Array>} Array of feeling objects
 */
export const getFeelings = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/feelings`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching feelings:', error);
    throw error;
  }
};

/**
 * Save or update a feeling for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string} feeling - Feeling type: 'happy', 'normal', or 'sad'
 * @returns {Promise<Object>} Response from server
 */
export const saveFeeling = async (date, feeling) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/feelings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ date, feeling }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error saving feeling:', error);
    throw error;
  }
};

/**
 * Check backend health
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};
