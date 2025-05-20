import { showLoader, hideLoader, showNotification } from './utilities.js';

const loginUser = async (username, password) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      signal: controller.signal,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    clearTimeout(timeoutId);
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
};

const checkSession = () => {
  const token = sessionStorage.getItem('token');
  const lastActivity = sessionStorage.getItem('lastActivity');
  const TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  if (!token || !lastActivity || Date.now() - parseInt(lastActivity) > TIMEOUT) {
    sessionStorage.clear();
    window.location.href = 'index.html';
  }
  sessionStorage.setItem('lastActivity', Date.now().toString());
};

// Add to protected pages
setInterval(checkSession, 60000); // Check every minute

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const forgotPasswordLink = document.getElementById("forgotPassword");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const data = await loginUser(username, password);

      if (data.token) {
        showNotification("Signed in successfully");
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('loggedInUser', data.user.username);
        sessionStorage.setItem('userRole', data.user.role);
        sessionStorage.setItem('lastActivity', Date.now().toString());
        window.location.href = "dashboard.html";
      } else {
        showNotification(data.message || "Invalid credentials", "error");
      }
    } catch (error) {
      showNotification(error.message || "Login failed. Please try again.", "error");
    } finally {
      hideLoader();
    }
  });

  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    showNotification("Password reset functionality would be implemented here.", "info");
  });
});