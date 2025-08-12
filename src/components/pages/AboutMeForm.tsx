import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { FormFieldRenderer } from "@/components/InputFields/FormFieldRenderer";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { aboutMeSchema } from "@/Schema/AboutMeSchema";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useResumeData,
  useUpdateAboutMe
} from "@/hooks/resumeHooks";

import type { AboutMe } from "@/components/interfaces/interfaces";
import { useDispatch } from "react-redux";
import { setAboutMe } from "@/store/resumeSlice";

const initialFields = [
  { id: "aboutMe", label: "About Me", type: "textarea", required: true }
];

const initialAboutMeData: AboutMe = {
  aboutMe: ""
};

export default function AboutMeForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const { resumeId } = useParams<{ resumeId: string }>();
  const validResumeId = resumeId ?? "";

  const { data: resumeData, isLoading: isResumeLoading } = useResumeData(validResumeId);
  const updateAboutMe = useUpdateAboutMe(validResumeId);

  const [formData, setFormData] = useState<AboutMe>(initialAboutMeData);

  const [fields] = useState(initialFields);
  const [status, setStatus] = useState({ error: "", loading: false });

  useEffect(() => {
    if (resumeData?.aboutMe) {
      setFormData({ aboutMe: resumeData.aboutMe });
    }
  }, [resumeData]);

const handleFieldChange = useCallback((id: string, value: string) => {
  const updated = { ...formData, [id]: value };
  setFormData(updated);
  dispatch(setAboutMe(updated));

  setFormErrors((prev) => ({ ...prev, [id]: "" }));
}, [formData, dispatch]);

type AboutMeKeys = keyof AboutMe; 

const handleBlur = (fieldId: string) => {
  if (!(fieldId in aboutMeSchema.shape)) return; 
  const key = fieldId as AboutMeKeys;

  const singleFieldSchema = aboutMeSchema.shape[key];
  if (singleFieldSchema) {
    const result = singleFieldSchema.safeParse(formData[key]);
    setFormErrors((prev) => ({
      ...prev,
      [key]: result.success ? "" : result.error.errors[0]?.message || "",
    }));
  }
};



  const handleBack = () => {
    if (resumeId) navigate(`/resume/${resumeId}/personal-info`);
  };

  const handleNext = async () => {
    const result = aboutMeSchema.safeParse(formData);

    if (!result.success) {
      const zodErrors = result.error.format();
      const extractedErrors: { [key: string]: string } = {};

      (Object.keys(zodErrors) as (keyof typeof zodErrors)[]).forEach((key) => {
        if (key !== "_errors" && zodErrors[key]?._errors?.length) {
          extractedErrors[key] = zodErrors[key]._errors[0];
        }
      });

      
        setFormErrors(extractedErrors);
        toast.error(`Please fill in the required fields`);
        return;
    }
    setFormErrors({});

    setStatus({ error: "", loading: true });

    try {
      await updateAboutMe.mutateAsync(formData);
      dispatch(setAboutMe(formData));
      toast.success("About Me saved successfully!");
      navigate(`/resume/${resumeId}/educational-info`);
    } catch (err) {
      console.error("Failed to save About Me", err);
      toast.error("Failed to save. Please try again.");
    } finally {
       setStatus(prev => ({ ...prev, loading: false }));
    }
  };

  if (isResumeLoading) {
    return (
      <>
        <Header isLoggedIn />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-6 w-40 mx-auto mb-4" />
          <Skeleton className="h-24 w-full rounded" />
          <Skeleton className="h-10 w-32 mt-6 mx-auto" />
        </div>

      </>
    );
  }

  return (
    <>
      <Header isLoggedIn />
      <div className="flex gap-10 max-w-6xl pt-25 mx-auto p-6">
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <h2 className="text-center text-xl font-semibold mb-6">
            About Me <span className="text-red-600">*</span>
          </h2>

          {status.error && <p className="text-red-600 text-sm mb-4">{status.error}</p>}

          <div className="flex flex-col gap-6 w-full max-w-xl pl-13">
            {fields.map(({ id, type }) => (
              <FormFieldRenderer
                key={id}
                id={id}
                type={type as "textarea"}
                value={formData[id as keyof AboutMe]}
                onChange={(val) => handleFieldChange(id, val)}
                onBlur={() => handleBlur(id)}
                error={formErrors[id]}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              ← Back
            </Button>
            <Button
              variant="skyblue"
              onClick={handleNext}
              disabled={status.loading || updateAboutMe.isPending}
            >
              {updateAboutMe.isPending ? "Saving..." : "Next →"}
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
