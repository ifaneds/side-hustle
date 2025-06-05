// SignInPage.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import useAuth
import authService from "./AuthService";
import { API_BASE_URL } from "./config"; // Import the API base URL from config
import "./css/SignInPage.css";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth(); // Access login from context
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/find-job");
    } catch (error) {
      alert(error.message);
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <header className="App-header">
        <Link to="/">
          <h1>Side Hustle</h1>
        </Link>
      </header>
      <div className="space" />
      <main className="sign-in">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        <p>
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </main>
    </div>
  );
}

export default SignInPage;
