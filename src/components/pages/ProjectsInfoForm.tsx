import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useNavigate } from "react-router-dom";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { projectInfoShema } from "@/lib/ProjectSchema";
import { setProjects } from "@/store/resumeSlice"; 
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";

export type ProjectInfo = {
  projectTitle: string;
  description: string;
  [key: string]: string; 
};

const initialFields = [
  { id: "projectTitle", label: "Project Title", type: "text", required: true },
  { id: "description", label: "Description", type: "textarea", required: true },
];

export default function ProjectInfoForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const projectFromStore = useSelector((state: RootState) => state.resume.currentResume.projects[0]);
  const [formData, setFormData] = useState<ProjectInfo>(
    projectFromStore ?? (Object.fromEntries(initialFields.map((f) => [f.id, ""])) as ProjectInfo)
  );
  const [fields, setFields] = useState(initialFields);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "textarea">("text");

  const handleFieldChange = (id: string, value: string) => {
    const updated = { ...formData, [id]: value };
    setFormData(updated);
    dispatch(setProjects([updated])); 
  };

  const addMoreField = () => {
    if (!newFieldLabel.trim()) return;
    const newId = newFieldLabel.toLowerCase().replace(/\s+/g, "_");
    if (fields.find((f) => f.id === newId)) {
      alert("Field with this name already exists");
      return;
    }
    setFields((prev) => [...prev, { id: newId, label: newFieldLabel, type: newFieldType, required: false }]);
    setFormData((prev) => ({ ...prev, [newId]: "" }));
    setNewFieldLabel("");
  };

  const handleBack = () => {
    navigate("/resume/skills-info");
  };

  const handleNext = () => {
    const result = projectInfoShema.safeParse(formData);

    if (!result.success) {
      console.log(result.error.format());
      alert("Please fill all required fields correctly.");
      return;
    }

    dispatch(setProjects([formData]));

    navigate("/resume/certificate-info");
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 pt-25 max-w-6xl mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <h2 className="text-center text-xl font-semibold mb-6">Projects Done</h2>

          <div className="space-y-6">
            {fields.map(({ id, label, type, required }) => (
              <FormFieldRenderer
                key={id}
                id={id}
                label={label}
                type={type as "text" | "textarea"}
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
              onChange={(e) => setNewFieldType(e.target.value as "text" | "textarea")}
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
