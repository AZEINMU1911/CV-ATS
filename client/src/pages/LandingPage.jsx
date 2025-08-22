import React from "react";
import { useNavigate } from "react-router";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-black text-white p-4">
      <div className="text-center max-w-4xl">

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6">
          Welcome to <span className="text-yellow-300">CVATS</span>
        </h1>


        <p className="text-base sm:text-lg md:text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
          Your AI-powered CV analysis system. Build smarter applications and
          land your dream job 🚀
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <button
            onClick={() => navigate("/login")}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-white text-indigo-700 font-semibold shadow-lg hover:scale-105 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-yellow-400 text-gray-900 font-semibold shadow-lg hover:scale-105 transition"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
