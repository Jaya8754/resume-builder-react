import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "@/components/HeaderComponents/Header";
import type { EducationInfo } from "@/store/resumeSlice";
import { Button } from "@/components/ui/button";
import api from "@/api/api";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { educationalInfoSchema } from "@/lib/EducationalInfoSchema";
import { setEducation } from "@/store/resumeSlice";

import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import type { RootState } from "@/store/store";
import { Plus, Minus } from "lucide-react";

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
  const resumeId = useSelector((state: RootState) => state.resume.currentResume?.id);
  const navigate = useNavigate();

  const educationFromStore = useSelector(
    (state: RootState) => state.resume.currentResume.education
  );

  const [educationList, setEducationList] = useState(
    educationFromStore.length > 0 ? educationFromStore : [createEmptyEducation()]
  );

  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(setEducation(educationList));
  }, [educationList, dispatch]);

  const handleFieldChange = (
    formIndex: number,
    fieldId: string,
    value: string
  ) => {
    const updatedList = educationList.map((item, i) =>
      i === formIndex ? { ...item, [fieldId]: value } : item
    );
    setEducationList(updatedList);
  };

  const addEducationForm = () => {
    setEducationList((prev) => [...prev, createEmptyEducation()]);
  };

  const removeEducationForm = (index: number) => {
    if (educationList.length === 1) return;
    setEducationList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBack = () => navigate("/resume/aboutme");

  const handleNext = async () => {
    for (const edu of educationList) {
      const result = educationalInfoSchema.safeParse(edu);
      if (!result.success) {
        setError("Please fill all required fields correctly.");
        return;
      }
    }

    try {
      if (!resumeId) {
        setError("Resume ID is missing.");
        return;
      }

      await api.put(`/resumes/${resumeId}/educations`, {
        educations: educationList,
      });

      setError("");
      dispatch(setEducation(educationList));
      navigate(`/resume/${resumeId}/experience-info`);
    } catch (err) {
      console.error("Error saving education info:", err);
      setError("Failed to save education info. Please try again.");
    }
  };


  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl pt-25 mx-auto p-6">
        <div className="flex-1 border p-6 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-center text-xl font-semibold">
              Educational Information
              <span className="text-red-600">*</span>
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

          {educationList.map((formData, index) => (
            <div
              key={index}
              className="mb-6 border rounded p-4 relative"
            >
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

        <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 min-h-[50rem]">
          <ResumePreview isCompact />
        </div>
      </div>
    </>
  );
}
