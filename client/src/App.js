// App.js
import React from "react";
import { Routes, Route } from "react-router";
import SignInPage from "./SignInPage";
import SignUpPage from "./SignUpPage";
import Layout from "./Layout";

function App() {
  return (
    <>
      <Routes>
        <Route index element={<Layout />} />
        <Route path="/" element={<Layout />}>
          <Route path="signin" element={<SignInPage />} />
          <Route path="signup" element={<SignUpPage />} />
          <Route path="find-job" element={<div>Find a Job</div>} />
          <Route path="post-job" element={<div>Post a Job</div>} />
          <Route path="profile" element={<div>Profile</div>} />
          <Route path="settings" element={<div>Settings</div>} />
        </Route>
        {console.log("Routes rendered")}
      </Routes>
    </>
  );
}

export default App;
