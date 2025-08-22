// src/store/authStore.js

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "../lib/api"; // Corrected the import to be a default import

export default create(
  persist(
    immer((set) => ({
      // --- STATE ---
      isAuthenticated: false,
      user: null,
      token: null,
      error: null,
      isLoading: false,

      // --- ACTIONS ---
      login: async (email, password) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await api.post("/login", { email, password });
          // Assuming the backend returns 'user' and 'access_token'
          const { access_token, user } = response.data;

          set((state) => {
            state.isAuthenticated = true;
            state.token = access_token;
            state.user = user || { email };
            state.isLoading = false;
          });

          return true;
        } catch (err) {
          const errorMessage =
            err.response?.data?.message || "Login failed. Please try again.";

          set((state) => {
            state.error = errorMessage;
            state.isLoading = false;
          });

          return false;
        }
      },

      logout: () => {
        set((state) => {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          state.error = null;
        });
      },

      register: async (firstName, lastName, email, password) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });
        try {
          // We just make the API call and don't need to get the response data.
          await api.post("/register", {
            firstName,
            lastName,
            email,
            password,
          });

          // --- CHANGE ---
          // We no longer set the user as authenticated here.
          // We just set loading to false and return success.
          set((state) => {
            state.isLoading = false;
          });
          return true;

        } catch (err) {
          const errorMessage =
            err.response?.data?.message ||
            "Registration failed. Please try again.";
          set((state) => {
            state.error = errorMessage;
            state.isLoading = false;
          });
          return false;
        }
      },
      setAuth: ({ token, user }) => {
        set((state) => {
          state.isAuthenticated = true;
          state.token = token;
          state.user = user;
          state.error = null;
          state.isLoading = false;
        });
      },
    })),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);