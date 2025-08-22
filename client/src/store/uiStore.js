import { create } from 'zustand';

const useUiStore = create((set) => ({
    isPdfModalOpen: false,
    pdfUrl: null,

    openPdfModal: (url) => set({ isPdfModalOpen: true, pdfUrl: url }),
    closePdfModal: () => set({ isPdfModalOpen: false, pdfUrl: null }),
}));

export default useUiStore;