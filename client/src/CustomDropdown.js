// CustomDropdown.js
import React, { useState, useRef, useEffect } from "react";
import "./CustomDropdown.css";

function CustomDropdown({ items, buttonText, onItemClick }) {
  // Add onItemClick prop
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    if (onItemClick) {
      onItemClick(item); // Call the callback function
      setIsOpen(false); // Close the dropdown after selection
    }
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <button className="dropdown-button" onClick={toggleDropdown}>
        {buttonText}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {items.map((item, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={() => handleItemClick(item)} // Add onClick
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomDropdown;
