import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./SignUpPage.css";

function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      firstName,
      lastName,
      password,
    };
    try {
      const response = await fetch("http://localhost:8081/api/register", {
        method: "POST", // POST request to register endpoint
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData), // Send user data
      });

      if (response.ok) {
        alert("User registered successfully!");
        navigate("/find-job"); // Redirect to find a job page
      } else {
        alert("User registration failed!");
      }
    } catch (error) {
      console.error("An error occurred", error);
      alert("An error occurred. Please try again later."); // Error handling
      console.log(userData); // Log the user data
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

      <main className="sign-up">
        <h2>Sign Up</h2>
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
          <div>
            <label htmlFor="first-name">First Name:</label>
            <input
              type="text"
              id="first-name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="last-name">Last Name:</label>
            <input
              type="text"
              id="last-name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </main>
    </div>
  );
}

export default SignUpPage;
