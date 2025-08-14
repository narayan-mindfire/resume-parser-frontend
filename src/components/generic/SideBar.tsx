import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faUpload,
  faChartBar,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

export default function SidebarLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-[84.4vh] bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden absolute top-4 right-4 z-50 p-2 rounded text-white"
      >
        <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} size="lg" />
      </button>
      <aside
        className={`fixed md:static top-0 right-0 h-full md:h-auto w-64 flex flex-col justify-between
   bg-[var(--background2)] text-[var(--text)] transition-transform duration-300 z-40
  ${sidebarOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}`}
      >
        <div>
          <div className="p-4 font-bold md:hidden text-lg text-[var(--accent)]">
            ResumeParser
          </div>
          <nav className="flex flex-col space-y-2 px-4">
            <Link
              to="/upload"
              className="flex items-center gap-2 p-2 rounded hover:bg-[var(--accent)] hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FontAwesomeIcon icon={faUpload} /> Upload Resumes
            </Link>
            <Link
              to="/uploads"
              className="flex items-center gap-2 p-2 rounded hover:bg-[var(--accent)] hover:text-white transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <FontAwesomeIcon icon={faChartBar} /> Your Uploads
            </Link>
          </nav>
        </div>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full p-2 rounded bg-[var(--primary)] text-white hover:brightness-110 transition"
          >
            <FontAwesomeIcon icon={faSignOutAlt} /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-[var(--background)] p-4 transition-colors duration-300 md:ml-0">
        <Outlet />
      </main>
    </div>
  );
}
