import React, { useState } from "react";
import SkillInput from "./SkillInput";
import Select from "react-select/base";

import "./FindAJob.css"; // Import your CSS file here

function FindAJob() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [minPayRate, setMinPayRate] = useState("");
  const [maxPayRate, setMaxPayRate] = useState("");
  const [skillsFilter, setSkillsFilter] = useState("");
  const [jobs, setJobs] = useState([]);

  const fetchJobs = async () => {
    try {
      const params = new URLSearchParams();

      params.append("generalSearch", searchTerm || ""); // Use "" if searchTerm is empty
      params.append("location", locationFilter || ""); // Use "" if locationFilter is empty
      params.append("category", categoryFilter || ""); // Use "" if categoryFilter is empty
      if (minPayRate) params.append("minPayRate", minPayRate);
      if (maxPayRate) params.append("maxPayRate", maxPayRate);
      if (skillsFilter) {
        skillsFilter
          .map((skill) => skill.trim())
          .filter((skill) => skill !== "")
          .forEach((skill) => {
            params.append("skills", skill);
          });
      } else {
        params.append("skills", "");
      }

      const response = await fetch(
        `http://localhost:8081/api/jobs?${params.toString()}`
      ); //needs changing when deploying to production

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleSkillChange = (value) => {
    console.log("Skill changed to:", value);
    setSkillsFilter(value); // Update the skills filter state};
  };

  return (
    <div>
      <main>
        <div>
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "300px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div>
          <select
            className="filter-dropdown"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="">All Locations</option>
            <option value="London">London</option>
            <option value="New York">New York</option>
            <option value="Remote">Remote</option>
          </select>

          <select
            className="filter-dropdown"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Programming">Programming</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
            <option value="Data Science">Data Science</option>
          </select>

          <input
            type="number"
            placeholder="Min Pay Rate"
            value={minPayRate}
            onChange={(e) => setMinPayRate(e.target.value)}
            style={{ margin: "5px", padding: "10px" }}
          />

          <input
            type="number"
            placeholder="Max Pay Rate"
            value={maxPayRate}
            onChange={(e) => setMaxPayRate(e.target.value)}
            style={{ margin: "5px", padding: "10px" }}
          />

          <SkillInput onChange={handleSkillChange} />
        </div>

        <button className="search-button" onClick={handleSearch}>
          Search Jobs
        </button>

        <div style={{ marginTop: "20px" }}>
          <h2>Job Results</h2>
          <ul>
            {jobs.map((job) => {
              let skillsDisplay = "";

              if (job.skills && job.skills.length > 0) {
                skillsDisplay = job.skills
                  .map((skill) => skill.name)
                  .join(", ");
              } else {
                skillsDisplay = "No skills listed";
              }

              return (
                <li
                  key={job.id}
                  style={{
                    border: "1px solid #eee",
                    padding: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <h3>{job.title}</h3>
                  <p>Location: {job.location}</p>
                  <p>Pay Rate: {job.payRate}</p>
                  <p>Description: {job.description}</p>
                  <p>Skills: {skillsDisplay}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default FindAJob;
