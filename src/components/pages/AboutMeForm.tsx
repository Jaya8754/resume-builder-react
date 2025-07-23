import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FormFieldRenderer } from "@/components/pages/FormFieldRenderer";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useNavigate } from "react-router-dom";
import { aboutMeSchema } from "@/lib/AboutMeSchema";
import { setAboutMe, updateAboutMe } from "@/store/resumeSlice";
import type { RootState } from "@/store/store";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import api from "@/api/api";

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

  const resumeId = useSelector((state: RootState) => state.resume.currentResume.id);
  const aboutMeFromStore = useSelector(
    (state: RootState) => state.resume.currentResume.aboutMe.aboutMe
  );

  const [formData, setFormData] = useState<AboutMeInfo>({
    aboutMe: aboutMeFromStore || "",
  });
  const [fields] = useState(initialFields);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resumeId) return;
    const fetchAboutMe = async () => {
      try {
        const res = await api.get(`/resumes/${resumeId}`);
        const about = res?.data?.resume?.aboutMe;
        if (about?.aboutMe) {
          setFormData({ aboutMe: about.aboutMe });
          dispatch(setAboutMe({ aboutMe: about.aboutMe }));
        }
      } catch (err) {
        console.error("Error fetching About Me:", err);
      }
    };
    fetchAboutMe();
  }, [resumeId, dispatch]);

  const handleFieldChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
    dispatch(updateAboutMe({ [id]: value }));
  };

  const handleBack = () => {
    navigate("/resume/personal-info");
  };

  const handleNext = async () => {
    const result = aboutMeSchema.safeParse(formData);

    if (!result.success) {
      setError("Please fill all required fields correctly.");
      console.log(result.error.format());
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (!resumeId) throw new Error("Missing resume ID!");

      await api.put(`/resumes/${resumeId}/about-me`, formData);

      dispatch(setAboutMe(formData));
      navigate(`/resume/${resumeId}/educational-info`);
    } catch (err) {
      console.error("Failed to save About Me", err);
      alert("Failed to save About Me, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl pt-25 mx-auto p-6">
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <h2 className="text-center text-xl font-semibold mb-6">
            About Me <span className="text-red-600">*</span>
          </h2>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <div className="space-y-6 w-full max-w-xl pl-13">
            {fields.map(({ id, type }) => (
              <FormFieldRenderer
                key={id}
                id={id}
                type={type as "textarea"}
                value={formData[id]}
                onChange={(val) => handleFieldChange(id, val)}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              {"<- Back"}
            </Button>
            <Button variant="skyblue" onClick={handleNext} disabled={loading}>
              {loading ? "Saving..." : "Next ->"}
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
