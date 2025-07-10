import { useState } from "react";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import {projectInfoShema} from "@/lib/ProjectSchema";

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
 
    const [formData, setFormData] = useState<ProjectInfo>(
        Object.fromEntries(initialFields.map((f) => [f.id, ""])) as ProjectInfo
    );
  
    const [fields, setFields] = useState(initialFields);
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
      setFields((prev) => [...prev, { id: newId, label: newFieldLabel, type: newFieldType, required: false }]);
      setFormData((prev) => ({ ...prev, [newId]: "" }));
      setNewFieldLabel("");
    };

    const navigate = useNavigate();

    const handleBack = () => {
      navigate("/resume/skills-info");
    };
    
    const handleNext = () => {
        const result = projectInfoShema.safeParse(formData);

        if (!result.success) {
            // Show error to the user (example: alert or setError state)
            console.log(result.error.format());
            alert("Please fill all required fields correctly.");
            return;
        }

        // Navigate to the next section if validation passes
        navigate("/resume/next-section"); // replace with your actual route
    };

    return(
 
        <>
          <Header isLoggedIn={true} />
        <div className="flex gap-10 max-w-6xl mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <h2 className="text-center text-xl font-semibold mb-6">
            Projects Done
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
            <Button variant="skyblue" onClick={handleNext}>{`Next ->`}</Button>
          </div>
        </div>

        {/* Right side: preview */}
        <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800">
          <h2 className="text-center text-xl font-semibold mb-6">Preview</h2>
          <div className="space-y-3">
            {fields.map(({ id, label }) => {
              const val = formData[id];
              if (!val) return null;
              return (
                <div key={id}>
                  <strong>{label}: </strong> <span>{val}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>        
        </>

    );

}