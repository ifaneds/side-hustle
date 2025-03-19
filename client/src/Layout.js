// Layout.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import AuthService from "./AuthService"; // Your authentication service
import "./Layout.css";

function Layout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(AuthService.isAuthenticated()); // Check authentication on mount
  }, []);

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
    navigate("/signin");
  };

  return (
    <div>
      <header className="App-header">
        <h1>Side Hustle</h1>
        <nav>
          <Link to="/find-job">Find a Job</Link>
          <Link to="/post-job">Post a Job</Link>
          {isAuthenticated ? (
            <div className="profile-dropdown">
              <Link to="/profile">Profile</Link>
              <div className="dropdown-content">
                <Link to="/settings">Settings</Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/signin">Sign In</Link>
          )}
        </nav>
      </header>
      <main>
        {children}
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
