
import React from "react";
import useAnalysisStore from "../store/analysisStore";

const AnalysisModal = () => {
  // Get all the necessary state and actions from the analysis store
  const { isModalOpen, analysisResult, isLoading, error, closeAnalysisModal } =
    useAnalysisStore();

  // If the modal isn't open, render nothing.
  if (!isModalOpen) {
    return null;
  }

  // Handle the content display
  const renderContent = () => {
    if (isLoading) {
      return <p className="text-center text-yellow-300">Loading analysis...</p>;
    }
    if (error) {
      return <p className="text-center text-red-400">Error: {error}</p>;
    }
    if (!analysisResult) {
      return (
        <p className="text-center text-gray-400">No analysis data available.</p>
      );
    }

    const { atsScore, feedback, keywords } = analysisResult;

    return (
      <>
        {/* Score Section */}
        <div className="text-center mb-6">
          <p className="text-gray-300 text-lg">ATS Compatibility Score</p>
          <p className="text-7xl font-bold text-yellow-300 my-2">{atsScore}</p>
          <p className="text-gray-400">
            A higher score increases your chances of passing the initial
            screening.
          </p>
        </div>

        {/* Feedback Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Positive Feedback */}
          <div className="bg-green-900/50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-300 mb-2">
              What You're Doing Well:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
              {feedback?.positive?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          {/* Areas for Improvement */}
          <div className="bg-red-900/50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-300 mb-2">
              Areas for Improvement:
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
              {feedback?.improvements?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Keywords Section */}
        <div>
          <h4 className="font-semibold text-yellow-300 mb-3 text-lg">
            Keyword Analysis
          </h4>
          <div className="bg-indigo-900/50 p-4 rounded-lg">
            <h5 className="font-semibold mb-2">Keywords Found in Your CV:</h5>
            <div className="flex flex-wrap gap-2 mb-4">
              {keywords?.extracted?.map((keyword) => (
                <span
                  key={keyword}
                  className="bg-blue-500/50 text-blue-200 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
            <h5 className="font-semibold mb-2">Suggested Keywords to Add:</h5>
            <div className="flex flex-wrap gap-2">
              {keywords?.missing?.map((keyword) => (
                <span
                  key={keyword}
                  className="bg-gray-600/50 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    // Modal Overlay
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={closeAnalysisModal} // Close modal if overlay is clicked
    >
      {/* Modal Content */}
      <div
        className="bg-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 rounded-2xl shadow-2xl border border-indigo-700"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-white">Analysis Report</h3>
          <button
            onClick={closeAnalysisModal}
            className="text-gray-400 hover:text-white"
          >
            &times; {/* A simple 'X' close button */}
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalysisModal;
