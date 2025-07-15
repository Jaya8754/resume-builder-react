import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import { aboutMeSchema } from "@/lib/AboutMeSchema";
import { setAboutMe } from "@/store/resumeSlice"; // adjust path
import type { RootState } from "@/store/store"; // adjust path
import { ResumePreview } from "@/components/pages/ResumePreview";

export type AboutMeInfo = {
  aboutMe: string;
  [key: string]: string;
};

const initialFields = [
  { id: "aboutMe", label: "About Me", type: "textarea", required: true },
];

export default function AboutMeForm() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const aboutMeFromStore = useSelector((state: RootState) => state.resume.currentResume.aboutMe.aboutMe);

  const [formData, setFormData] = useState<AboutMeInfo>({
    aboutMe: aboutMeFromStore || "",
  });

  const [fields] = useState(initialFields);

  const handleFieldChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleBack = () => {
    navigate("/resume/personal-info");
  };

  const handleNext = () => {
    const result = aboutMeSchema.safeParse(formData);

    if (!result.success) {
      console.log(result.error.format());
      alert("Please fill all required fields correctly.");
      return;
    }

    dispatch(setAboutMe(formData)); // Save to Redux

    navigate("/resume/educational-info");
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem] ">
          <h2 className="text-center text-xl font-semibold mb-6">
            About Me<span className="text-red-600">*</span>
          </h2>

          <div className="space-y-6 w-full max-w-xl pl-13">
            {fields.map(({ id, type }) => (
              <FormFieldRenderer
                key={id}
                id={id}
                type={type as any}
                value={formData[id]}
                onChange={(val) => handleFieldChange(id, val)}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              {"<- Back"}
            </Button>
            <Button variant="skyblue" onClick={handleNext}>
              {`Next ->`}
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
