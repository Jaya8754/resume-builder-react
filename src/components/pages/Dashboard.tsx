import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { ResumeState } from "@/store/resumeSlice";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  resetResume,
  deleteResume,
  loadResume,
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


const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const userId = currentUser?.user?.id?.toString();

  const allResumes = useSelector((state: RootState) =>
  userId ? state.resume.allResumes[userId] || [] : []
);
  const hasResumes = allResumes?.length > 0;

  const handleCreateNew = () => {
    dispatch(resetResume());
    navigate("/resume/personal-info");
  };

  const handleEdit = (resumeId: string) => {
    if (!userId) return;
    dispatch(loadResume({ userId, resumeId }));
    navigate("/resume/finalresume");
  };

  const handleRename = (resumeId: string) => {
    if (!userId) return;
    const newName = prompt("Enter new name for the resume:");
    if (!newName) return;

    dispatch(renameResume({ userId: userId, resumeId, newName }));
  };

  const handleDelete = (resumeId: string) => {
    if (!userId) return;
    if (window.confirm("Are you sure you want to delete this resume?")) {
      dispatch(deleteResume({ userId, resumeId }));
    }
  };


  const handleDownload = async (resume: ResumeState) => {
  const { pdf } = await import("@react-pdf/renderer");
  const { ResumeDocument } = await import("@/components/pages/ResumeDocument");

  const blob = await pdf(<ResumeDocument resumeData={resume} />).toBlob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${resume.personalInfo.fullName || "Resume"}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  return (
    <>
      <Header isLoggedIn={true} />
  
      <div className="max-w-6xl mx-auto px-6 pt-10">
        {hasResumes ? (
          <>
            <div className="flex gap-8">
              {/* Left: Resume List */}
              <div className="w-1/3">
                <h3 className="text-xl font-semibold mb-4">My Resumes</h3>
                <ul className="space-y-4">
                  {allResumes.map((resume) => (
                    <li
                      key={resume.id}
                      className="border p-4 rounded-md shadow flex justify-between items-start"
                    >
                      <div className="text-left">
                        <Link
                          to={"/resume/finalresume"}
                          className="text-foreground hover:text-primary transition-colors"
                        >
                          {resume.personalInfo.fullName || "Untitled Resume"}
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

                            <DropdownMenuItem onClick={() => handleDelete(resume.id)}>
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
                <p className="text-gray-500">
                  Select a resume to edit or create a new one.
                </p>
              </div>

                {/* Create New at bottom of list */}
                <div className="mt-6">
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white w-full"
                    onClick={handleCreateNew}
                  >
                    Create New Resume
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          // When no resumes exist
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
            <p className="text-gray-300 text-md pt-5">No resumes yet?</p>
            <p className="text-md text-gray-600 max-w-md mx-auto">
              Click <span className="text-primary font-medium">Create New Resume</span> button above
              to get started in minutes!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;