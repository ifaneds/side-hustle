import React, { useState } from "react";
import "./App.css";

function App() {
  const [isloggedIn, setIsLoggedIn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogin = (e) => {
    // Get the event object
    e.preventDefault(); // Prevent default link behavior
    // Simulate login logic (replace with your actual login logic)
    setIsLoggedIn(true);
  };

  const handleLogout = (e) => {
    e.preventDefault(); // Prevent default link behavior
    // Simulate logout logic (replace with your actual logout logic)
    setIsLoggedIn(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault(); // Prevent default link behavior (optional, but good practice)
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="App-title">
          <h1>Side Hustle</h1> {/* Or your logo */}
          <nav>
            <a href="/find-a-job">Find a Job</a>{" "}
            {/* Using an <a> tag for navigation */}
            <a href="/post-a-job">Post a Job</a>
            <a href="/about">About</a>
            <div>
              {isloggedIn ? (
                <>
                  <a href="/profile" onClick={toggleDropdown}>
                    User {/*replace with profile photo*/}
                  </a>

                  {isDropdownOpen && (
                    <div>
                      <a href="/profile">Profile</a>
                      <a href="/settings">Settings</a>
                      <a href="/" onClick={handleLogout}>
                        Logout
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <a onClick={handleLogin} href="/sign-in">
                  Sign in
                </a>
              )}
            </div>
          </nav>
        </div>
      </header>
      <main>{/* Your main content will go here */}</main>
    </div>
  );
}

export default App;
