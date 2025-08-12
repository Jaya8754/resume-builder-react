import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { setEducation } from "@/store/resumeSlice";
import Header from "@/components/HeaderComponents/Header";
import type { EducationInfo } from "@/components/interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { FormFieldRenderer } from "@/components/InputFields/FormFieldRenderer";
import { educationalInfoSchema } from "@/Schema/EducationalInfoSchema";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { Plus, Minus } from "lucide-react";
import { useUpdateEducation, useResumeData } from "@/hooks/resumeHooks";

const initialEduFields = [
  { id: "degree", label: "Degree", type: "text", required: true },
  { id: "institution", label: "Institution", type: "text", required: true },
  { id: "location", label: "Location", type: "text", required: true },
  { id: "startDate", label: "Start Date", type: "date", required: true },
  { id: "endDate", label: "End Date", type: "date", required: true },
  { id: "description", label: "Description", type: "textarea" },
  { id: "cgpa", label: "CGPA", type: "text", required: true },
];

const createEmptyEducation = (): EducationInfo =>
  initialEduFields.reduce((acc, field) => {
    acc[field.id] = "";
    return acc;
  }, {} as EducationInfo);

export default function EducationForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<{
  [index: number]: Partial<Record<keyof EducationInfo, string | undefined>>;
}>({});

  
  const [status, setStatus] = useState({ error: "", loading: false });

  const { resumeId } = useParams<{ resumeId: string }>();
  const validResumeId = resumeId ?? "";
  const { data: resumeData, isLoading: isResumeLoading } = useResumeData(validResumeId);

  
  const [educationList, setEducationList] = useState<EducationInfo[]>([]);

  useEffect(() => {
  if (resumeData?.educations) {
    setEducationList(resumeData.educations.length ? resumeData.educations : [createEmptyEducation()]);
  }
}, [resumeData]);

  type FormErrors = {
  [index: number]: Partial<Record<keyof EducationInfo, string>>;
};

  const updateEducation = useUpdateEducation(resumeId ?? "");

  const handleFieldChange = (formIndex: number, fieldId: string, value: string) => {
    const updatedList = educationList.map((item, i) =>
      i === formIndex ? { ...item, [fieldId]: value } : item
    );
    setEducationList(updatedList);
    dispatch(setEducation(updatedList));

    setFormErrors((prev) => ({
      ...prev,
      [formIndex]: {
        ...prev[formIndex],
        [fieldId]: undefined,
      },
    }));
  };


  const handleBlur = (index: number, field: keyof EducationInfo) => {
    const edu = educationList[index];
    if (!edu) return;

    const result = educationalInfoSchema.safeParse(edu);

    if (!result.success) {
      const fieldErrors = result.error.formErrors.fieldErrors as Record<string, string[]>;
      const fieldError = fieldErrors[field];

      if (fieldError?.[0]) {
        setFormErrors((prev) => ({
          ...prev,
          [index]: {
            ...prev[index],
            [field]: fieldError[0],
          },
        }));
      }
    } else {
      setFormErrors((prev) => ({
        ...prev,
        [index]: {
          ...prev[index],
          [field]: undefined,
        },
      }));
    }
  };

  const addEducationForm = () => {
    const newList = [...educationList, createEmptyEducation()];
    setEducationList(newList);
    dispatch(setEducation(newList));
  };

const removeEducationForm = (index: number) => {
    if (educationList.length === 1) return;
    const newList = educationList.filter((_, i) => i !== index);
    setEducationList(newList);
    dispatch(setEducation(newList));
  };

  const handleBack = () => {
    if (resumeId) {
      navigate(`/resume/${resumeId}/aboutme`);
    }
  };

  const handleNext = async () => {
    let hasErrors = false;
    const newFormErrors: FormErrors = {};

    educationList.forEach((edu, index) => {
      const result = educationalInfoSchema.safeParse(edu);
      if (!result.success) {
        hasErrors = true;
        const zodErrors = result.error.format();
        const extracted: Partial<Record<keyof EducationInfo, string>> = {};

        for (const [key, value] of Object.entries(zodErrors)) {
          if (key === "_errors") continue;
          if (
            value &&
            typeof value === "object" &&
            "_errors" in value &&
            Array.isArray(value._errors) &&
            value._errors.length > 0
          ) {
            extracted[key as keyof EducationInfo] = value._errors[0];
          }
        }


        newFormErrors[index] = extracted;
      }
    });

    if (hasErrors) {
      setFormErrors(newFormErrors);
      toast.error(`Please fill in the required fields`);
      return;
    }

    // Clear previous errors
    setFormErrors({});
    setStatus({ error: "", loading: true });

    try {
      await updateEducation.mutateAsync({ educations: educationList });
      toast.success("Education info saved successfully!");
      navigate(`/resume/${resumeId}/experience-info`);
    } catch (err) {
      console.error("Error saving education info:", err);
      toast.error("Failed to save education info. Please try again.");
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
            <h2 className="text-center text-xl font-semibold">
              Educational Information<span className="text-red-600">*</span>
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={addEducationForm}
              aria-label="Add education"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {isResumeLoading ? (
            <Skeleton className="h-6 w-40 mx-auto mb-6" />
          ) : null}

          {educationList.map((formData, index) => (
            <div key={index} className="mb-6 border rounded p-4 relative">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm">Education {index + 1}</h4>
                {educationList.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEducationForm(index)}
                    aria-label={`Remove education ${index + 1}`}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {initialEduFields.map(({ id, label, type, required }) => (
                  <FormFieldRenderer
                    key={`${index}-${id}`}
                    id={id}
                    label={label}
                    type={type as "text" | "textarea" | "date"}
                    required={required}
                    value={formData[id] || ""}
                    onChange={(val) => handleFieldChange(index, id, val)}
                    onBlur={() => handleBlur(index, id)}
                    error={formErrors[index]?.[id as keyof EducationInfo]}
                  />
                ))}
              </div>
            </div>
          ))}

          {status.error && <p className="text-red-600 mt-4 text-sm">{status.error}</p>}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              ← Back
            </Button>
            <Button variant="skyblue" onClick={handleNext}>
              Next →
            </Button>
          </div>
        </div>

        <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 min-h-[50rem]">
          <ResumePreview isCompact/>
        </div>
      </div>
    </>
  );
}
