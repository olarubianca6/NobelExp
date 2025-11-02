import { create } from "zustand";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export const useNobelStore = create((set) => ({
  prizes: [],
  total: 0,
  loading: false,
  error: null,

  fetchNobelPrizes: async (limit = 10, offset = 0) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`/api/nobel/?limit=${limit}&offset=${offset}`);
      const data = res.data?.data || [];
      const normalized = data.map((p) => ({
        ...p,
        _categoryLabel: p.category?.includes("/")
          ? decodeURIComponent(p.category.split("/").pop()).replace(/_/g, " ")
          : p.category || "",
      }));
      set({ prizes: normalized, loading: false });
    } catch (err) {
      set({
        error: err?.response?.data?.error || err?.message || "Failed to load prizes",
        loading: false,
      });
    }
  },

  fetchTotalCount: async () => {
    try {
      const res = await axios.get("/api/nobel/count");
      set({ total: res.data?.total || 0 });
    } catch {
      set({ total: 0 });
    }
  },
   fetchStatistics: async () => {
      try {
        set({ loading: true, error: null });
        const res = await axios.get("/api/nobel/stats");
        set({ stats: res.data, loading: false });
      } catch {
        set({
            error: "Failed to load statistics",
            loading: false,
            stats: null,
        });
      }
    },
}));
