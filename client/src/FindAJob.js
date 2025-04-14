import React, { useState, useEffect, use } from "react";
import Select from "react-select";
import MySelect from "./MySelect";
import "./FindAJob.css"; // Import your CSS file for styling

function FindAJob() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [locationOptions, setLocationOptions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [skillFilter, setSkillFilter] = useState("");
  const [skillOptions, setSkillOptions] = useState([]);
  const [minPayRate, setMinPayRate] = useState("");
  const [maxPayRate, setMaxPayRate] = useState("");
  const [jobs, setJobs] = useState([]);
  const [saveParams, setSaveParams] = useState({
    searchTerm: "",
    locationFilter: "",
    categoryFilter: "",
    skillFilter: "",
    minPayRate: "",
    maxPayRate: "",
  });

  useEffect(() => {
    fetchLocations();
    fetchCategories();
    fetchSkills();
  }, []); // Fetch locations on component mount

  const fetchLocations = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/job-filters/locations"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setLocationOptions(data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/job-filters/categories"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCategoryOptions(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  const fetchSkills = async () => {
    try {
      const response = await fetch(
        "http://localhost:8081/api/job-filters/skills"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSkillOptions(data);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const fetchJobs = async () => {
    const locationsValue = locationFilter
      ? locationFilter.map((option) => option.value)
      : [];
    const categoriesValue = categoryFilter
      ? categoryFilter.map((option) => option.value)
      : [];
    const skillsValue = skillFilter
      ? skillFilter.map((option) => option.value)
      : [];

    try {
      const params = new URLSearchParams();
      params.append("generalSearch", searchTerm || "");

      locationsValue.forEach((location) => params.append("location", location));
      categoriesValue.forEach((category) =>
        params.append("category", category)
      );
      skillsValue.forEach((skill) => params.append("skills", skill));

      if (minPayRate) params.append("minPayRate", minPayRate);
      if (maxPayRate) params.append("maxPayRate", maxPayRate);

      setSaveParams(params);
      const response = await fetch(
        `http://localhost:8081/api/jobs?${params.toString()}`
      );
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
    console.log("searchTerm:", searchTerm);
    console.log(
      "locationFilter:",
      locationFilter ? locationFilter.map((option) => option.value) : []
    );
    console.log(
      "categoryFilter:",
      categoryFilter ? categoryFilter.map((option) => option.value) : []
    );
    console.log(
      "skillFilter:",
      skillFilter ? skillFilter.map((option) => option.value) : []
    );
    console.log("minPayRate:", minPayRate);
    console.log("maxPayRate:", maxPayRate);
    fetchJobs();
    console.log("saveParams", saveParams);
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
          />
        </div>

        <div>
          <div>
            <MySelect
              placeholder="Locations"
              options={locationOptions}
              isMulti="true"
              onChange={(selectedOptions) => setLocationFilter(selectedOptions)}
              value={locationFilter}
            />
          </div>
          <div>
            <MySelect
              placeholder="Categories"
              options={categoryOptions}
              isMulti="true"
              onChange={(selectedOptions) => setCategoryFilter(selectedOptions)}
              value={categoryFilter}
            />
          </div>
          <div>
            <MySelect
              placeholder="Skills"
              options={skillOptions}
              isMulti="true"
              onChange={(selectedOptions) => setSkillFilter(selectedOptions)}
              value={skillFilter}
            />
          </div>

          <input
            type="number"
            placeholder="Min Pay Rate"
            value={minPayRate}
            onChange={(e) => setMinPayRate(e.target.value)}
          />

          <input
            type="number"
            placeholder="Max Pay Rate"
            value={maxPayRate}
            onChange={(e) => setMaxPayRate(e.target.value)}
          />
        </div>

        <button onClick={handleSearch}>Search Jobs</button>

        <div style={{ marginTop: "20px" }}>
          <h2>Job Results</h2>
          <ul>
            {jobs.map((job) => (
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
                <p>
                  Skills:{" "}
                  {job.skills
                    ? job.skills.map((skill) => skill.name).join(", ")
                    : "No skills listed"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}

export default FindAJob;
