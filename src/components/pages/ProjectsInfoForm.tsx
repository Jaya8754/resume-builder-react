import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { projectInfoShema } from "@/lib/ProjectSchema";
import { setProjects } from "@/store/resumeSlice";
import { Plus, Minus } from "lucide-react";

export type ProjectInfo = {
  projectTitle: string;
  description: string;
};

const initialFields = [
  { id: "projectTitle", label: "Project Title", type: "text", required: true },
  { id: "description", label: "Description", type: "textarea", required: true },
];

const createEmptyProject = (): ProjectInfo => ({
  projectTitle: "",
  description: "",
});

export default function ProjectInfoForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projectFromStore = useSelector(
    (state: RootState) => state.resume.currentResume.projects
  );

  const [projectList, setProjectList] = useState<ProjectInfo[]>(
    projectFromStore.length > 0 ? projectFromStore : [createEmptyProject()]
  );

  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(setProjects(projectList));
  }, [projectList, dispatch]);

  const handleFieldChange = (formIndex: number, fieldId: keyof ProjectInfo, value: string) => {
    const updatedList = projectList.map((item, i) =>
      i === formIndex ? { ...item, [fieldId]: value } : item
    );
    setProjectList(updatedList);
  };

  const addProjectForm = () => {
    setProjectList((prev) => [...prev, createEmptyProject()]);
  };

  const removeProjectForm = (index: number) => {
    if (projectList.length === 1) return;
    setProjectList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    for (const project of projectList) {
      const result = projectInfoShema.safeParse(project);
      if (!result.success) {
        setError("Please fill all required fields correctly.");
        return;
      }
    }
    setError("");
    dispatch(setProjects(projectList));
    navigate("/resume/certificate-info");
  };

  const handleBack = () => navigate("/resume/skills-info");

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 pt-25 max-w-6xl mx-auto p-6">
        {/* Left: Forms */}
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Projects Done</h2>
            <Button variant="ghost" size="icon" onClick={addProjectForm} aria-label="Add project">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {projectList.map((formData, index) => (
            <div key={index} className="mb-6 border rounded p-4 relative">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm">Project {index + 1}</h4>
                {projectList.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeProjectForm(index)}
                    aria-label={`Remove project ${index + 1}`}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {initialFields.map(({ id, label, type, required }) => (
                  <FormFieldRenderer
                    key={`${index}-${id}`}
                    id={id}
                    label={label}
                    type={type as "text" | "textarea"}
                    required={required}
                    value={formData[id as keyof ProjectInfo] || ""}
                    onChange={(val) => handleFieldChange(index, id as keyof ProjectInfo, val)}
                  />
                ))}
              </div>
            </div>
          ))}

          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              {"<- Back"}
            </Button>
            <Button variant="skyblue" onClick={handleNext}>
              {"Next ->"}
            </Button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 min-h-[50rem]">
          <ResumePreview isCompact />
        </div>
      </div>
    </>
  );
}
