import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import type { PersonalInfo } from "@/components/interfaces/interfaces";
import { FormFieldRenderer } from "@/components/InputFields/FormFieldRenderer";
import { personalInfoSchema } from "@/Schema/personalInfoSchema";
import { useDispatch } from "react-redux";
import { setPersonalInfo } from "@/store/resumeSlice";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import {
  useResumeData,
  useUpdatePersonalInfo,
  useCreateResume,
} from "@/hooks/resumeHooks";
import { Skeleton } from "@/components/ui/skeleton";

const initialFields = [
  { id: "fullName", label: "Full Name", type: "text", required: true, isCustom: false },
  { id: "jobTitle", label: "Job Title", type: "text", isCustom: false },
  { id: "email", label: "Email", type: "email", required: true, isCustom: false },
  { id: "phoneNumber", label: "Phone Number", type: "text", required: true, isCustom: false },
  { id: "location", label: "Location", type: "text", required: true, isCustom: false },
  { id: "linkedinProfile", label: "LinkedIn Profile", type: "text", isCustom: false },
  { id: "portfolio", label: "Portfolio/GitHub", type: "text", isCustom: false },
  { id: "profilePicture", label: "Profile Picture URL", type: "file", isCustom: false },
];

const initialValues = initialFields.reduce((acc: { [key: string]: string }, curr) => {
  acc[curr.id] = '';
  return acc;
}, {}) as PersonalInfo;

function sanitizePersonalInfo(data: Partial<PersonalInfo>): PersonalInfo {
  const dummyValues: Record<string, string[]> = {
    fullName: ["New user", "Untitled", "New User"],
    jobTitle: ["Job Title"],
    email: ["abc@gmail.com", "example@example.com"],
    phoneNumber: ["0000000000"],
    location: ["Unknown"],
  };

  const sanitized: PersonalInfo = { ...initialValues };

  for (const key in sanitized) {
    const value = data[key as keyof PersonalInfo];
    if (typeof value === "string") {
      sanitized[key as keyof PersonalInfo] = dummyValues[key]?.includes(value) ? "" : value;
    } else {
      sanitized[key as keyof PersonalInfo] = value || "";
    }
  }

  return sanitized;
}

export default function 
PersonalInfoForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const { resumeId } = useParams<{ resumeId: string }>();
  const validResumeId = resumeId ?? "";
  const { data: resumeData, isLoading: isResumeLoading } = useResumeData(validResumeId);
  const pInfo = useUpdatePersonalInfo(validResumeId);
  const createResume = useCreateResume();

  const [formData, setFormData] = useState<PersonalInfo>(initialValues);
  const [fields, setFields] = useState(initialFields);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "email" | "textarea">("text");
  const [status, setStatus] = useState({ error: "", loading: false });

  useEffect(() => {
    if (resumeData) {
      const personalInfo = sanitizePersonalInfo(resumeData);
      setFormData(personalInfo);
      dispatch(setPersonalInfo(personalInfo));
    } else {
      setFormData(initialValues);
      setFormErrors({});
    }
  }, [resumeData, dispatch]);

  const handleFieldChange = (fieldId: string, value: string) => {
    const updated = { ...formData, [fieldId]: value };
    setFormData(updated);
    dispatch(setPersonalInfo(updated));

    setFormErrors((prev) => ({ ...prev, [fieldId]: "" }));
  };


  const handleBlur = (fieldId: string) => {
    if (!(fieldId in personalInfoSchema.shape)) return;
    const key = fieldId as keyof PersonalInfo;

    const result = personalInfoSchema.shape[key].safeParse(formData[key]);
    setFormErrors((prev) => ({
      ...prev,
      [key]: result.success ? "" : result.error.errors[0]?.message || "",
    }));
  };


  const addMoreField = () => {
    if (!newFieldLabel.trim()) return;
    const newId = newFieldLabel.toLowerCase().replace(/\s+/g, "_");
    if (fields.some((f) => f.id === newId)) {
      toast.error("Field already exists");
      return;
    }
    const newField = { id: newId, label: newFieldLabel, type: newFieldType, isCustom: true };
    setFields((prev) => [...prev, newField]);
    setFormData((prev) => ({ ...prev, [newId]: "" }));
    setNewFieldLabel("");
  };

  const handleDeleteField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    setFormData((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const handleNext = async () => {
  const result = personalInfoSchema.safeParse(formData);

  if (!result.success) {
    const zodErrors = result.error.format();
    const extractedErrors: { [key: string]: string } = {};
    const newTouchedFields: { [key: string]: boolean } = {};

    (Object.keys(zodErrors) as (keyof typeof zodErrors)[]).forEach((key) => {
      if (key !== "_errors" && zodErrors[key]?._errors?.length) {
        extractedErrors[key] = zodErrors[key]._errors[0];
        newTouchedFields[key] = true; 
      }
    });

    setFormErrors(extractedErrors);

    toast.error(`Please fill in the required fields`);
    return;
  }

    setFormErrors({});
    setStatus({ error: "", loading: true });

    try {
      if (validResumeId) {
        await pInfo.mutateAsync(formData);
        toast.success("Personal info updated!");
        navigate(`/resume/${validResumeId}/aboutme`);
      } else {
        const initialResumeData = {
            fullName: "New User",
            jobTitle: "Job Title",
            email: "example@example.com",
            phoneNumber: "0000000000",
            location: "Unknown",

        };
        const response = await createResume.mutateAsync(initialResumeData);
        const newId = response?.data?.resume?.id;
        if (newId) {
          toast.success("Resume created!");
          navigate(`/resume/${newId}/personalinfo`);
        }
      }
    } catch (err) {
      console.error("Error saving personal info", err);
      toast.error("Failed to save. Please try again.");
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <>
      <Header isLoggedIn />
      <div className="flex gap-10 max-w-6xl pt-25 mx-auto p-6">
        <div className="flex-1 border p-6 rounded-md shadow-sm">
          <h2 className="text-center text-xl font-semibold mb-8">
            Personal Information <span className="text-red-600">*</span>
          </h2>

          {isResumeLoading && <Skeleton className="h-6 w-40 mx-auto mb-6" />}

          <div className="flex flex-col gap-6">
            {fields.map(({ id, label, type, required, isCustom }) => (
              <div key={id} className="relative mb-6">
                <FormFieldRenderer
                  id={id}
                  label={label}
                  type={type as "text" | "email" | "file" | "textarea"}
                  required={required}
                  value={formData[id]}
                  onChange={(val) => handleFieldChange(id, val)}
                  onBlur={() => handleBlur(id)}
                  error={formErrors[id]}
                />
                {isCustom && (
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteField(id)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                    title="Remove field"
                  >
                    ✕
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex gap-2 items-center">
            <input
              type="text"
              placeholder="New field label"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              className="border px-2 py-2 rounded flex-grow"
            />
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as "text" | "email" | "textarea")}
              className="border px-2 py-2 rounded"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="textarea">Textarea</option>
            </select>
            <Button onClick={addMoreField} variant="skyblue">
              Add Field
            </Button>
          </div>

          {status.error && <p className="text-red-600 mt-4 text-sm">{status.error}</p>}

          <div className="mt-10 flex justify-between">
            <Button disabled variant="skyblue">← Back</Button>
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
