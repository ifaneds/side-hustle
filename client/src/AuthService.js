import { API_BASE_URL } from "./config"; // Adjust the import path as necessary

const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token; // Returns true if token exists, false otherwise
};

const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Login response:", data);

      localStorage.setItem("authToken", data.token); // Store the token

      // Ensure userId is stored as a string
      if (data.userId !== undefined) {
        localStorage.setItem("userId", String(data.userId));
        console.log(
          "Stored user ID:",
          data.userId,
          "Type:",
          typeof data.userId
        );
      } else {
        console.error("No user ID in login response");
      }

      return data;
    } else {
      const errorData = await response.json();
      return Promise.reject(errorData);
    }
  } catch (error) {
    return Promise.reject(error);
  }
};

const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userId"); // Remove user ID on logout
};

const getCurrentUser = () => {
  const token = localStorage.getItem("authToken");
  const userId = localStorage.getItem("userId");
  if (token) {
    // Return both token and userId
    return { token, userId };
  }
  return null;
};

const authService = {
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
};

export default authService;
