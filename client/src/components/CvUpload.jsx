// src/components/CvUpload.jsx

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import useCvStore from "../store/cvStore";

const CvUpload = () => {
  // Get the upload action from our store
  const { uploadCv, isLoading, error } = useCvStore();

  // The onDrop function is memoized with useCallback to prevent unnecessary re-renders
  const onDrop = useCallback(
    (acceptedFiles) => {
      // react-dropzone gives us an array of files, we'll just take the first one.
      const file = acceptedFiles[0];
      if (file) {
        uploadCv(file);
      }
    },
    [uploadCv]
  );

  // This is the main hook from react-dropzone
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "application/pdf": [".pdf"], // Only accept PDF files
      },
      maxSize: 5 * 1024 * 1024, // 5MB size limit
    });

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors
                    ${isDragReject ? "border-red-500 bg-red-900/30" : ""}
                    ${
                      isDragActive
                        ? "border-yellow-400 bg-yellow-900/20"
                        : "border-indigo-600 hover:bg-indigo-900/20"
                    }
                `}
      >
        <input {...getInputProps()} />
        {isDragReject ? (
          <p className="text-red-400">
            Invalid file type. Please upload a PDF.
          </p>
        ) : isDragActive ? (
          <p className="text-yellow-300">Drop the CV here to upload...</p>
        ) : (
          <p className="text-gray-400">
            Drag & drop a CV here, or click to select a file (PDF, max 5MB)
          </p>
        )}
      </div>
      {/* Display loading or error states from the store */}
      {isLoading && (
        <p className="text-center text-yellow-300 mt-2">Uploading...</p>
      )}
      {error && <p className="text-center text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default CvUpload;
