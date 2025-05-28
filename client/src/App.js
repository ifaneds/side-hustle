// App.js
import React from "react";
import "./css/App.css";
import { Routes, Route } from "react-router-dom";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import Layout from "./Layout";
import Profile from "./Profile";
import MyJobs from "./MyJobs";
import Availability from "./Availability";
import Help from "./Help";
import FindAJob from "./FindAJob";
import JobInformation from "./JobInformation";
import PostAJob from "./PostAJob";
import { AuthProvider } from "./AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="/job/:id" element={<JobInformation />} />
          <Route path="find-job" element={<FindAJob />} />
          <Route path="post-job" element={<PostAJob />} />
          <Route path="profile" element={<Profile />}>
            <Route path="availability" element={<Availability />} />
            <Route path="my-jobs" element={<MyJobs />} />
          </Route>
          <Route path="help" element={<Help />} />
          {/* Add more routes as needed */}
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
