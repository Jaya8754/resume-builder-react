import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { CreatableMultiSelect } from "@/components/ui/CreatableMultiSelect";
import { interestsSchema } from "@/lib/InterestsSchema";
import * as actions from "@/store/resumeSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";

const interestOptions = [
  "Web Development", "UI/UX Design", "Machine Learning", "Cybersecurity",
  "Cloud Computing", "Data Science", "Blockchain", "DevOps",
  "Mobile App Development", "Game Development", "Artificial Intelligence",
  "IoT", "AR/VR", "Open Source", "Technical Writing", "Startup & Entrepreneurship"
];

export default function InterestForm() {
  const navigate = useNavigate();

  const dispatch = useDispatch<AppDispatch>();

  const interestsFromStore = useSelector((state: RootState) => state.resume.currentResume.interests);
  const [interests, setInterests] = useState<string[]>(interestsFromStore || []);

  const handleBack = () => navigate("/resume/certificate-info");

  const handleFieldChange = (val: string) => {
  const updatedInterests = val.split(",").map((s) => s.trim()).filter(Boolean);
  setInterests(updatedInterests);
  dispatch(actions.setInterests(updatedInterests));
};


  const handleNext = () => {
    const result = interestsSchema.safeParse({ interests });
    if (!result.success) {
      console.log(result.error.format());
      alert("Please fill all required fields correctly.");
      return;
    }
    dispatch(actions.setInterests(interests));
    navigate("/resume/languages-info");
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex gap-10 max-w-6xl pt-25 mx-auto p-6">
        {/* Left side: form */}
        <div className="flex-1 border p-6 rounded-md shadow-sm min-h-[50rem]">
          <h2 className="text-center text-xl font-semibold mb-6">
            Areas of Interests<span className="text-red-600">*</span>
          </h2>

          <Label htmlFor="interests">
            Select Interests<span className="text-red-600">*</span>
          </Label>
          <div className="mt-3">
            <CreatableMultiSelect
              value={interests.join(", ")}
              onChange={handleFieldChange}
              options={interestOptions}
              placeholder="Type or select interests"
            />
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
