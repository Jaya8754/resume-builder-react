import { useState, useEffect } from "react";
import { FormFieldRenderer } from "@/components/InputFields/FormFieldRenderer";
import { Button } from "@/components/ui/button";
import { useUpdateExperience, useResumeData } from "@/hooks/resumeHooks";
import Header from "@/components/HeaderComponents/Header";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { setExperience } from "@/store/resumeSlice"; 
import { useNavigate, useParams } from "react-router-dom";
import { experienceInfoSchema } from "@/Schema/ExperienceInfoSchema";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { Plus, Minus } from "lucide-react";
import type { ExperienceInfo } from "@/components/interfaces/interfaces";

const initialFields = [
  { id: "experienceType", label: "Work/Internship", type: "select", required: true, options: ["--Select--", "Work", "Internship"] },
  { id: "jobTitle", label: "Job Title", type: "text", required: true },
  { id: "companyName", label: "Company Name", type: "text", required: true },
  { id: "location", label: "Location", type: "text", required: true },
  { id: "startDate", label: "Start Date", type: "date", required: true },
  { id: "endDate", label: "End Date", type: "date" },
  { id: "responsibilities", label: "Responsibilities", type: "textarea", required: true },
];

const createEmptyExperience = () =>
  Object.fromEntries(initialFields.map((f) => [f.id, ""])) as ExperienceInfo;

export default function ExperienceForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState<{
  [index: number]: Partial<Record<keyof ExperienceInfo, string | undefined>>;
  }>({});

  const [status, setStatus] = useState({ error: "", loading: false });
  
  const { resumeId } = useParams<{ resumeId: string }>();
  const { data: resumeData, isLoading  } = useResumeData(resumeId ?? "");


  const updateExperience = useUpdateExperience(resumeId ?? "");

  const [experienceList, setExperienceList] = useState<ExperienceInfo[]>([]);

  useEffect(() => {
  if (resumeData?.experiences?.length) {
    setExperienceList(resumeData.experiences);
  } else {
    setExperienceList([createEmptyExperience()]);
  }
}, [resumeData]);

  const handleFieldChange = (index: number, id: string, value: string) => {
    const updatedList = experienceList.map((item, i) =>
      i === index ? { ...item, [id]: value } : item
    );
    setExperienceList(updatedList);
    dispatch(setExperience(updatedList));

    if (id === "experienceType" && value === "--Select--") {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [index]: {},
      }));
    }
  };


  const handleBlur = (index: number, fieldId: keyof ExperienceInfo, value: string) => {
    const currentExperience = experienceList[index];
    const updatedExperience = { ...currentExperience, [fieldId]: value };

    const result = experienceInfoSchema.safeParse(updatedExperience);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors as Record<keyof ExperienceInfo, string[] | undefined>;
      const fieldError = fieldErrors[fieldId]?.[0];

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [index]: {
          ...prevErrors?.[index],
          [fieldId]: fieldError,
        },
      }));
    } else {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [index]: {
          ...prevErrors?.[index],
          [fieldId]: undefined,
        },
      }));
    }
  };


  const addExperienceForm = () => {
    const newList = [...experienceList, createEmptyExperience()];
    setExperienceList(newList);
    dispatch(setExperience(newList));
  };

  const removeExperienceForm = (index: number) => {
    if (experienceList.length === 1) return;
      const newList = experienceList.filter((_, i) => i !== index);
      setExperienceList(newList);
      dispatch(setExperience(newList));
  };

  const handleBack = () => {
    navigate(`/resume/${resumeId}/educational-info`);
  };

  const handleNext = async () => {
  let hasErrors = false;
  const newFormErrors: typeof formErrors = {};

  const validExperiences = experienceList.filter(
    (exp) => exp.experienceType === "Work" || exp.experienceType === "Internship"
  );

  if (validExperiences.length === 0) {

    try {
      await updateExperience.mutateAsync([]);
      dispatch(setExperience([]));
      navigate(`/resume/${resumeId}/skills-info`);
      toast.success("Experience section skipped.");
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong while skipping experience.");
    }
    return;
  }

  experienceList.forEach((exp, index) => {
    const result = experienceInfoSchema.safeParse(exp);
    if (!result.success) {
      hasErrors = true;
      const zodErrors = result.error.format();
      const extracted: Partial<Record<keyof ExperienceInfo, string>> = {};

      for (const [fieldKey, fieldError] of Object.entries(zodErrors)) {
        if (fieldKey !== "_errors" && fieldError && "_errors" in fieldError && fieldError._errors.length) {
          extracted[fieldKey as keyof ExperienceInfo] = fieldError._errors[0];
        }
      }

      newFormErrors[index] = extracted;
    }

  });

  if (hasErrors) {
    setFormErrors(newFormErrors);
    toast.error("Please fill in the required fields");
    return;
  }

  setFormErrors({});
  setStatus({ error: "", loading: true });

  try {
    await updateExperience.mutateAsync(validExperiences);
    dispatch(setExperience(validExperiences));
    navigate(`/resume/${resumeId}/skills-info`);
    toast.success("Experience saved.");
  } catch (error) {
    console.log(error)
    toast.error("Failed to save experience.");
  } finally {
    setStatus((prev) => ({ ...prev, loading: false }));
  }
};



  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl pt-25 mx-auto p-6">
        <div className="flex-1 border p-6 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Work/Internship Experience</h2>
            <Button variant="ghost" size="icon" onClick={addExperienceForm} aria-label="Add experience">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {isLoading ? (
            <Skeleton className="h-6 w-40 mx-auto mb-6" />
          ) : null}

          {experienceList.map((formData, index) => (
            <div key={index} className="mb-6 border rounded p-4 relative">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm">Experience {index + 1}</h4>
                {experienceList.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperienceForm(index)}
                    aria-label={`Remove experience ${index + 1}`}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
              {initialFields.map(({ id, label, type, required, options }) => (
                <div key={`${index}-${id}`}>
                  {id === "experienceType" && (
                    <p className="text-xs text-gray-500 mb-1">
                      If you don’t have any work or internship experience, select <strong>--Select--</strong> to skip this section.
                    </p>
                  )}

                  <FormFieldRenderer
                    id={id}
                    label={label}
                    type={type as "text" | "textarea" | "select" | "date"}
                    required={required}
                    value={formData[id]}
                    onChange={(val) => handleFieldChange(index, id, val)}
                    options={options || []}
                    onBlur={() => {
                      if (index < experienceList.length) {
                        handleBlur(index, id as keyof ExperienceInfo, formData[id]);
                      }
                    }}
                    error={formErrors[index]?.[id as keyof ExperienceInfo]}
                  />
                </div>
              ))}

              </div>
            </div>
          ))}

          {status.error && <p className="text-red-600 mt-4 text-sm">{status.error}</p>}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              {"<- Back"}
            </Button>
            <Button variant="skyblue" onClick={handleNext} disabled={status.loading}>
              {status.loading ? "Saving..." : "Next →"}
            </Button>
          </div>
        </div>

        <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 min-h-[50rem]">
          <ResumePreview isCompact />
        </div>
      </div>
    </>
  );
}
