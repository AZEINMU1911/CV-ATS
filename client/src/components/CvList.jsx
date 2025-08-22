import React from "react";
import CvListItem from "./CvListItem";

// We receive the array of 'cvs' as a prop
const CvList = ({ cvs }) => {
  if (cvs.length === 0) {
    return (
      <div className="text-center py-10 px-4 bg-gray-800/50 rounded-lg">
        <p className="text-gray-400">You haven't uploaded any CVs yet.</p>
        <p className="text-gray-500 text-sm mt-2">
          Upload your first CV to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cvs.map((cv) => (
        <CvListItem key={cv.id} cv={cv} />
      ))}
    </div>
  );
};

export default CvList;
