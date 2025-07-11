import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { ResumePreview } from "@/components/pages/ResumePreview";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { ResumeDocument } from "@/components/pages/ResumeDocument";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function FinalResume() {
  const resumeData = useSelector((state: RootState) => state.resume);

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
          <Button variant="skyblue">Save</Button>

          {/* PDF Download Link */}
          <PDFDownloadLink
            document={<ResumeDocument resumeData={resumeData} />}
            fileName="Resume_Jaya.pdf"
            style={{ textDecoration: "none" }}
          >
            {({ loading }) =>
              loading ? (
                "Preparing document..."
              ) : (
                <Button variant="skyblue" className="w-40">
                  Save and Download
                </Button>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    </>
  );
}
