// Layout.js
import React, { useEffect } from "react";
import { Link, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import useAuth
import authService from "./AuthService";
import CustomDropdown from './components/CustomDropdown';

import "./css/Layout.css";

function Layout({ children }) {
  const { isLoggedIn, setIsLoggedIn } = useAuth(); // Access context
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoggedIn(authService.isAuthenticated()); // Check on mount
  }, [setIsLoggedIn]); // Add setIsLoggedIn as dependency

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false); // Update context on logout
    navigate("/"); // Redirect to home page
  };

  return (
    <div>
      <header className="App-header">
        <Link to="/">
          <h1>Side Hustle</h1>
        </Link>
        <nav>
          <Link to="/find-job">Find a Job</Link>
          <Link to="/post-job">Post a Job</Link>
          {isLoggedIn ? ( // Use isLoggedIn from context
            <div>
              <CustomDropdown
                items={["Profile", "Settings", "Help", "Logout"]}
                buttonText="Account"
                onItemClick={(item) => {
                  if (item === "Logout") {
                    handleLogout();
                  } else {
                    navigate(`/${item.toLowerCase()}`);
                  }
                }}
              />
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
