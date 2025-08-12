import { useState, useEffect } from "react"; 
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useUpdateSkills, useResumeData } from "@/hooks/resumeHooks";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Skeleton } from "../ui/skeleton";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { skillsSchema } from "@/Schema/SkillsSchema";
import { CreatableMultiSelect } from "@/components/ui/CreatableMultiSelect";
import { setSkills } from "@/store/resumeSlice";  
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";

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
  const { resumeId } = useParams<{ resumeId: string }>();
  const { data: resumeData, isLoading } = useResumeData(resumeId ?? "");

  const updateSkills = useUpdateSkills(resumeId ?? "");

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState({ error: "", loading: false });

  useEffect(() => {
    if (resumeData?.skills && resumeData.skills.length) {
      setSelectedSkills(resumeData.skills);
      dispatch(setSkills(resumeData.skills));
    } else {
      setSelectedSkills([]);
      dispatch(setSkills([]));
    }
  }, [resumeData, dispatch]);

    const handleBlur = () => {
  const result = skillsSchema.safeParse({ skills: selectedSkills });
  setFormErrors({
    skills: result.success ? "" : result.error.errors[0]?.message || "",
  });
};

  const handleBack = () => navigate(`/resume/${resumeId}/experience-info`);

  const handleNext = async () => {
    const result = skillsSchema.safeParse({ skills: selectedSkills });

    if (!result.success) {
      const zodErrors = result.error.format();
      const extractedErrors: { [key: string]: string } = {};

      for (const key in zodErrors) {
        const fieldKey = key as keyof typeof zodErrors;

        if (fieldKey !== "_errors" && zodErrors[fieldKey]?._errors?.length) {
          extractedErrors[fieldKey] = zodErrors[fieldKey]!._errors[0];
        }
      }

      setFormErrors(extractedErrors);
      toast.error(
        `Please fill in the required fields`
      );
      return;
    }

    setFormErrors({});
    setStatus({ error: "", loading: true });

    try {
      await updateSkills.mutateAsync({ skills: selectedSkills });
      dispatch(setSkills(selectedSkills));
      toast.success("Skills saved successfully!");
      navigate(`/resume/${resumeId}/project-info`);
    } catch (err) {
      console.error("Failed to save skills:", err);
      toast.error("Failed to save skills, please try again.");
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 pt-25 max-w-6xl mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <h2 className="text-center text-xl font-semibold mb-6">
            Skills<span className="text-red-600">*</span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Select the skills you want to showcase on your resume.
          </p>

          {isLoading ? (
            <Skeleton className="h-6 w-40 mx-auto mb-6" />
          ) : null}

          {status.error && <p className="text-red-600 text-sm mb-4">{status.error}</p>}

          <Label htmlFor="skills">Choose Skills<span className="text-red-600">*</span></Label>
          <div className="mt-3">
           <CreatableMultiSelect
                value={selectedSkills.join(", ")}
                onChange={(val) => {
                  const parsed = val.split(",").map((s) => s.trim()).filter(Boolean);
                  setSelectedSkills(parsed);
                  dispatch(setSkills(parsed));
                  const result = skillsSchema.safeParse({ skills: parsed });
                  setFormErrors({
                    skills: result.success ? "" : result.error.errors[0]?.message || "",
                  });
                }}
                options={availableSkills}
                placeholder="Type or select skills"
                onBlur={() => handleBlur()}
                error={formErrors["skills"]}
              />

          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              {"<- Back"}
            </Button>
            <Button variant="skyblue" onClick={handleNext} disabled={status.loading}>
              {status.loading ? "Saving..." : "Next ->"}
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
