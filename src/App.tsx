import { Routes, Route, Navigate } from "react-router-dom";
import Login from "@/components/pages/Login";
import { Toaster } from "sonner";
import Signup from "@/components/pages/Signup";
import LandingPage from "@/components/pages/LandingPage";
import ForgotPassword from "@/components/pages/ForgotPassword";
import Dashboard from "@/components/pages/Dashboard";
import { ScrollToTop } from "@/components/scroll/Scroll-to-top";
import PersonalInfoForm from "@/components/pages/PersonalInfoForm";
import EducationalInfoForm from "@/components/pages/EducationalInfoForm";
import ExperienceForm from "@/components/pages/ExperienceForm";
import AboutMe from "@/components/pages/AboutMeForm";
import SkillsForm from "@/components/pages/SkillsInfoForm";
import ProjectInfoForm from "@/components/pages/ProjectsInfoForm";
import CertificateForm from "@/components/pages/CertificationForm";
import InterestForm from "@/components/pages/InterestForm";
import LanguageForm from "@/components/pages/LanguagesForm";
import FinalResume from "@/components/pages/FinalResume";

function App() {
  return (
    <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Routes with resumeId as URL param */}
      <Route path="/resume/:resumeId/personal-info" element={<PersonalInfoForm />} />
      <Route path="/resume/:resumeId/aboutme" element={<AboutMe />} />
      <Route path="/resume/:resumeId/educational-info" element={<EducationalInfoForm />} />
      <Route path="/resume/:resumeId/experience-info" element={<ExperienceForm />} />
      <Route path="/resume/:resumeId/skills-info" element={<SkillsForm />} />
      <Route path="/resume/:resumeId/project-info" element={<ProjectInfoForm />} />
      <Route path="/resume/:resumeId/certificate-info" element={<CertificateForm />} />
      <Route path="/resume/:resumeId/interest-info" element={<InterestForm />} />
      <Route path="/resume/:resumeId/languages-info" element={<LanguageForm />} />
      <Route path="/resume/:resumeId/finalresume" element={<FinalResume />} />
    </Routes>
    <Toaster richColors />
    </>
  );
}

export default App;
