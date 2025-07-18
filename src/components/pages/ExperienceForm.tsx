import { useState } from "react";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useDispatch, useSelector } from "react-redux";
import { setExperience, updateExperience } from "@/store/resumeSlice"; 
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { experienceInfoSchema } from "@/lib/ExperienceInfoSchema";
import { ResumePreview } from "@/components/pages/ResumePreview";

export type ExperienceInfo = {
  workOrInternship: string;
  jobtitle: string;
  companyname: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  [key: string]: string;
};

const initialFields = [
    { id: "workOrInternship", label: "Work/Internship", type: "select", required: true, options: ["Work", "Internship"] },
    { id: "jobtitle", label: "Job Title", type: "text", required: true },
    { id: "companyname", label: "Company Name", type: "text", required: true },
    { id: "location", label: "Location", type: "text", required: true },
    { id: "startDate", label: "Start Date", type: "date", required: true },
    { id: "endDate", label: "End Date", type: "date" },
    { id: "responsibilities", label: "Responsibilities", type: "textarea" },
    ];

export default function ExperienceForm() {

  const experienceFromStore = useSelector((state: RootState) => state.resume.currentResume.experience);

  const [formData, setFormData] = useState<ExperienceInfo>(
    experienceFromStore.length > 0
      ? experienceFromStore[0]
      : Object.fromEntries(initialFields.map((f) => [f.id, ""])) as ExperienceInfo
  );

    const [fields, setFields] = useState(initialFields);
    const [newFieldLabel, setNewFieldLabel] = useState("");
    const [newFieldType, setNewFieldType] = useState<"text" | "textarea">("text");

    const handleFieldChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    dispatch(updateExperience({ [id]: value }));
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

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleBack = () => {
      navigate("/resume/educational-info");
    };

    const handleNext = () => {
        const result = experienceInfoSchema.safeParse(formData);

        if (!result.success) {
      
            console.log(result.error.format());
            alert("Please fill all required fields correctly.");
            return;
        }

        dispatch(setExperience([formData]));
        navigate("/resume/skills-info"); 
    };
    
    return(

    <>
        <Header isLoggedIn={true} />
        <div className="flex gap-10 max-w-6xl mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm">
          <h2 className="text-center text-xl font-semibold mb-6">
            Work/Internship Experience
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
                options={fields.find((f) => f.id === id)?.options || []}
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
         <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 min-h-[50rem]">
          <ResumePreview isCompact />
         </div>
      </div>
    </>

    );

}