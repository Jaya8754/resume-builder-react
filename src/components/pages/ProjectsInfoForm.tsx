import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { useUpdateProjects, useResumeData } from '@/hooks/resumeHooks';
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { FormFieldRenderer } from "@/components/InputFields/FormFieldRenderer";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { projectInfoShema, baseProjectSchema } from "@/Schema/ProjectSchema";
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

  const { resumeId } = useParams<{ resumeId: string }>();

  const { data: resumeData, isLoading } = useResumeData(resumeId ?? "");

  const updateProjects = useUpdateProjects(resumeId ?? "");

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState({ error: "", loading: false });


  const [projectList, setProjectList] = useState<ProjectInfo[]>([createEmptyProject()]);


  useEffect(() => {
    if (resumeData?.projects && resumeData.projects.length > 0) {
      setProjectList(resumeData.projects);
      dispatch(setProjects(resumeData.projects));
    } else {
      setProjectList([createEmptyProject()]);
      dispatch(setProjects([createEmptyProject()]));
    }
  }, [resumeData, dispatch]);

  const handleFieldChange = (
  index: number,
  fieldId: keyof ProjectInfo,
  value: string
) => {
  const updatedProjects = [...projectList];
  updatedProjects[index] = {
    ...updatedProjects[index],
    [fieldId]: value,
  };

  setProjectList(updatedProjects);
  dispatch(setProjects(updatedProjects)); 
};

  const isProjectEmpty = (project: ProjectInfo) =>
  !project.projectTitle.trim() && !project.description.trim();


  const handleBlur = (index: number, fieldId: keyof ProjectInfo) => {
    const project = projectList[index];
    const isEmpty = isProjectEmpty(project);

    if (isEmpty) {
      setFormErrors((prev) => {
        const updated = { ...prev };
        delete updated[`projectTitle-${index}`];
        delete updated[`description-${index}`];
        return updated;
      });
      return;
    }

    const singleFieldSchema = baseProjectSchema.shape[fieldId];

    if (singleFieldSchema) {
      const result = singleFieldSchema.safeParse(project[fieldId]);
      setFormErrors((prev) => ({
        ...prev,
        [`${fieldId}-${index}`]: result.success ? "" : result.error.errors[0]?.message || "",
      }));
    }
  };


  const addProjectForm = () => {
    setProjectList((prev) => [...prev, createEmptyProject()]);
  };

  const removeProjectForm = (index: number) => {
    if (projectList.length === 1) return;
    setProjectList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNext = async () => {

  const filteredProjects = projectList.filter((p) => !isProjectEmpty(p));

  if (filteredProjects.length === 0) {
    toast.success("Projects skipped successfully!");
    navigate(`/resume/${resumeId}/certificate-info`);
    return; 
  }

  for (let i = 0; i < filteredProjects.length; i++) {
    const project = filteredProjects[i];
    const result = projectInfoShema.safeParse(project);

    if (!result.success) {
      const zodErrors = result.error.format();
      const extractedErrors: { [key: string]: string } = {};

      for (const key in zodErrors) {
        const fieldKey = key as keyof typeof zodErrors;
        if (fieldKey !== "_errors" && zodErrors[fieldKey]?._errors?.length) {
          extractedErrors[`${fieldKey}-${i}`] = zodErrors[fieldKey]!._errors[0];
        }
      }

      setFormErrors(extractedErrors);
      toast.error(`Please fill in the required fields`);
      return;
    }
  }

  setFormErrors({});
  setStatus({ error: "", loading: true });

  try {
    if (!resumeId) throw new Error("Missing resume ID");

    await updateProjects.mutateAsync({ projects: filteredProjects });
    dispatch(setProjects(filteredProjects));
    toast.success("Projects saved successfully!");
    navigate(`/resume/${resumeId}/certificate-info`);
  } catch (err) {
    console.error("Failed to save projects:", err);
    toast.error("Failed to save projects, please try again.");
  } finally {
    setStatus(prev => ({ ...prev, loading: false }));
  }
};
  const handleBack = () => navigate(`/resume/${resumeId}/skills-info`);

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

          {isLoading ? (
            <Skeleton className="h-6 w-40 mx-auto mb-6" />
          ) : null}

          <p className="text-sm text-gray-600 mb-4">
            You may skip this section by leaving all fields empty. Only filled projects will be saved.
          </p>


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
                    error={formErrors[`${id}-${index}`]}
                    onBlur={() => handleBlur(index, id as keyof ProjectInfo)}
                  />
                ))}
              </div>
            </div>
          ))}

          {status.error && <p className="text-red-600 text-sm mt-2">{status.error}</p>}

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
