// client/src/config.js (or wherever API_BASE_URL is defined)

// Make sure this is the correct public URL of your Spring Boot backend on Render
const RENDER_BACKEND_URL = "https://side-hustle-dzwu.onrender.com";
const REACT_APP_API_BASE_URL = "https://side-hustle-dzwu.onrender.com";

const API_BASE_URL = RENDER_BACKEND_URL;
// process.env.NODE_ENV === "production"
// ? process.env.REACT_APP_API_BASE_URL // This will be set on Render for your frontend service
// : RENDER_BACKEND_URL; // For local dev, hit the Render backend

export { API_BASE_URL };
