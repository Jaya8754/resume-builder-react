import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";
import { useNavigate } from "react-router-dom";
import { resetResume } from "@/store/resumeSlice";  // import reset action
import type { RootState, AppDispatch } from "@/store/store";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.currentUser);
  const username = currentUser?.name || "User";
  const navigate = useNavigate();
  const hasResumes = false; // replace with your logic

  const handleCreateNew = () => {
    dispatch(resetResume());  // clear previous resume data
    navigate("/resume/personal-info");  // go to start of resume form
  };

  return (
    <>
      <Header isLoggedIn={true} />
      <div className="flex flex-col items-center justify-center min-h-[calc(60vh-30px)] px-6 text-center space-y-6">
        <h2 className="text-4xl font-semibold">
          Hi, <span className="text-[#1982C4]">{username}</span>! Ready to create a resume?
        </h2>

        {!hasResumes ? (
          <>
            <p className="text-gray-500 text-lg">
              You don't have any resumes yet. Let's create one!
            </p>
            <div className="flex justify-center pt-3 items-center space-x-4">
              <Button
                className="bg-[#1982C4] hover:bg-[#156a99] text-white"
                onClick={handleCreateNew}
              >
                Create New Resume
              </Button>
            </div>
            <p className="text-black-300 text-md pt-5">No resumes yet?</p>
            <p className="text-md text-black-600 max-w-md">
              Click <span className="text-[#1982C4] font-medium">Create New Resume</span> button above
              to get started in minutes!
            </p>
          </>
        ) : (
          // later: render saved resumes here
          <></>
        )}
      </div>
    </>
  );
};

export default Dashboard;
