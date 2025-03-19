// AuthService.js
const AuthService = {
  isAuthenticated: () => {
    // In a real app, check local storage or cookies for a token
    return !!localStorage.getItem("token");
  },

  login: (token) => {
    // In a real app, store the token securely
    localStorage.setItem("token", token);
  },

  logout: () => {
    localStorage.removeItem("token");
  },
};

export default AuthService;
