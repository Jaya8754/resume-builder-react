import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useUpdateInterests, useResumeData } from "@/hooks/resumeHooks";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { interestsSchema } from "@/Schema/InterestsSchema";
import { CreatableMultiSelect } from "@/components/ui/CreatableMultiSelect";
import { setInterests } from "@/store/resumeSlice";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { Skeleton } from "@/components/ui/skeleton";

const interestOptions = [
  "Web Development", "UI/UX Design", "Machine Learning", "Cybersecurity",
  "Cloud Computing", "Data Science", "Blockchain", "DevOps",
  "Mobile App Development", "Game Development", "Artificial Intelligence",
  "IoT", "AR/VR", "Open Source", "Technical Writing", "Startup & Entrepreneurship"
];

export default function InterestForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resumeId } = useParams<{ resumeId: string }>();

  const { data: resumeData, isLoading } = useResumeData(resumeId ?? "");
  const updateInterests = useUpdateInterests(resumeId ?? "");

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [status, setStatus] = useState({ error: "", loading: false });

  useEffect(() => {
    if (resumeData?.interests && resumeData.interests.length) {
      setSelectedInterests(resumeData.interests);
      dispatch(setInterests(resumeData.interests));
    } else {
      setSelectedInterests([]);
      dispatch(setInterests([]));
    }
  }, [resumeData, dispatch]);

  const handleBlur = () => {
    const result = interestsSchema.safeParse({ interests: selectedInterests });
    setFormErrors((prev) => ({
      ...prev,
      interests: result.success ? "" : result.error.errors[0]?.message || "",
    }));
  };

  const handleBack = () => navigate(`/resume/${resumeId}/certificate-info`);

  const handleNext = async () => {
    const result = interestsSchema.safeParse({ interests: selectedInterests });

    if (!result.success) {
      const zodErrors = result.error.format();
      const extractedErrors: { [key: string]: string } = {};

      for (const key in zodErrors) {
        const fieldKey = key as keyof typeof zodErrors;

        if (fieldKey !== "_errors" && zodErrors[fieldKey]?._errors?.length) {
          extractedErrors[fieldKey] = zodErrors[fieldKey]!._errors[0];
        }
      }

      setFormErrors(extractedErrors);
      toast.error(
        `Please fill in the required fields`
      );
      return;
    }

    setFormErrors({});
    setStatus({ error: "", loading: true });

    try {
      await updateInterests.mutateAsync({ interests: selectedInterests });
      dispatch(setInterests(selectedInterests));
      toast.success("Interests saved successfully!");
      navigate(`/resume/${resumeId}/languages-info`);
    } catch (err) {
      console.error("Failed to save interests:", err);
      toast.error("Failed to save interests, please try again.");
    } finally {
      setStatus((prev) => ({ ...prev, loading: false }));
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

          {isLoading ? (
            <Skeleton className="h-6 w-40 mx-auto mb-6" />
          ) : null}

          {status.error && <p className="text-red-600 text-sm mb-4">{status.error}</p>}

          <Label htmlFor="interests">
            Select Interests<span className="text-red-600">*</span>
          </Label>
          <div className="mt-3">
            <CreatableMultiSelect
              value={selectedInterests.join(", ")}
              onChange={(val) => {
                const parsed = val.split(",").map((s) => s.trim()).filter(Boolean);
                setSelectedInterests(parsed);
                dispatch(setInterests(parsed)); // preview update
              }}
              options={interestOptions}
              placeholder="Type or select interests"
              onBlur={handleBlur}
              error={formErrors["interests"]}
            />
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              {"<- Back"}
            </Button>
            <Button variant="skyblue" onClick={handleNext} disabled={status.loading}>
              {status.loading ? "Saving..." : "Next ->"}
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
