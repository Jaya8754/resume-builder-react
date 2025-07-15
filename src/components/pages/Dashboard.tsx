import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import {
  resetResume,
  deleteResume,
  loadResume,
} from "@/store/resumeSlice";
import type { RootState, AppDispatch } from "@/store/store";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const username = currentUser?.name || "User";

  const allResumes = useSelector((state: RootState) => state.resume.allResumes);
  const hasResumes = allResumes?.length > 0;

  const handleCreateNew = () => {
    dispatch(resetResume());
    navigate("/resume/personal-info");
  };

  const handleEdit = (resumeId: string) => {
    dispatch(loadResume(resumeId));
    navigate("/resume/finalresume");
  };

  const handleDelete = (resumeId: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      dispatch(deleteResume(resumeId));
    }
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
                        <p className="font-medium">
                          {resume.personalInfo.fullName || "Untitled Resume"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleEdit(resume.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive" className = "dark:bg-red-600 dark:hover:bg-red-700"
                          onClick={() => handleDelete(resume.id)}
                        >
                          Delete
                        </Button>
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
                    className="bg-[#1982C4] hover:bg-[#156a99] text-white w-full"
                    onClick={handleCreateNew}
                  >
                    Create New Resume
                  </Button>
                </div>
              </div>

              {/* Right Side (optional) */}
            </div>
          </>
        ) : (
          // When no resumes exist
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold">
              Hi, <span className="text-[#1982C4]">{username}</span>! Ready to create a resume?
            </h2>
            <p className="text-gray-500 text-lg">
              You don't have any resumes yet. Let's create one!
            </p>
            <Button
              className="bg-[#1982C4] hover:bg-[#156a99] text-white"
              onClick={handleCreateNew}
            >
              Create New Resume
            </Button>
            <p className="text-gray-300 text-md pt-5">No resumes yet?</p>
            <p className="text-md text-gray-600 max-w-md mx-auto">
              Click <span className="text-[#1982C4] font-medium">Create New Resume</span> button above
              to get started in minutes!
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;
