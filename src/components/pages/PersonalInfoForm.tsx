import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store"; 
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { personalInfoSchema } from "@/lib/personalInfoSchema";
import { setPersonalInfo,updatePersonalInfo } from "@/store/resumeSlice"; 
import { ResumePreview } from "@/components/pages/ResumePreview";

type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  location: string;
  linkedinProfile: string;
  portfolio: string;
  [key: string]: string;
};

const initialFields = [
  { id: "fullName", label: "Full Name", type: "text", required: true },
  { id: "jobTitle", label: "Job Title", type: "text" },
  { id: "email", label: "Email", type: "email", required: true },
  { id: "phoneNumber", label: "Phone Number", type: "text", required: true },
  { id: "location", label: "Location", type: "text", required: true },
  { id: "linkedinProfile", label: "LinkedIn Profile", type: "text" },
  { id: "portfolio", label: "Portfolio/GitHub", type: "text" },
];

export default function PersonalInfoForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

const personalInfoFromStore = useSelector((state: RootState) => state.resume.currentResume.personalInfo);

const [formData, setFormData] = useState<PersonalInfo>(() => ({
  ...Object.fromEntries(initialFields.map(f => [f.id, ""])),
  ...personalInfoFromStore,
}));
  const [fields, setFields] = useState(initialFields);
  const [customFieldIds, setCustomFieldIds] = useState<string[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "email" | "textarea">("text");
  const [error, setError] = useState("");
  
  const handleFieldChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
    dispatch(updatePersonalInfo({ [id]: value }));
  };

  const addMoreField = () => {
    if (!newFieldLabel.trim()) return;

    const newId = newFieldLabel.toLowerCase().replace(/\s+/g, "_");
    if (fields.find(f => f.id === newId)) {
      alert("Field with this name already exists");
      return;
    }

    setFields(prev => [...prev, { id: newId, label: newFieldLabel, type: newFieldType }]);
    setFormData(prev => ({ ...prev, [newId]: "" }));
    setCustomFieldIds(prev => [...prev, newId]);
    setNewFieldLabel("");
  };

  const handleDeleteField = (id: string) => {
    setFields(prev => prev.filter(field => field.id !== id));
    setFormData(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    setCustomFieldIds(prev => prev.filter(fid => fid !== id));
  };

  const handleNext = () => {
    const result = personalInfoSchema.safeParse(formData);

    if (!result.success) {
      setError("Please fill all required fields correctly.");
      console.log(result.error.format());
      return;
    }

    setError("");
   
    dispatch(setPersonalInfo(formData));

    
    navigate("/resume/aboutme");
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl mx-auto p-6">
        {/* Left side: form inputs */}
        <div className="flex-1 border p-6 rounded-md shadow-sm">
          <h2 className="text-center text-xl font-semibold mb-8">
            Personal Information<span className="text-red-600">*</span>
          </h2>

          <div className="flex flex-col gap-6">
            {fields.map(({ id, label, type, required }) => (
              <div key={id} className="relative mb-6">
                <FormFieldRenderer
                  id={id}
                  label={label}
                  type={type as any}
                  required={required}
                  value={formData[id]}
                  onChange={(val) => handleFieldChange(id, val)}
                />
                {customFieldIds.includes(id) && (
                  <Button
                  variant = "ghost"
                    onClick={() => handleDeleteField(id)}
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 text-sm"
                    title="Remove field"
                  >
                    
                  </Button >
                )}
              </div>
            ))}
          </div>

          {/* Add more fields UI */}
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
              onChange={(e) => setNewFieldType(e.target.value as any)}
              className="border px-2 py-2 rounded"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="textarea">Textarea</option>
            </select>
            <Button onClick={addMoreField} variant="skyblue">
              Add more fields
            </Button>
          </div>

          {/* Error message */}
          {error && <p className="text-red-600 mt-4 text-sm font-medium">{error}</p>}

          {/* Navigation buttons */}
          <div className="mt-10 flex justify-between">
            <Button disabled variant="skyblue">{`<- Back`}</Button>
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
