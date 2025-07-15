import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState, AppDispatch } from "@/store/store";
import { ResumePreview } from "@/components/pages/ResumePreview";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { ResumeDocument } from "@/components/pages/ResumeDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { saveCurrentResume } from "@/store/resumeSlice";
import { useState } from "react";

export default function FinalResume() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const resumeData = useSelector((state: RootState) => state.resume.currentResume);

  const [downloadReady, setDownloadReady] = useState(false);

  const handleSave = () => {
    dispatch(saveCurrentResume());
    navigate("/dashboard"); // Navigate to dashboard after saving
  };

  const handleDownload = () => {
    dispatch(saveCurrentResume());
    setDownloadReady(true); // triggers rendering of PDFDownloadLink
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="max-w-5xl mx-auto p-6">
        <div
          id="resume-content"
          className="border rounded-md shadow-md p-4 bg-white dark:bg-gray-900"
        >
          <ResumePreview resumeData={resumeData} showEditLinks />
        </div>

        <div className="flex flex-row justify-center gap-4 mt-8">
          {/* Save Button */}
          <Button variant="skyblue" onClick={handleSave}>
            Save
          </Button>

          {/* Save and Download Button */}
          {downloadReady ? (
            <PDFDownloadLink
              document={<ResumeDocument resumeData={resumeData} />}
              fileName="Resume_Jaya.pdf"
              style={{ textDecoration: "none" }}
            >
              {({ loading }) =>
                loading ? (
                  "Preparing document..."
                ) : (
                  <Button
                    variant="skyblue"
                    className="w-40"
                    onClick={() => navigate("/dashboard")}
                  >
                    Downloading...
                  </Button>
                )
              }
            </PDFDownloadLink>
          ) : (
            <Button
              variant="skyblue"
              className="w-40"
              onClick={handleDownload}
            >
              Save and Download
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
