import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "./config"; // Import the API base URL from config
const PostAJob = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [location, setLocation] = useState("");
  const [payRate, setPayRate] = useState("");
  const [category, setCategory] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setUserId(userId);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("User ID not found. Please log in.");
      return;
    }

    const jobData = {
      title: jobTitle,
      description: jobDescription,
      location,
      pay_rate: parseFloat(payRate), // Ensure pay rate is a number
      category,
      user_id: Number(userId), // Use the retrieved user ID
    };
    console.log("Job Data:", jobData);
    try {
      const response = await fetch(`${API_BASE_URL}/api/jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error("Failed to post job");
      }

      const result = await response.json();
      console.log("Job posted successfully:", result);
      setSuccess("Job posted successfully!");
      // Reset form fields
      setJobTitle("");
      setJobDescription("");
      setLocation("");
      setPayRate("");
      setCategory("");
    } catch (error) {
      console.error("Error posting job:", error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Post a Job</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Job Description:</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Pay Rate:</label>
          <input
            type="number"
            value={payRate}
            onChange={(e) => setPayRate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <button type="submit">Create New Job</button>
      </form>
    </div>
  );
};

export default PostAJob;
