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
import BatchUploads from "./pages/BatchUploads";
import SidebarLayout from "./components/generic/SideBar";
import UploadsPage from "./pages/UploadsPage";
import BatchInsightsPage from "./pages/Insights";
import JobMatchingResultPage from "./pages/JobMatchingResult";
import JobMatchingPage from "./pages/JobMatching";

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
          <Route path="/unauthenticated" element={<Unauthenticated />} />
          <Route path="*" element={<NotFound />} />
          <Route
            element={
              <ProtectedRoute>
                <SidebarLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/upload" element={<ZipUploader />} />
            <Route path="/analytics" element={<div>Analytics Page</div>} />
            <Route path="/uploads/:batchId" element={<BatchUploads />} />
            <Route path="/match/:batchId" element={<JobMatchingPage />} />
            <Route
              path="/match/:batchId/job/:jobId"
              element={<JobMatchingResultPage />}
            />
            <Route path="/uploads" element={<UploadsPage />} />
            <Route path="/me" element={<Profile />} />
            <Route path="/insights/:batchId" element={<BatchInsightsPage />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
