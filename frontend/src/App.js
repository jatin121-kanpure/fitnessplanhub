import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Auth context provider
import { AuthProvider } from "./context/AuthContext";

// Common components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import UserFeed from "./pages/UserFeed";
import TrainerDashboard from "./pages/TrainerDashboard";
import PlanDetails from "./pages/PlanDetails";
import TrainerProfile from "./pages/TrainerProfile";

// Main application component
function App() {
  return (
    <Router>
      {/* AuthProvider gives auth data to entire app */}
      <AuthProvider>
        {/* Navbar visible on all pages */}
        <Navbar />

        {/* Define all application routes */}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected route: Plan Details (public but needs auth for subscribe) */}
          <Route path="/plan/:id" element={<PlanDetails />} />

          {/* Protected route: Trainer Profile (public) */}
          <Route path="/trainer/:id" element={<TrainerProfile />} />

          {/* Protected route: User Feed (login required) */}
          <Route
            path="/feed"
            element={
              <ProtectedRoute>
                <UserFeed />
              </ProtectedRoute>
            }
          />

          {/* Protected route: Trainer Dashboard (login required) */}
          <Route
            path="/trainer-dashboard"
            element={
              <ProtectedRoute>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
