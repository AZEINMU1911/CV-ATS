import React from "react";
import useCvStore from "../store/cvStore";
import useAnalysisStore from "../store/analysisStore";
import useUiStore from "../store/uiStore";

const CvListItem = ({ cv }) => {
  const uploadedDate = new Date(cv.createdAt).toLocaleDateString();
  const { deleteCv, analyzeCv, analyzingCvId } = useCvStore();
  const fetchLatestAnalysis = useAnalysisStore(
    (state) => state.fetchLatestAnalysis
  );

  const openPdfModal = useUiStore((state) => state.openPdfModal);

  const isAnalyzing = analyzingCvId === cv.id;

  const handleDelete = () => {
    deleteCv(cv.id);
  };

  const handleAnalyze = () => {
    analyzeCv(cv.id);
  };

  const handleViewReport = () => {
    fetchLatestAnalysis(cv.id);
  };

  const handlePreview = () => {
    openPdfModal(cv.fileUrl);
  };

  return (
    <div className="bg-indigo-900/40 p-4 rounded-lg shadow-lg flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div className="text-center sm:text-left">
        <h3 className="font-bold text-lg text-white">{cv.originalName}</h3>
        <p className="text-sm text-gray-400">Uploaded on: {uploadedDate}</p>
        <p className="text-sm text-yellow-300 mt-1">
          Latest ATS Score: {cv.atsScore ? `${cv.atsScore}%` : "Not Analyzed"}
        </p>
      </div>

      <div className="flex flex-wrap justify-center sm:justify-end gap-2 shrink-0">
        {!isAnalyzing && !cv.atsScore && (
          <button
            onClick={handleAnalyze}
            className="px-4 py-2 w-28 text-sm font-semibold text-gray-900 bg-yellow-400 rounded-lg hover:bg-yellow-500 transition-opacity"
          >
            Analyze
          </button>
        )}
        {isAnalyzing && (
          <div className="px-4 py-2 w-28 text-center text-sm font-semibold text-yellow-200 bg-yellow-900/50 rounded-lg animate-pulse">
            Analyzing...
          </div>
        )}

        <button
          onClick={handlePreview}
          className="px-4 py-2 text-sm font-semibold text-white bg-gray-600 rounded-lg hover:bg-gray-700"
        >
          Preview
        </button>
        <button
          onClick={handleViewReport}
          disabled={!cv.atsScore}
          className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          View Report
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default CvListItem;
