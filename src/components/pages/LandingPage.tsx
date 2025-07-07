import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/pages/Header";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
    <Header isLoggedIn={false} />
    <div className="min-h-screen flex items-center justify-center px-6">
  <div className="flex flex-row items-center gap-12 max-w-screen-xl w-full">
    
    {/* Left Side */}
    <div className="flex-1 space-y-6">
      <div>
        <h1 className="text-5xl font-bold">
          CREATE YOUR <span className="text-[#1982C4]">RESUME</span>
        </h1>
        <p className="text-sm text-gray-600 uppercase tracking-wide mt-1">
          Professional jobs deserve professional <span className="text-[#1982C4]">resume</span>
        </p>
      </div>
      <p className="text-base text-gray-700">
        Build a resume that stands out from the crowd. It’s fast, customizable, and completely free.
      </p>
      <button
        onClick={() => navigate("/signup")}
        className="rounded bg-[#1982C4] px-6 py-3 text-white hover:bg-[#156a99]"
      >
        Get started →
      </button>
    </div>

    {/* Right Side */}
    <div className="flex-1 flex justify-center">
      <img
        src="/path-to-your-image.png"
        alt="Professional resume illustration"
        className="w-[400px] h-auto"
      />
    </div>

  </div>
</div>

    </>
  );
};

export default LandingPage;
