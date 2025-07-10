import { useState } from "react";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import { aboutMeSchema } from "@/lib/AboutMeSchema";

export type AboutMeInfo = {
  aboutMe: string;
  [key: string]: string;
};

const initialFields = [
  { id: "aboutMe", label: "About Me", type: "textarea", required: true },
];

export default function AboutMeForm() {
  const [formData, setFormData] = useState<AboutMeInfo>(
    Object.fromEntries(initialFields.map((f) => [f.id, ""])) as AboutMeInfo
  );

  const [fields] = useState(initialFields);
  //   const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFieldChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleBack = () => {
    navigate("/resume/personal-info");
  };

  const handleNext = () => {
    const result = aboutMeSchema.safeParse(formData);

    if (!result.success) {
      // Show error to the user (example: alert or setError state)
      console.log(result.error.format());
      alert("Please fill all required fields correctly.");
      return;
    }

    // Navigate to the next section if validation passes
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
            <Button variant="skyblue" onClick={handleNext}>{`Next ->`}</Button>
          </div>
        </div>

        {/* Right side: preview */}
        <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 min-h-[36rem]">

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

  )

} 