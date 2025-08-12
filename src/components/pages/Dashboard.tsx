import { useDispatch, useSelector } from "react-redux";
import type { Resume } from "@/components/interfaces/interfaces";
import { useState } from "react";
import { useAllResumes, useCreateResume, useDeleteResume } from "@/hooks/resumeHooks";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Header from "@/components/HeaderComponents/Header";
import api from "@/api/api";
import {
  resetResume,
  renameResume,
} from "@/store/resumeSlice";
import type { RootState, AppDispatch } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2, Download, Pencil } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data: allResumes } = useAllResumes();

  const initialResumeData = {
    fullName: "Untitled",
    email: "example@example.com",
    phoneNumber: "0000000000",
    location: "Unknown",
  };

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const userId = currentUser?.user?.id?.toString();

  const hasResumes = allResumes && allResumes.length > 0;

  const { mutate: createResume, isPending: creating } = useCreateResume();

  const handleCreateNew = () => {
    if (!userId) {
      toast.error("User ID missing, please login again.");
      return;
    }

    createResume(initialResumeData, {
      onSuccess: (res) => {
        console.log("CREATE RESUME RESPONSE:", res);
        const newResumeId = res.data.data.resume.id;
        if (!newResumeId) {
          toast.error("No resume ID returned from server.");
          return;
        }

        dispatch(resetResume({ resumeId: newResumeId.toString() }));
        navigate(`/resume/${newResumeId}/personal-info`);
      },
      onError: (error: unknown) => {
        if (error instanceof Error) {
          console.error("Error creating resume:", error.message);
          toast.error(`Failed to create new resume: ${error.message}`);
        } else {
          console.error("Unknown error creating resume:", error);
          toast.error("Failed to create new resume due to unknown error.");
        }
      },
    });
  };

  const handleEdit = (resumeId: string) => {
    navigate(`/resume/${resumeId}/finalresume`);
  };

  const handleRename = (resumeId: string) => {
    if (!userId) return;
    const newName = prompt("Enter new name for the resume:");
    if (!newName) return;
    dispatch(renameResume({ userId, resumeId, newName }));
  };

  const { mutate: deleteResume } = useDeleteResume();

  const handleDelete = (id: string) => {
    deleteResume(id, {
      onSuccess: () => toast.success("Resume deleted successfully"),
      onError: () => toast.error("Failed to delete resume"),
    });
  };

  const handleDownload = async (resume: Resume) => {
    try {
      const response = await api.get(`/resumes/${resume.id}`);
      const fullResume = response.data.data.resume;
      const { pdf } = await import("@react-pdf/renderer");
      const { ResumeDocument } = await import("@/components/PreviewComponents/ResumeDocument");

      console.log("Full Resume data for PDF:", fullResume);

      const blob = await pdf(<ResumeDocument resumeData={fullResume} />).toBlob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${fullResume.personalInfo?.fullName || "Resume"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed", err);
    }
  };



  return (
    <>
      <Header isLoggedIn={!!currentUser} />
      <div className="max-w-6xl mx-auto px-6 pt-25 pl-10 pb-10">
        {hasResumes ? (
          <div className="flex gap-8">
            <div className="w-1/3">
              <h3 className="text-xl font-semibold mb-4">My Resumes</h3>
              <ul className="space-y-4">
                {allResumes?.map((resume) => (
                  <li
                    key={resume.id}
                    className="border p-4 rounded-md shadow flex justify-between items-start"
                  >
                    <div className="text-left">
                      <Link
                        to={`/resume/${resume.id}/finalresume`}
                        onClick={(e) => {
                          e.preventDefault(); 
                          handleEdit(resume.id);
                        }}
                        className="text-foreground hover:text-primary transition-colors"
                      >
                        {resume.fullName || "Untitled Resume"}
                      </Link>

                      <p className="text-sm text-gray-500">
                        {new Date(resume.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(resume.id)}>
                            <Edit className="w-4 h-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedResumeId(resume.id);
                              setOpenDeleteDialog(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2 text-red-600" /> Delete
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDownload(resume)}>
                            <Download className="w-4 h-4 mr-2" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRename(resume.id)}>
                            <Pencil className="w-4 h-4 mr-2" /> Rename
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="w-full flex items-center justify-center text-center">
                <p className="text-gray-500">Select a resume to edit or create a new one.</p>
              </div>
              <div className="mt-6">
                <Button
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={handleCreateNew}
                  disabled={creating}
                >
                  {creating ? "Creating..." : "Create New Resume"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">
              Hi, <span className="text-primary capitalize">{currentUser?.user?.name || "User"}</span>! Ready to create a resume?
            </h2>
            <p className="text-gray-500 text-lg">
              You don't have any resumes yet. Let's create one!
            </p>
            <Button
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={handleCreateNew}
            >
              Create New Resume
            </Button>
            <p className="text-gray-500 text-md pt-5">No resumes yet?</p>
            <p className="text-md text-gray-600 max-w-md mx-auto">
              Click <span className="text-primary font-medium">Create New Resume</span> button above to get started in minutes!
            </p>
          </div>
        )}
       <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this resume? This action cannot be undone.
                  </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-white hover:bg-destructive/90"
                onClick={() => {
                  if (selectedResumeId) {
                    handleDelete(selectedResumeId);
                  }
                  setOpenDeleteDialog(false);
                }}
              >
                Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
};

export default Dashboard;
