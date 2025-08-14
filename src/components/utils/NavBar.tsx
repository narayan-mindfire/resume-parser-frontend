import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="w-full z-10 px-6 py-4 flex justify-between items-center bg-[var(--background2)] text-[var(--text)] shadow-2xl">
      <Link to={currentUser ? "/upload" : "/"}>
        <div className="text-xl font-bold flex items-center gap-2">
          📃
          <span className="hidden md:block text-[var(--accent)]">
            ResumeParser
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-4 mr-10 md:mr-0">
        <button
          onClick={toggleTheme}
          className="text-lg hover:text-[var(--primary)] transition-colors duration-200"
          aria-label="Toggle Theme"
        >
          <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
        </button>
        {!currentUser ? (
          <>
            <Link
              to="/login"
              className="text-sm font-medium hover:text-[var(--primary)] transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-medium hover:text-[var(--primary)] transition-colors"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/me"
              className="hover:text-[var(--primary)] transition-colors duration-200"
            >
              <div className="text-sm font-medium flex items-center gap-2">
                {currentUser.profileImage ? (
                  <img
                    src={currentUser.profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    className="text-xl text-[var(--accent)]"
                    title={`${currentUser.fname} ${currentUser.lname}`}
                  />
                )}
                <span className="hidden md:block">{currentUser.fname}</span>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm font-medium hover:text-[var(--primary)] transition-colors duration-200"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
