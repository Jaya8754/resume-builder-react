import { useState } from "react";
import  { useEffect } from "react";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useDispatch, useSelector } from "react-redux";
import { setExperience } from "@/store/resumeSlice"; 
import type { RootState } from "@/store/store";
import { useNavigate } from "react-router-dom";
import { experienceInfoSchema } from "@/lib/ExperienceInfoSchema";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { Plus, Minus } from "lucide-react";

export type ExperienceInfo = {
  experienceType: string;
  jobtitle: string;
  companyname: string;
  location: string;
  startDate: string;
  endDate: string;
  responsibilities: string;
  [key: string]: string;
};

const initialFields = [
  { id: "experienceType", label: "Work/Internship", type: "select", required: true, options: ["--Select--", "Work", "Internship"] },
  { id: "jobtitle", label: "Job Title", type: "text", required: true },
  { id: "companyname", label: "Company Name", type: "text", required: true },
  { id: "location", label: "Location", type: "text", required: true },
  { id: "startDate", label: "Start Date", type: "date", required: true },
  { id: "endDate", label: "End Date", type: "date" },
  { id: "responsibilities", label: "Responsibilities", type: "textarea" },
];

const createEmptyExperience = () =>
  Object.fromEntries(initialFields.map((f) => [f.id, ""])) as ExperienceInfo;

export default function ExperienceForm() {
  const experienceFromStore = useSelector((state: RootState) => state.resume.currentResume.experience);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [experienceList, setExperienceList] = useState<ExperienceInfo[]>(
    experienceFromStore.length > 0 ? experienceFromStore : [createEmptyExperience()]
  );

    useEffect(() => {
    dispatch(setExperience(experienceList));
  }, [experienceList, dispatch]);


  const handleFieldChange = (index: number, id: string, value: string) => {
    const updatedList = experienceList.map((item, i) =>
      i === index ? { ...item, [id]: value } : item
    );
    setExperienceList(updatedList);
  };

  const addExperienceForm = () => {
    setExperienceList((prev) => [...prev, createEmptyExperience()]);
  };

  const removeExperienceForm = (index: number) => {
    if (experienceList.length === 1) return; // Prevent deleting the last form
    const updatedList = experienceList.filter((_, i) => i !== index);
    setExperienceList(updatedList);
  };

  const handleBack = () => {
    navigate("/resume/educational-info");
  };

  const handleNext = () => {
    for (const experience of experienceList) {
      const result = experienceInfoSchema.safeParse(experience);
      if (!result.success) {
        alert("Please fill all required fields correctly.");
        return;
      }
    }
    dispatch(setExperience(experienceList));
    navigate("/resume/skills-info");
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl pt-25 mx-auto p-6">
        <div className="flex-1 border p-6 rounded-md shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Work/Internship Experience</h2>
            <Button variant="ghost" size="icon" onClick={addExperienceForm} aria-label="Add experience">
              <Plus className="w-5 h-5" />
            </Button>
          </div>

          {experienceList.map((formData, index) => (
            <div key={index} className="mb-6 border rounded p-4 relative">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-sm">Experience {index + 1}</h4>
                {experienceList.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperienceForm(index)}
                    aria-label={`Remove experience ${index + 1}`}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {initialFields.map(({ id, label, type, required, options }) => (
                  <FormFieldRenderer
                    key={`${index}-${id}`}
                    id={id}
                    label={label}
                    type={type as "text" | "textarea" | "select" | "date"}
                    required={required}
                    value={formData[id]}
                    onChange={(val) => handleFieldChange(index, id, val)}
                    options={options || []}
                  />
                ))}
              </div>
            </div>
          ))}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              {"<- Back"}
            </Button>
            <Button variant="skyblue" onClick={handleNext}>
              {"Next ->"}
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
