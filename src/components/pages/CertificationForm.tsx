import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useUpdateCertifications, useResumeData } from '@/hooks/resumeHooks';
import { Skeleton } from "../ui/skeleton";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { FormFieldRenderer } from "@/components/InputFields/FormFieldRenderer";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { certificationInfoSchema, baseCertificationSchema } from "@/Schema/CertificationsSchema";
import { setCertifications } from "@/store/resumeSlice";
import { Plus, Minus } from "lucide-react";
import type { CertificationInfo } from "@/components/interfaces/interfaces";

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
  skillsCovered: [],
});

export default function CertificationForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { resumeId } = useParams<{ resumeId: string }>();

  const { data: resumeData, isLoading } = useResumeData(resumeId ?? "");
  const updateCertifications = useUpdateCertifications(resumeId ?? "");

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState({ error: "", loading: false });
  const [certifications, setCertificationList] = useState<CertificationInfo[]>([createEmptyCertificate()]);

  const isCertificateEmpty = (cert: CertificationInfo) =>
    !cert.certificationName.trim() &&
    !cert.issuer.trim() &&
    !cert.issuedDate.trim() &&
    (!Array.isArray(cert.skillsCovered) || cert.skillsCovered.length === 0);

  useEffect(() => {
    if (resumeData?.certifications && resumeData.certifications.length > 0) {
      setCertificationList(
        resumeData.certifications.map((cert: CertificationInfo) => ({
          ...cert,
          skillsCovered: Array.isArray(cert.skillsCovered)
            ? cert.skillsCovered
            : cert.skillsCovered?.split(",").map((s: string) => s.trim()) || [],
        }))

      );
      dispatch(setCertifications(resumeData.certifications));
    } else {
      setCertificationList([createEmptyCertificate()]);
      dispatch(setCertifications([createEmptyCertificate()]));
    }
  }, [resumeData, dispatch]);

  const handleFieldChange = (index: number, id: keyof CertificationInfo, value: string | string[]) => {
    const updatedList = certifications.map((cert, i) =>
      i === index
        ? { ...cert, [id]: id === "skillsCovered" && typeof value === "string"
            ? value.split(",").map(v => v.trim()).filter(Boolean)
            : value }
        : cert
    );
    setCertificationList(updatedList);
    dispatch(setCertifications(updatedList));
  };

  const handleBlur = (index: number, fieldId: keyof CertificationInfo) => {
    const cert = certifications[index];
    const isEmpty = isCertificateEmpty(cert);

    if (isEmpty) {
      setFormErrors(prev => {
        const updated = { ...prev };
        delete updated[`certificationName-${index}`];
        delete updated[`issuer-${index}`];
        delete updated[`issuedDate-${index}`];
        delete updated[`skillsCovered-${index}`];
        return updated;
      });
      return;
    }

    const singleFieldSchema = baseCertificationSchema.shape[fieldId];
    if (singleFieldSchema) {
      const result = singleFieldSchema.safeParse(cert[fieldId]);
      setFormErrors(prev => ({
        ...prev,
        [`${fieldId}-${index}`]: result.success ? "" : result.error.errors[0]?.message || "",
      }));
    }
  };

  const handleAddCertificate = () =>
    setCertificationList(prev => {
      const updated = [...prev, createEmptyCertificate()];
      dispatch(setCertifications(updated));
      return updated;
    });

  const handleRemoveCertificate = (index: number) =>
    setCertificationList(prev => {
      if (prev.length === 1) return prev;
      const updated = prev.filter((_, i) => i !== index);
      dispatch(setCertifications(updated));
      return updated;
    });

  const handleBack = () => navigate(`/resume/${resumeId}/project-info`);

  const handleNext = async () => {
    const filteredCertificates = certifications.filter(c => !isCertificateEmpty(c));

    if (filteredCertificates.length === 0) {
      toast.success("Certifications skipped successfully!");
      navigate(`/resume/${resumeId}/interest-info`);
      return;
    }

    for (let i = 0; i < filteredCertificates.length; i++) {
      const cert = filteredCertificates[i];
      const result = certificationInfoSchema.safeParse(cert);

      if (!result.success) {
        const zodErrors = result.error.format();
        const extractedErrors: { [key: string]: string } = {};

        for (const key in zodErrors) {
          const fieldKey = key as keyof typeof zodErrors;
          if (fieldKey !== "_errors" && zodErrors[fieldKey]?._errors?.length) {
            extractedErrors[`${fieldKey}-${i}`] = zodErrors[fieldKey]!._errors[0];
          }
        }

        setFormErrors(extractedErrors);
        toast.error(`Please fill in the required fields`);
        return;
      }
    }

    setFormErrors({});
    setStatus({ error: "", loading: true });

    try {
      if (!resumeId) throw new Error("Missing resume ID");
      await updateCertifications.mutateAsync(filteredCertificates);
      dispatch(setCertifications(filteredCertificates));
      toast.success("Certifications saved successfully!");
      navigate(`/resume/${resumeId}/interest-info`);
    } catch (err) {
      console.error("Failed to save certifications:", err);
      toast.error("Failed to save certifications, please try again.");
    } finally {
      setStatus(prev => ({ ...prev, loading: false }));
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

          {isLoading && <Skeleton className="h-6 w-40 mx-auto mb-6" />}

          <p className="text-sm text-gray-600 mb-4">
            You may skip this section by leaving all fields empty. Only filled certificates will be saved.
          </p>

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
                    value={
                      id === "skillsCovered"
                        ? Array.isArray(formData.skillsCovered)
                          ? formData.skillsCovered.join(", ")
                          : formData.skillsCovered || ""
                        : (formData[id as keyof CertificationInfo] as string) || ""
                    }

                    onChange={(val) => handleFieldChange(idx, id as keyof CertificationInfo, val)}
                    options={options || []}
                    onBlur={() => handleBlur(idx, id as keyof CertificationInfo)}
                    error={formErrors[`${id}-${idx}`]}
                  />
                ))}
              </div>
            </div>
          ))}

          {status.error && <p className="text-red-600 text-sm mt-2">{status.error}</p>}

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
