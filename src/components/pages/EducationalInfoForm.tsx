import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import { educationalInfoSchema } from "@/lib/EducationalInfoSchema";
import { setEducation } from "@/store/resumeSlice"; // Adjust import path
import type { RootState } from "@/store/store"; // Adjust import path
import { ResumePreview } from "@/components/pages/ResumePreview";

export type EducationInfo = {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  cgpa: string;
  [key: string]: string;
};

const initialEduFields = [
  { id: "degree", label: "Degree", type: "text", required: true },
  { id: "institution", label: "Institution", type: "text", required: true },
  { id: "location", label: "Location", type: "text", required: true },
  { id: "startDate", label: "Start Date", type: "date", required: true },
  { id: "endDate", label: "End Date", type: "date", required: true },
  { id: "description", label: "Description", type: "textarea" },
  { id: "cgpa", label: "CGPA", type: "text", required: true },
];

export default function EducationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const educationFromStore = useSelector((state: RootState) => state.resume.currentResume.education);

  const [formData, setFormData] = useState<EducationInfo>(
    educationFromStore.length > 0
      ? educationFromStore[0]
      : Object.fromEntries(initialEduFields.map((f) => [f.id, ""])) as EducationInfo
  );

  const [fields, setFields] = useState(initialEduFields);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "textarea">("text");

  const handleFieldChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const addMoreField = () => {
    if (!newFieldLabel.trim()) return;
    const newId = newFieldLabel.toLowerCase().replace(/\s+/g, "_");
    if (fields.find((f) => f.id === newId)) {
      alert("Field with this name already exists");
      return;
    }
    setFields((prev) => [...prev, { id: newId, label: newFieldLabel, type: newFieldType }]);
    setFormData((prev) => ({ ...prev, [newId]: "" }));
    setNewFieldLabel("");
  };

  const handleBack = () => {
    navigate("/resume/aboutme");
  };

  const handleNext = () => {
    const result = educationalInfoSchema.safeParse(formData);

    if (!result.success) {
      console.log(result.error.format());
      alert("Please fill all required fields correctly.");
      return;
    }

    dispatch(setEducation([formData]));

    navigate("/resume/experience-info");
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm">
          <h2 className="text-center text-xl font-semibold mb-6">
            Educational Information<span className="text-red-600">*</span>
          </h2>

          <div className="space-y-6">
            {fields.map(({ id, label, type, required }) => (
              <FormFieldRenderer
                key={id}
                id={id}
                label={label}
                type={type as any}
                required={required}
                value={formData[id]}
                onChange={(val) => handleFieldChange(id, val)}
              />
            ))}
          </div>

          {/* Add more fields */}
          <div className="mt-6 flex gap-2 items-center">
            <input
              type="text"
              placeholder="New field label"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              className="border px-2 py-1 rounded flex-grow"
            />
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as any)}
              className="border px-2 py-1 rounded"
            >
              <option value="text">Text</option>
              <option value="textarea">Textarea</option>
            </select>
            <Button onClick={addMoreField} variant="skyblue">
              [+] Add More Fields
            </Button>
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
