import { showLoader, hideLoader, showNotification } from './utilities.js';

const API_BASE = 'http://localhost:5000/api';

// Get auth headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };
};

// Fetch students with pagination and filtering
export const fetchStudents = async (page = 1, limit = 10, filters = {}) => {
  showLoader();
  try {
    const query = new URLSearchParams({
      page,
      limit,
      ...filters
    }).toString();

    const response = await fetch(`${API_BASE}/students?${query}`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error('Failed to fetch students');
    
    return await response.json();
  } catch (error) {
    showNotification(error.message, 'error');
    return [];
  } finally {
    hideLoader();
  }
};

// Create student
export const createStudent = async (studentData) => {
  showLoader();
  try {
    const response = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(studentData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create student');
    }

    showNotification('Student created successfully');
    return await response.json();
  } catch (error) {
    showNotification(error.message, 'error');
    return null;
  } finally {
    hideLoader();
  }
};