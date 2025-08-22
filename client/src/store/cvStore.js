import useAnalysisStore from './analysisStore';
import { create } from 'zustand';
import { api } from '../lib/api';
import { toast } from 'react-toastify';

const useCvStore = create((set, get) => ({ // We need 'get' to call another action
    // --- STATE ---
    cvs: [],
    isLoading: false,
    error: null,
    analyzingCvId: null,

    // --- ACTIONS ---
    fetchCvs: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/cvs');
            set({ cvs: response.data, isLoading: false });
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to fetch CVs.";
            toast.error(errorMessage)
            set({ error: errorMessage, isLoading: false });
        }
    },
    uploadCv: async (file) => {
        set({ isLoading: true, error: null });
        try {
            // We use FormData to send a file to the backend
            const formData = new FormData();
            formData.append('cv', file);

            // Make the API call to the upload endpoint
            await api.post('/cvs/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            toast.success(`Successfully uploaded "${file.name}"!`);

            get().fetchCvs();

        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to upload CV.";
            set({ error: errorMessage, isLoading: false });
        }
    }, deleteCv: async (cvId) => {
        try {
            // Call our new backend endpoint
            await api.delete(`/cvs/${cvId}`);
            toast.success("CV successfully deleted.");

            set((state) => ({
                cvs: state.cvs.filter((cv) => cv.id !== cvId),
            }));

        } catch (err) {
            console.error("Failed to delete CV:", err);
            const errorMessage = err.response?.data?.message || "Failed to delete CV.";
            set({ error: errorMessage });
        }
    }, analyzeCv: async (cvId) => {
        set({ analyzingCvId: cvId });
        useAnalysisStore.getState().setLoading(true);

        try {
            const response = await api.post(`/analyze/${cvId}`);
            useAnalysisStore.getState().openAnalysisModal(response.data);
            get().fetchCvs();
            toast.success("Analysis complete!");
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Failed to analyze CV.";
            toast.error(errorMessage);
            useAnalysisStore.getState().setError(errorMessage);
        } finally {
            set({ analyzingCvId: null });
        }
    },
}));

export default useCvStore;