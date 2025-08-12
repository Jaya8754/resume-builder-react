import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "sonner"; 
import { type RootState, type AppDispatch } from "@/store/store";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { ResumeDocument } from "@/components/PreviewComponents/ResumeDocument";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { saveCurrentResume, setCurrentResume } from "@/store/resumeSlice";
import { useResumeData } from "@/hooks/resumeHooks";

export default function FinalResume() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { resumeId } = useParams();

  const resumeData = useSelector((state: RootState) => state.resume.currentResume);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const userId = currentUser?.user?.id?.toString();

  const [downloadReady, setDownloadReady] = useState(false);
  const [saving, setSaving] = useState(false);

  const { data: fetchedResume } = useResumeData(resumeId || "");

  useEffect(() => {
    if (fetchedResume && fetchedResume.id !== resumeData.id) {
      const transformedResume = {
        ...fetchedResume,
        personalInfo: {
          fullName: fetchedResume.fullName || "",
          jobTitle: fetchedResume.jobTitle || "",
          email: fetchedResume.email || "",
          phoneNumber: fetchedResume.phoneNumber || "",
          location: fetchedResume.location || "",
          linkedinProfile: fetchedResume.linkedinProfile || "",
          portfolio: fetchedResume.portfolio || "",
          profilePicture: fetchedResume.profilePicture || "",
        },
        aboutMe: { aboutMe: fetchedResume.aboutMe || fetchedResume.about_me || "" },
        education: fetchedResume.educations || [],
        experience: fetchedResume.experiences || [],
        skills: fetchedResume.skills || [],
        projects: fetchedResume.projects || [],
        certifications: fetchedResume.certifications || [],
        interests: fetchedResume.interests || [],
        languages: fetchedResume.languages || [],
      };

      dispatch(setCurrentResume(transformedResume));
    }
  }, [fetchedResume, resumeData.id, dispatch]);

  const saveResume = async () => {
    if (!userId || !resumeData.id) return false;
    try {
      setSaving(true);
      await dispatch(saveCurrentResume({ userId, resumeId: resumeData.id }));
      setSaving(false);
      return true;
    } catch {
      setSaving(false);
      return false;
    }
  };

  const handleSave = async () => {
    const saved = await saveResume();
    if (saved) {
      toast.success("Resume saved successfully.");
      navigate("/dashboard");
    } else {
      toast.error("Failed to save resume. Please try again.");
    }
  };

  const handleDownload = async () => {
    const saved = await saveResume();
    if (saved) {
      setDownloadReady(true);
      toast.success("Resume saved. Download ready!");
    } else {
      toast.error("Failed to save resume. Please try again.");
    }
  };

  return (
    <>
      <Header isLoggedIn />
      <div className="max-w-5xl pt-24 mx-auto p-6">
        <div
          id="resume-content"
          className="border rounded-md shadow-md p-4 bg-white dark:bg-gray-900"
        >
          <ResumePreview resumeData={resumeData} showEditLinks />
        </div>

        <div className="flex flex-row justify-center gap-4 mt-8">
          <Button variant="skyblue" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>

          {downloadReady ? (
            <PDFDownloadLink
              document={<ResumeDocument resumeData={resumeData} />}
              fileName={`Resume_${currentUser?.user.name || "User"}.pdf`}
              className="no-underline"
            >
              {({ loading }) =>
                loading ? (
                  <Button variant="skyblue" className="w-40" disabled>
                    Preparing...
                  </Button>
                ) : (
                  <Button variant="skyblue" className="w-40">
                    Download PDF
                  </Button>
                )
              }
            </PDFDownloadLink>
          ) : (
            <Button variant="skyblue" className="w-40" onClick={handleDownload} disabled={saving}>
              {saving ? "Saving..." : "Save and Download"}
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
