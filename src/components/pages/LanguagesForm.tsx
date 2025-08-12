  import { useState, useEffect } from "react";
  import { useDispatch } from "react-redux";
  import { Button } from "@/components/ui/button";
  import Header from "@/components/HeaderComponents/Header";
  import FormErrorMessage from "@/Schema/FormErrorMessage";
  import { toast } from "sonner";
  import { useUpdateLanguages, useResumeData } from "@/hooks/resumeHooks";
  import { setLanguages } from "@/store/resumeSlice";
  import { useNavigate, useParams } from "react-router-dom";
  import { Label } from "@/components/ui/label";
  import { CreatableMultiSelect } from "@/components/ui/CreatableMultiSelect";
  import { languageInfoSchema } from "@/Schema/LanguageSchema";
  import type { AppDispatch } from "@/store/store";
  import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";

  const languageOptions = [
    "Tamil", "English", "Hindi", "French", "German",
    "Japanese", "Korean", "Spanish",
  ];
  const levelOptions = ["", "Beginner", "Intermediate", "Fluent", "Native"];

  export default function LanguageForm() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [status, setStatus] = useState({ error: "", loading: false });

    const { resumeId } = useParams<{ resumeId: string }>();
    const updateLanguages = useUpdateLanguages(resumeId ?? "");

    const { data: resumeData, isLoading } = useResumeData(resumeId ?? "");

    const [languages, setLanguagesState] = useState<{ language: string; level: string }[]>([]);

    useEffect(() => {
    if (!isLoading && resumeData?.languages) {
      setLanguagesState(resumeData.languages);
      dispatch(setLanguages(resumeData.languages)); 
    }
  }, [resumeData, isLoading, dispatch]);

    useEffect(() => {
      dispatch(setLanguages(languages));
    }, [languages, dispatch]);

    const handleLanguagesChange = (val: string) => {
      const newLanguages = val
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const updated = newLanguages.map((lang) => {
        const found = languages.find((l) => l.language === lang);
        return found ? found : { language: lang, level: "" };
      });
      setLanguagesState(updated);
    };

    const handleLevelChange = (language: string, newLevel: string) => {
      setLanguagesState((prev) =>
        prev.map((l) =>
          l.language === language ? { language, level: newLevel } : l
        )
      );
    };

    const handleBlur = () => {
      const result = languageInfoSchema.safeParse({ languages });

      if (!result.success) {
        const zodErrors = result.error.format();
        setFormErrors(prev => ({
          ...prev,
          languages: zodErrors.languages?._errors?.[0] || "",
        }));
      } else {
        setFormErrors(prev => ({ ...prev, languages: "" }));
      }
    };

    const handleBack = () => navigate(`/resume/${resumeId}/interest-info`);

  const handleNext = async () => {


    const result = languageInfoSchema.safeParse({ languages });
    if (!result.success) {
      console.log("Zod raw issues:", result.error.issues);
      console.log("Zod formatted:", result.error.format());
      const zodErrors = result.error.format();
      const extractedErrors: { [key: string]: string } = {};

      Object.keys(zodErrors).forEach((fieldKey) => {
        if (fieldKey === "languages") {
          extractedErrors[fieldKey] = zodErrors[fieldKey]!._errors[0];
        }
      });


      setFormErrors(extractedErrors);
      toast.error(
        `Please fill in the required fields`
      );
      return;
    }

    setFormErrors({});
    setStatus({ error: "", loading: true });

    try {

      if (!resumeId) throw new Error("Missing resume ID");

      await updateLanguages.mutateAsync({ languages });

      dispatch(setLanguages(languages));

      toast.success("Languages saved successfully!");
      navigate(`/resume/${resumeId}/finalresume`);
    } catch (err) {
      console.error("Failed to save languages:", err);
      toast.error("Failed to save languages, please try again.");
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
            <h2 className="text-center text-xl font-semibold mb-6">
              Languages<span className="text-red-600">*</span>
            </h2>

            {status.error && <p className="text-red-600 text-sm mb-4">{status.error}</p>}

            <Label>
              Select Languages<span className="text-red-600">*</span>
            </Label>
            <div className="mt-2 mb-6">
              <CreatableMultiSelect
                value={languages.map((l) => l.language).join(", ")}
                onChange={handleLanguagesChange}
                error={formErrors["languages"]}
                options={languageOptions}
                onBlur={() => handleBlur()}
                placeholder="Type or select languages"
              />
            </div>

            <Label>Language Levels (select each language level)</Label>
            <div className="space-y-4 mb-6">
              {languages.map(({ language, level }) => (
                <div key={language} className="flex items-center gap-3">
                  <span className="w-32">{language}</span>
                  <select
                    value={level}
                    onChange={(e) => handleLevelChange(language, e.target.value)}
                    className="border rounded px-3 py-1 dark:bg-gray-900"
                    onBlur={() => handleBlur()}
                  >
                    {levelOptions.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl || "-- Select level --"}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <FormErrorMessage message={formErrors["languages"]} />
            </div>

            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={handleBack} disabled={status.loading}>
                {"<- Back"}
              </Button>
              <Button variant="skyblue" onClick={handleNext} disabled={status.loading}>
                {status.loading ? "Saving..." : "Create ->"}
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
