import { create } from "zustand";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export const useLaureateStore = create((set) => ({
  laureate: null,
  loading: false,
  error: null,

  fetchLaureateById: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`/api/laureates/${id}`);
      set({ laureate: res.data[0], loading: false });
    } catch (err) {
      set({
        error:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load laureate",
        loading: false,
      });
    }
  },

  clearLaureate: () => set({ laureate: null, error: null }),
}));
