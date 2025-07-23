import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { Label } from "@/components/ui/label";
import { interestsSchema } from "@/lib/InterestsSchema";
import { CreatableMultiSelect } from "@/components/ui/CreatableMultiSelect";
import { setInterests } from "@/store/resumeSlice";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import api from "@/api/api";

const interestOptions = [
  "Web Development", "UI/UX Design", "Machine Learning", "Cybersecurity",
  "Cloud Computing", "Data Science", "Blockchain", "DevOps",
  "Mobile App Development", "Game Development", "Artificial Intelligence",
  "IoT", "AR/VR", "Open Source", "Technical Writing", "Startup & Entrepreneurship"
];

export default function InterestForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const resumeId = useSelector((state: RootState) => state.resume.currentResume.id);
  const interestsFromStore = useSelector((state: RootState) => state.resume.currentResume.interests);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(interestsFromStore || []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedInterests(interestsFromStore || []);
  }, [interestsFromStore]);

  const handleBack = () => navigate(`/resume/${resumeId}/certificate-info`);

  const handleNext = async () => {
    const result = interestsSchema.safeParse({ interests: selectedInterests });
    if (!result.success) {
      console.log(result.error.format());
      setError("Please fill all required fields correctly.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await api.put(`/resumes/${resumeId}/interests`, {
        interests: selectedInterests,
      });

      dispatch(setInterests(selectedInterests));
      navigate(`/resume/${resumeId}/languages-info`);
    } catch (err) {
      console.error("Failed to save interests:", err);
      setError("Failed to save interests, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 pt-25 max-w-6xl mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <h2 className="text-center text-xl font-semibold mb-6">
            Areas of Interests<span className="text-red-600">*</span>
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Select the areas you are interested in.
          </p>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <Label htmlFor="interests">
            Select Interests<span className="text-red-600">*</span>
          </Label>
          <div className="mt-3">
            <CreatableMultiSelect
              value={selectedInterests.join(", ")}
              onChange={(val) => {
                const parsed = val.split(",").map((s) => s.trim()).filter(Boolean);
                setSelectedInterests(parsed);
                dispatch(setInterests(parsed)); 
              }}
              options={interestOptions}
              placeholder="Type or select interests"
            />
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

        {/* Right side: preview */}
        <div className="flex-1 border p-6 rounded-md shadow-sm bg-gray-50 dark:bg-gray-800 min-h-[50rem]">
          <ResumePreview isCompact />
        </div>
      </div>
    </>
  );
}
