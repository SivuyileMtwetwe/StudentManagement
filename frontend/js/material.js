import { showLoader, hideLoader, showNotification } from './utilities.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export class MaterialManager {
  constructor() {
    this.materials = [];
    this.currentPage = 1;
  }

  async uploadMaterial(formData) {
    showLoader();
    try {
      const response = await fetch(`${API_BASE}/materials`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      showNotification('Material uploaded successfully');
      return await response.json();
    } catch (error) {
      showNotification(error.message, 'error');
      return null;
    } finally {
      hideLoader();
    }
  }

  async getMaterials(filter = {}) {
    showLoader();
    try {
      const params = new URLSearchParams({
        page: this.currentPage,
        ...filter
      });

      const response = await fetch(`${API_BASE}/materials?${params}`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch materials');
      
      const data = await response.json();
      this.materials = data.docs;
      return data;
    } catch (error) {
      showNotification(error.message, 'error');
      return null;
    } finally {
      hideLoader();
    }
  }

  // Additional methods for delete/update
}