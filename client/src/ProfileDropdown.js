// ProfileDropdown.js
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "./AuthService";

function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate("/signin");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown}>Profile</button>
      {isOpen && (
        <div className="dropdown-content">
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
