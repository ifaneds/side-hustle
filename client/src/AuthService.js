const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return !!token; // Returns true if token exists, false otherwise
};

const login = async (email, password) => {
  try {
    const response = await fetch("http://localhost:8081/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("authToken", data.token); // Store the token
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
};

const getCurrentUser = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    // Decode or fetch user data from token
    return { token };
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
