import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useNavigate } from "react-router-dom";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { personalInfoSchema } from "@/lib/personalInfoSchema";
import {
  setPersonalInfo,
  updatePersonalInfo,
} from "@/store/resumeSlice";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import api from "@/api/api";
import type { RootState } from "@/store/store";

type PersonalInfo = {
  fullName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  location: string;
  linkedinProfile: string;
  portfolio: string;
  profilePicture: string;
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
  { id: "profilePicture", label: "Profile Picture URL", type: "file" },
];

export default function PersonalInfoForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resumeId = useSelector((state: RootState) => state.resume.currentResume.id);
  const personalInfoFromStore = useSelector((state: RootState) => state.resume.currentResume.personalInfo);

  const [formData, setFormData] = useState<PersonalInfo>({
    ...Object.fromEntries(initialFields.map((f) => [f.id, ""])),
    ...personalInfoFromStore,
  });

  const [fields, setFields] = useState(initialFields);
  const [customFieldIds, setCustomFieldIds] = useState<string[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "email" | "textarea">("text");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...personalInfoFromStore }));
  }, [personalInfoFromStore]);

  useEffect(() => {
    if (!resumeId) return;

    const fetchPersonalInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/resumes/${resumeId}`);
        const backendData = response?.data?.resume?.personalInfo;

        if (backendData) {
          dispatch(setPersonalInfo(backendData));
          setFormData((prev) => ({ ...prev, ...backendData }));
        }
      } catch (err) {
        console.error("Error fetching personal info", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPersonalInfo();
  }, [resumeId, dispatch]);

  const handleFieldChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    dispatch(updatePersonalInfo({ [id]: value }));
  };

  const addMoreField = () => {
    if (!newFieldLabel.trim()) return;

    const newId = newFieldLabel.toLowerCase().replace(/\s+/g, "_");
    if (fields.some((f) => f.id === newId)) {
      alert("Field already exists");
      return;
    }

    const newField = { id: newId, label: newFieldLabel, type: newFieldType };
    setFields((prev) => [...prev, newField]);
    setCustomFieldIds((prev) => [...prev, newId]);
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
    setCustomFieldIds((prev) => prev.filter((fid) => fid !== id));
  };

  const handleNext = async () => {
    const result = personalInfoSchema.safeParse(formData);

    if (!result.success) {
      setError("Please fill in required fields correctly.");
      console.log(result.error.format());
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (resumeId) {
      await api.put(`/resumes/${resumeId}/personal-details`, {
        ...formData,  
      });
      } else {
        const response = await api.post("/resumes", { personalInfo: formData });
        const newId = response?.data?.resume?.id;
        if (newId) {
          console.log("Resume created with ID:", newId);
        }
      }

      dispatch(setPersonalInfo(formData));
      navigate(`/resume/${resumeId}/aboutme`);
    } catch (err) {
      console.error("Error saving personal info", err);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
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

          {loading && <p className="text-center text-blue-600">Loading...</p>}

          <div className="flex flex-col gap-6">
            {fields.map(({ id, label, type, required }) => (
              <div key={id} className="relative mb-6">
                <FormFieldRenderer
                  id={id}
                  label={label}
                  type={type as "text" | "email" | "file" | "textarea"}
                  required={required}
                  value={formData[id]}
                  onChange={(val) => handleFieldChange(id, val)}
                />
                {customFieldIds.includes(id) && (
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

          {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}

          <div className="mt-10 flex justify-between">
            <Button disabled variant="skyblue">
              ← Back
            </Button>
            <Button variant="skyblue" onClick={handleNext} disabled={loading}>
              {loading ? "Saving..." : "Next →"}
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
