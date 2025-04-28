import { Link, Outlet } from "react-router-dom";
import "./css/Profile.css";

function Profile({ children }) {
  return (
    <main className="profile">
      <nav>
        <Link to="availability">Availability</Link>
        <Link to="my-jobs">My Jobs</Link>
      </nav>
      <div id="content">
        {children}
        <Outlet />
      </div>
    </main>
  );
}
export default Profile;
