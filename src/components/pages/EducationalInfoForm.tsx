import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "@/components/pages/Header";
import { Button } from "@/components/ui/button";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { educationalInfoSchema } from "@/lib/EducationalInfoSchema";
import { setEducation, updateEducation } from "@/store/resumeSlice";
import { ResumePreview } from "@/components/pages/ResumePreview";
import type { RootState } from "@/store/store";

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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formData = useSelector(
    (state: RootState) => state.resume.currentResume.education[0]
  );

  const [fields, setFields] = useState(initialEduFields);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "textarea">("text");
  const [error, setError] = useState("");

  const handleFieldChange = (id: string, value: string) => {
    dispatch(updateEducation({ index: 0, updates: { [id]: value } }));
  };

  const addMoreField = () => {
    if (!newFieldLabel.trim()) return;

    const newId = newFieldLabel.toLowerCase().replace(/\s+/g, "_");
    if (fields.find((f) => f.id === newId)) {
      alert("Field with this name already exists");
      return;
    }

    setFields((prev) => [
      ...prev,
      { id: newId, label: newFieldLabel, type: newFieldType },
    ]);

    dispatch(updateEducation({ index: 0, updates: { [newId]: "" } }));
    setNewFieldLabel("");
  };

  const handleBack = () => {
    navigate("/resume/aboutme");
  };

  const handleNext = () => {
    const result = educationalInfoSchema.safeParse(formData);
    if (!result.success) {
      console.log(result.error.format());
      setError("Please fill all required fields correctly.");
      return;
    }

    setError("");
    dispatch(setEducation([formData]));
    navigate("/resume/experience-info");
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl mx-auto p-6">
        {/* Form */}
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
                value={formData?.[id] || ""}
                onChange={(val) => handleFieldChange(id, val)}
              />
            ))}
          </div>

          {/* Add More Fields */}
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

        {/* Live Preview */}
        <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 min-h-[50rem]">
          <ResumePreview isCompact />
        </div>
      </div>
    </>
  );
}
