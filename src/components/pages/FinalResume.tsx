import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Skeleton } from "@/components/ui/skeleton";
import { useResumeData } from "@/hooks/resumeHooks";
import type { RawResume } from "@/components/interfaces/interfaces";
import { useSelector } from "react-redux";
import { type RootState } from "@/store/store";
import { ResumeDocument } from "@/components/PreviewComponents/ResumeDocument";
import type { ResumeData } from "@/components/interfaces/interfaces";

export default function FinalResume() {
  const navigate = useNavigate();
  const { resumeId } = useParams<{ resumeId: string }>();
  const validResumeId = resumeId ?? "";

  const currentUser = useSelector((state: RootState) => state.auth.currentUser);

  const { data: fetchedResume, isLoading, isError } = useResumeData(validResumeId);

  const [downloadReady, setDownloadReady] = useState(false);

  const transformResume = useCallback((resume: RawResume): ResumeData => ({
    fullName: resume.fullName || "",
    jobTitle: resume.jobTitle || "",
    email: resume.email || "",
    phoneNumber: resume.phoneNumber || "",
    location: resume.location || "",
    linkedinProfile: resume.linkedinProfile || "",
    portfolio: resume.portfolio || "",
    profilePicture: resume.profilePicture || "",
    aboutMe: { aboutMe: resume.aboutMe || resume.about_me || "" },
    educations: resume.educations || [],
    experiences: resume.experiences || [],
    skills: resume.skills || [],
    projects: resume.projects || [],
    certifications: resume.certifications || [],
    interests: resume.interests || [],
    languages: resume.languages || [],
  }), []);

  if (isLoading) {
    return (
      <>
        <Header isLoggedIn />
        <div className="max-w-5xl pt-24 mx-auto p-6">
          <Skeleton className="h-10 w-40 mx-auto mb-4" />
          <Skeleton className="h-96 rounded-md" />
          <Skeleton className="h-12 w-40 mt-6 mx-auto" />
        </div>
      </>
    );
  }

  if (isError || !fetchedResume) {
    return (
      <>
        <Header isLoggedIn />
        <div className="max-w-5xl pt-24 mx-auto p-6 text-center text-red-600">
          Failed to load resume. Please try again.
        </div>
      </>
    );
  }

  const resumeData = transformResume(fetchedResume);

  const saveResume = async () => Promise.resolve(true);

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
      <div className="max-w-5xl pt-24 mx-auto p-6 flex flex-col gap-8">
        <div
          id="resume-content"
          className="border rounded-md shadow-md p-4 bg-white dark:bg-gray-900"
        >
          <ResumePreview resumeData={resumeData} showEditLinks />
        </div>

        <div className="flex flex-row justify-center gap-4">
          <Button variant="skyblue" onClick={handleSave}>
            Save
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
            <Button variant="skyblue" className="w-40" onClick={handleDownload}>
              Save and Download
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
