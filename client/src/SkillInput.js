import React, { useState } from "react";

function SkillInput({ onChange }) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `http://localhost:8081/api/skills/suggestions?query=${value}`
        );
        const data = await response.json();
        const filteredSuggestions = data.filter(
          (suggestion) => !selectedSkills.includes(suggestion)
        );
        setSuggestions(filteredSuggestions);
      } catch (error) {
        console.error("Error fetching skill suggestions:", error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (!selectedSkills.includes(suggestion)) {
      setSelectedSkills([...selectedSkills, suggestion]);
      setInputValue("");
      setSuggestions([]);
      if (onChange) {
        onChange([...selectedSkills, suggestion]);
      }
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = selectedSkills.filter(
      (skill) => skill !== skillToRemove
    );
    setSelectedSkills(updatedSkills);
    if (onChange) {
      onChange(updatedSkills);
    }
  };

  return (
    <div>
      <div>
        {selectedSkills.map((skill) => (
          <span
            key={skill}
            style={{
              border: "1px solid #ccc",
              padding: "5px",
              margin: "5px",
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            {skill}
            <button
              style={{ marginLeft: "5px" }}
              onClick={() => handleRemoveSkill(skill)}
            >
              x
            </button>
          </span>
        ))}
      </div>
      <input type="text" value={inputValue} onChange={handleInputChange} />
      {suggestions.length > 0 && (
        <ul>
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SkillInput;
