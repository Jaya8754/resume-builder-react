import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/pages/Header";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      <Header isLoggedIn={false} />
      <div className="min-h-screen px-10 pt-16 pb-10">
        <div className="max-w-screen-xl w-full flex justify-between items-start gap-12 mx-auto">

          <div className="flex-1 flex flex-col space-y-15">
            <div>
              <h2 className="text-5xl font-bold">
                CREATE YOUR <span className="text-primary">RESUME</span>
              </h2>
              <p className="text-xl text-gray-600 uppercase tracking-wide mt-1">
                PROFESSIONAL JOBS DESERVE PROFESSIONAL <span className="text-primary">RESUME</span>
              </p>
            </div>

            <p className="text-black-700 text-xl test-style-Poppins">
              Build a resume that stands out from the crowd. It’s fast, customizable, and completely free.
            </p>

            <div className="pl-45">
              <Button
                onClick={() => navigate("/signup")}
                className="rounded bg-primary px-6 py-3 text-white hover:bg-primary/90"
              >
                Get started →
              </Button>
            </div>
          </div>

          <div className="flex-1 flex justify-center items-center">
            <img
              src="/images/ResumeBuilder.png"
              alt="Professional resume illustration"
              className="w-[600px] h-auto object-contain"
            />
          </div>

        </div>
      </div>


    </>
  );
};

export default LandingPage;
