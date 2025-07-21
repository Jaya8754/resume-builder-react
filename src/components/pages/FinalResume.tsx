import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/store/store";
import { ResumePreview } from "@/components/PreviewComponents/ResumePreview";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import { ResumeDocument } from "@/components/PreviewComponents/ResumeDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { saveCurrentResume } from "@/store/resumeSlice";
import { useState } from "react";

export default function FinalResume() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const resumeData = useSelector((state: RootState) => state.resume.currentResume);
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  
  const userId = currentUser?.user?.id?.toString();

  const [downloadReady, setDownloadReady] = useState(false);

  const handleSave = () => {
    if (!userId || !resumeData.id) return;
    dispatch(saveCurrentResume({ userId, resumeId: resumeData.id }));
    navigate("/dashboard");
  };

  const handleDownload = () => {
    if (!userId || !resumeData.id) return;
    dispatch(saveCurrentResume({ userId, resumeId: resumeData.id }));
    setDownloadReady(true);
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="max-w-5xl pt-25 mx-auto p-6">
        <div
          id="resume-content"
          className="border rounded-md shadow-md p-4 bg-white dark:bg-gray-900"
        >
          <ResumePreview resumeData={resumeData} showEditLinks />
        </div>

        <div className="flex flex-row justify-center gap-4 mt-8">
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
