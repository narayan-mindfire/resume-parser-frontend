import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import { Footer } from "./components/utils/Footer";
import Navbar from "./components/utils/NavBar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Unauthenticated from "./pages/Unauthenticated";
import { ProtectedRoute } from "./routeProtection/ProtectedRoute";
import { GuestRoute } from "./routeProtection/GuestRoute";
import ZipUploader from "./components/ZipUploader";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="transition-colors duration-300">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <ZipUploader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/me"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/unauthenticated" element={<Unauthenticated />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
