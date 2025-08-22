import React, { useEffect } from "react";
import useCvStore from "../store/cvStore";
import CvList from "../components/CvList";
import CvUpload from "../components/CvUpload";
import AnalysisModal from "../components/AnalysisModal";
import PdfPreviewModal from "../components/PdfPreviewModal";

const MainPage = () => {
  const { cvs, isLoading, error, fetchCvs } = useCvStore();

  useEffect(() => {
    fetchCvs();
  }, [fetchCvs]);

  const renderContent = () => {
    // We'll show the main loading indicator only on the initial fetch
    if (isLoading && cvs.length === 0) {
      return <p className="text-center text-gray-400">Loading your CVs...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500">Error: {error}</p>;
    }
    return <CvList cvs={cvs} />;
  };

  return (
    <div>
      <AnalysisModal />
      <PdfPreviewModal />
      <h1 className="text-4xl font-bold mb-8 text-yellow-300">My Dashboard</h1>

      {/* --- 2. ADD THE UPLOAD COMPONENT --- */}
      <CvUpload />

      <h2 className="text-2xl font-bold mb-4 text-white">My CVs</h2>
      {renderContent()}
    </div>
  );
};

export default MainPage;
