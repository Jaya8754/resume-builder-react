import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import LandingPage from "@/components/pages/LandingPage";
import ForgotPassword from "@/components/pages/ForgotPassword";

function App() {
  return (
    <Routes>
      {/* Root path shows LandingPage */}
      <Route path="/" element={<LandingPage />} />

      {/* Optional: redirect /landing to / if you want */}
      <Route path="/landing" element={<Navigate to="/" replace />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
