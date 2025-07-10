import { useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { skillsSchema } from "@/lib/SkillsSchema";
// import { Input } from "@/components/ui/input";

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
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [dropdownValue, setDropdownValue] = useState("");
  const navigate = useNavigate();

  const handleSelectSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
    }
    setDropdownValue("");
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleBack = () => navigate("/resume/experience-info");
  
    const handleNext = () => {
        const result = skillsSchema.safeParse({ skills: selectedSkills });

        if (!result.success) {
            // Show error to the user (example: alert or setError state)
            console.log(result.error.format());
            alert("Please fill all required fields correctly.");
            return;
        }

        // Navigate to the next section if validation passes
        navigate("/resume/project-info"); // replace with your actual route
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
                Select the skills you want to showcase on your resume.</p>
          <Label htmlFor="skills">Choose Skills<span className="text-red-600">*</span></Label>
          <select
            id="skills"
            value={dropdownValue}
            onChange={(e) => handleSelectSkill(e.target.value)}
            className="border rounded px-3 py-2 mb-4 w-full mt-5 dark:bg-gray-900"
          >
            <option value="">-- Select a skill --</option>
            {availableSkills.map(skill => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-2 mb-6">
            {selectedSkills.map(skill => (
              <div
                key={skill}
                className="bg-sky-100 text-sky-700 dark:bg-sky-800 dark:text-sky-100 px-3 py-1 rounded-full flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
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
          <h2 className="text-center text-xl font-semibold mb-6">Preview</h2>
          <ul className="list-disc pl-5 space-y-1 text-gray-800 dark:text-gray-100">
            {selectedSkills.map(skill => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
