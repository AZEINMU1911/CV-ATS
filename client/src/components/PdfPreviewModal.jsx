// src/components/PdfPreviewModal.jsx

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import useUiStore from "../store/uiStore.js"; // <<< FIX #2: Corrected typo 'uiStrore' -> 'uiStore'

// --- FIX #1: REMOVED the two problematic CSS import lines ---
// Newer versions of react-pdf handle this differently. These imports are what caused the crash.

// --- FIX #3: Use a more robust, modern way to set up the PDF worker for Vite ---
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PdfPreviewModal = () => {
  const { isPdfModalOpen, pdfUrl, closePdfModal } = useUiStore();
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  if (!isPdfModalOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={closePdfModal}
    >
      <div
        className="bg-gray-800 w-full max-w-4xl h-[90vh] flex flex-col p-4 rounded-2xl shadow-2xl border border-indigo-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2 pb-2 border-b border-gray-600">
          <h3 className="text-xl font-bold text-white">CV Preview</h3>
          <button
            onClick={closePdfModal}
            className="text-gray-400 text-2xl hover:text-white"
          >
            &times;
          </button>
        </div>
        <div className="flex-grow overflow-y-auto">
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className="flex justify-center"
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderAnnotationLayer={false} // Updated for newer versions
                renderTextLayer={false} // Updated for newer versions
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
