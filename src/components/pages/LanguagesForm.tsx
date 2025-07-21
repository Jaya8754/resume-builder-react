import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { CreatableMultiSelect } from "@/components/ui/CreatableMultiSelect";
import { languageSchema } from "@/lib/LanguageSchema";
import { setLanguages } from "@/store/resumeSlice";
import type { RootState, AppDispatch } from "@/store/store";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";

const languageOptions = [
  "Tamil", "English", "Hindi", "French", "German",
  "Japanese", "Korean", "Spanish",
];
const levelOptions = ["Beginner", "Intermediate", "Fluent", "Native"];

export default function LanguageForm() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const languagesRedux = useSelector((state: RootState) => state.resume.currentResume.languages);

  const handleLanguagesChange = (val: string) => {
    const newLanguages = val.split(",").map(s => s.trim()).filter(Boolean);

    const updatedLanguages = newLanguages.map(lang => {
      const existing = languagesRedux.find(l => l.language === lang);
      return {
        language: lang,
        level: existing ? existing.level : "",
      };
    });

    dispatch(setLanguages(updatedLanguages));
  };

  const handleLevelChange = (language: string, newLevel: string) => {
    const updatedLanguages = languagesRedux.map(l =>
      l.language === language ? { language, level: newLevel } : l
    );
    dispatch(setLanguages(updatedLanguages));
  };

  const handleBack = () => navigate("/resume/interest-info");

  const handleCreate = () => {
  
    if (languagesRedux.length === 0) {
      alert("Please select at least one language.");
      return;
    }
    if (languagesRedux.some(l => !l.level)) {
      alert("Please select level for all languages.");
      return;
    }

    const result = languageSchema.safeParse({
      languages: languagesRedux,
    });

    if (!result.success) {
      console.log(result.error.format());
      alert("Validation failed. Please check your input.");
      return;
    }

    navigate("/resume/finalresume");
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

          <Label>
            Select Languages<span className="text-red-600">*</span>
          </Label>
          <div className="mt-2 mb-6">
            <CreatableMultiSelect
              value={languagesRedux.map(l => l.language).join(", ")}
              onChange={handleLanguagesChange}
              options={languageOptions}
              placeholder="Type or select languages"
            />
          </div>

          <Label>Language Levels (select each language level)</Label>
          <div className="space-y-4 mb-6">
            {languagesRedux.map(({ language, level }) => (
              <div key={language} className="flex items-center gap-3">
                <span className="w-32">{language}</span>
                <select
                  value={level}
                  onChange={(e) => handleLevelChange(language, e.target.value)}
                  className="border rounded px-3 py-1 dark:bg-gray-900"
                >
                  <option value="">-- Select level --</option>
                  {levelOptions.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              {"<- Back"}
            </Button>
            <Button variant="skyblue" onClick={handleCreate}>
              {"Create ->"}
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
