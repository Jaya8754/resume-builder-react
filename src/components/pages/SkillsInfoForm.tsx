import { useState } from "react"; 
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Label } from "@/components/ui/label";
import { skillsSchema } from "@/lib/SkillsSchema";
import { CreatableMultiSelect } from "@/components/ui/CreatableMultiSelect";
import { setSkills } from "@/store/resumeSlice";  // <-- import action here
import { ResumePreview } from "@/components/pages/ResumePreview";

const availableSkills = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular",
  "Tailwind CSS", "Bootstrap", "SASS", "Styled Components",
  "Node.js", "Express.js", "NestJS",
  "MongoDB", "MySQL", "PostgreSQL", "Firebase", "Supabase",
  "Redux", "Zustand", "React Query",
  "GraphQL", "REST API",
  "Git", "GitHub", "GitLab",
  "Webpack", "Vite", "Babel", "ESLint", "Prettier",
  "Jest", "React Testing Library", "Cypress", "Playwright",
  "Figma", "Adobe XD", "Sketch", "Framer", "Canva",
  "Docker", "CI/CD", "Vercel", "Netlify", "Heroku",
  "Python", "Django", "Flask",
  "Java", "Spring Boot", "Kotlin",
  "C++", "C#", ".NET"
];

export default function SkillsForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const skillsFromStore = useSelector((state: RootState) => state.resume.skills);
  const [selectedSkills, setSelectedSkills] = useState<string[]>(skillsFromStore || []);

  const handleBack = () => navigate("/resume/experience-info");

  const handleNext = () => {
    const result = skillsSchema.safeParse({ skills: selectedSkills });
    if (!result.success) {
      console.log(result.error.format());
      alert("Please fill all required fields correctly.");
      return;
    }

    dispatch(setSkills(selectedSkills)); // dispatch here

    navigate("/resume/project-info");
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <h2 className="text-center text-xl font-semibold mb-6">
            Skills<span className="text-red-600">*</span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Select the skills you want to showcase on your resume.
          </p>

          <Label htmlFor="skills">Choose Skills<span className="text-red-600">*</span></Label>
          <div className="mt-3">
            <CreatableMultiSelect
              value={selectedSkills.join(", ")}
              onChange={(val) => setSelectedSkills(val.split(",").map(s => s.trim()).filter(Boolean))}
              options={availableSkills}
              placeholder="Type or select skills"
            />
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              {"<- Back"}
            </Button>
            <Button variant="skyblue" onClick={handleNext}>
              {"Next ->"}
            </Button>
          </div>
        </div>

        {/* Right side: preview */}
         <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 min-h-[50rem]">
          <ResumePreview isCompact />
         </div>
      </div>
    </>
  );
}
