// SignInPage.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Import Link
import AuthService from "./AuthService"; // Import your AuthService (if you have one)
import "./SignInPage.css";

function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, send email and password to your backend
    // For this example, we'll simulate a successful login
    AuthService.login("fake-token"); // Store a fake token
    navigate("/"); // Redirect to home
  };

  return (
    <div>
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
