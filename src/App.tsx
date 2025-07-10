import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/pages/Login";
import Signup from "@/components/pages/Signup";
import LandingPage from "@/components/pages/LandingPage";
import ForgotPassword from "@/components/pages/ForgotPassword";
import Dashboard from "@/components/pages/Dashboard";
import PersonalInfoForm from "@/components/pages/PersonalInfoForm";
import EducationalInfoForm from "@/components/pages/EducationalInfoForm";
import ExperienceForm from "@/components/pages/ExperienceForm";
import AboutMe from "@/components/pages/AboutMeForm";
import SkillsForm from "./components/pages/SkillsInfoForm";
import ProjectInfoForm from "./components/pages/ProjectsInfoForm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/resume/personal-info" element={<PersonalInfoForm />} />
      <Route path="/resume/aboutme" element={<AboutMe />} />
      <Route path="/resume/educational-info" element={<EducationalInfoForm />} />
      <Route path="/resume/experience-info" element={<ExperienceForm />} />
      <Route path="/resume/skills-info" element={<SkillsForm />} />
      <Route path="/resume/project-info" element={<ProjectInfoForm />} />
    </Routes>
  );
}

export default App;
