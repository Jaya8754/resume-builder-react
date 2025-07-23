import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { certificationInfoSchema } from "@/lib/CertificationsSchema";
import { setCertifications } from "@/store/resumeSlice";
import { Plus, Minus } from "lucide-react";
import api from "@/api/api";

export type CertificationInfo = {
  certificationName: string;
  issuer: string;
  issuedDate: string;
  skillsCovered: string;
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

const createEmptyCertificate = (): CertificationInfo => ({
  certificationName: "",
  issuer: "",
  issuedDate: "",
  skillsCovered: "",
});

export default function CertificationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const resumeId = useSelector((state: RootState) => state.resume.currentResume.id);


  const certificationsFromStore = useSelector(
    (state: RootState) => state.resume.currentResume.certifications
  );

  const [certifications, setCertificationList] = useState<CertificationInfo[]>(
    certificationsFromStore.length > 0 ? certificationsFromStore : [createEmptyCertificate()]
  );

  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(setCertifications(certifications));
  }, [certifications, dispatch]);

  const handleFieldChange = (index: number, id: keyof CertificationInfo, value: string) => {
    const updatedList = [...certifications];
    updatedList[index] = { ...updatedList[index], [id]: value };
    setCertificationList(updatedList);
  };

  const handleAddCertificate = () => {
    setCertificationList((prev) => [...prev, createEmptyCertificate()]);
  };

  const handleRemoveCertificate = (index: number) => {
    if (certifications.length === 1) return;
    const updatedList = certifications.filter((_, i) => i !== index);
    setCertificationList(updatedList);
  };

  const handleBack = () => {
    navigate(`/resume/${resumeId}/project-info`);
  };

const handleNext = async () => {
  const isValid = certifications.every((cert) => certificationInfoSchema.safeParse(cert).success);

  if (!isValid) {
    setError("Please fill all required fields correctly in each certification.");
    return;
  }

  try {
    if (!resumeId) throw new Error("Missing resume ID");

    const transformedCertifications = certifications.map((cert) => ({
      ...cert,
      skillsCovered: Array.isArray(cert.skillsCovered)
        ? cert.skillsCovered
        : cert.skillsCovered.split(",").map((skill) => skill.trim()),
    }));

    await api.put(`/resumes/${resumeId}/certifications`, {
      certifications: transformedCertifications,
    });

    const reduxCertifications = transformedCertifications.map((cert) => ({
      ...cert,
      skillsCovered: Array.isArray(cert.skillsCovered)
        ? cert.skillsCovered.join(", ")
        : cert.skillsCovered,
    }));

    dispatch(setCertifications(reduxCertifications));
    navigate(`/resume/${resumeId}/interest-info`);
  } catch (err) {
    console.error("Failed to save certifications:", err);
    setError("Failed to save certifications, please try again.");
  }
};



  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl pt-25 mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Certifications</h2>
            <Button variant="ghost" size="icon" onClick={handleAddCertificate} aria-label="Add certification">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {certifications.map((formData, idx) => (
            <div key={idx} className="mb-6 border rounded p-4 relative">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm">Certificate {idx + 1}</h4>
                {certifications.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveCertificate(idx)}
                    aria-label={`Remove certificate ${idx + 1}`}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {initialFields.map(({ id, label, type, required, options }) => (
                  <FormFieldRenderer
                    key={`${idx}-${id}`}
                    id={id}
                    label={label}
                    type={type as "text" | "textarea" | "date" | "multi-select-with-tags"}
                    required={required}
                    value={formData[id as keyof CertificationInfo] || ""}
                    onChange={(val) => handleFieldChange(idx, id as keyof CertificationInfo, val)}
                    options={options || []}
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

        {/* Right side: preview */}
        <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 min-h-[50rem]">
          <ResumePreview isCompact />
        </div>
      </div>
    </>
  );
}
