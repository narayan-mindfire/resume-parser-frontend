import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function SidebarLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-[84vh] bg-[var(--background)] text-[var(--text)] transition-colors duration-300">
      <aside className="w-64 flex flex-col justify-between bg-[var(--background2)] text-[var(--text)]">
        <div>
          <div className="p-4 font-bold text-lg text-[var(--accent)]">
            My App
          </div>
          <nav className="flex flex-col space-y-2 px-4">
            <Link
              to="/upload"
              className="p-2 rounded hover:bg-[var(--accent)] hover:text-white transition-colors"
            >
              Upload
            </Link>
            <Link
              to="/analytics"
              className="p-2 rounded hover:bg-[var(--accent)] hover:text-white transition-colors"
            >
              Analytics
            </Link>
            <Link
              to="/matcher"
              className="p-2 rounded hover:bg-[var(--accent)] hover:text-white transition-colors"
            >
              Matcher
            </Link>
          </nav>
        </div>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full p-2 rounded bg-[var(--primary)] text-white hover:brightness-110 transition"
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-[var(--background)] p-6 transition-colors duration-300">
        <Outlet />
      </main>
    </div>
  );
}
