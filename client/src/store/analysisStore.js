import { create } from 'zustand';
import {api} from '../lib/api';

const useAnalysisStore = create((set) => ({
    // --- STATE ---
    isModalOpen: false,
    analysisResult: null,
    isLoading: false,
    error: null,

    // --- ACTIONS ---
    openAnalysisModal: (result) => set({
        isModalOpen: true,
        analysisResult: result,
        isLoading: false,
        error: null
    }),

    closeAnalysisModal: () => set({
        isModalOpen: false,
        analysisResult: null
    }),

    setLoading: (loadingState) => set({ isLoading: loadingState }),
    setError: (errorMessage) => set({ error: errorMessage, isLoading: false }),
    fetchLatestAnalysis: async (cvId) => {
        set({ isLoading: true, error: null, isModalOpen: true }); // Open modal and show loading
        try {
            const response = await api.get(`/analyze/${cvId}`);
            // The data we need is inside the JSON fields of the response
            const result = {
                atsScore: response.data.score,
                feedback: response.data.feedback,
                keywords: response.data.suggestions,
            };
            set({ analysisResult: result, isLoading: false });
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to fetch analysis.";
            set({ error: errorMessage, isLoading: false });
        }
    },
}));

export default useAnalysisStore;