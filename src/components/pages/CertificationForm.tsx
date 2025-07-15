import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import { certificationInfoSchema } from "@/lib/CertificationsSchema";
import { setCertifications } from "@/store/resumeSlice"; // adjust import path
import type { RootState } from "@/store/store"; // adjust import path
import { ResumePreview } from "@/components/pages/ResumePreview";

export type CertificationInfo = {
  certificationName: string;
  issuer: string;
  issuedDate: string;
  skillsCovered: string; // comma-separated tags
  [key: string]: string;
};

const initialFields = [
  { id: "certificationName", label: "Certificate Name", type: "text", required: true },
  { id: "issuer", label: "Issuer", type: "text", required: true },
  { id: "issuedDate", label: "Issued Date", type: "date", required: true },
  {
    id: "skillsCovered",
    label: "Skills Covered",
    type: "multi-select-with-tags",
    required: true,
    options: [
      "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue.js", "Angular",
      "Tailwind CSS", "Bootstrap", "SASS", "Styled Components",
      "Node.js", "Express.js", "NestJS",
      "MongoDB", "MySQL", "PostgreSQL", "Firebase", "Supabase",
      "Redux", "Zustand", "React Query",
      "GraphQL", "REST API",
      "Git", "GitHub", "GitLab",
      "Webpack", "Vite", "Babel", "ESLint", "Prettier",
      "Jest", "React Testing Library", "Cypress", "Playwright",
      "Figma", "Adobe XD", "Sketch", "Framer", "Canva",
      "Docker", "CI/CD", "Vercel", "Netlify", "Heroku",
      "Python", "Django", "Flask",
      "Java", "Spring Boot", "Kotlin",
      "C++", "C#", ".NET"
    ],
  },
];

export default function CertificationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const certificationsFromStore = useSelector((state: RootState) => state.resume.currentResume.certifications);

  const [formData, setFormData] = useState<CertificationInfo>(
    certificationsFromStore.length > 0 
      ? certificationsFromStore[0] 
      : Object.fromEntries(initialFields.map((f) => [f.id, ""])) as CertificationInfo
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

  const handleBack = () => {
    navigate("/resume/project-info");
  };

  const handleNext = () => {
    const result = certificationInfoSchema.safeParse(formData);

    if (!result.success) {
      console.log(result.error.format());
      alert("Please fill all required fields correctly.");
      return;
    }

    dispatch(setCertifications([formData]));

    navigate("/resume/interest-info");
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <h2 className="text-center text-xl font-semibold mb-6">Certifications</h2>

          <div className="space-y-6">
            {fields.map(({ id, label, type, required, options }) => (
              <FormFieldRenderer
                key={id}
                id={id}
                label={label}
                type={type as any}
                required={required}
                value={formData[id]}
                onChange={(val) => handleFieldChange(id, val)}
                options={options || []}
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
