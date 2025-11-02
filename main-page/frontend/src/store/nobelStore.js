import { create } from "zustand";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export const useNobelStore = create((set) => ({
  prizes: [],
  total: 0,
  loading: false,
  error: null,

  fetchNobelPrizes: async (limit = 10, offset = 0, category = "") => {
    try {
      set({ loading: true, error: null });
      const params = new URLSearchParams({ limit, offset });
      if (category && category !== "all") params.append("category", category);

      const res = await axios.get(`/api/nobel/?${params.toString()}`);
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
        error:
          err?.response?.data?.error ||
          err?.message ||
          "Failed to load prizes",
        loading: false,
      });
    }
  },

  fetchTotalCount: async (category = "all",) => {
    try {
        const params = new URLSearchParams();
        if (category && category !== "all") params.append("category", category);

        const res = await axios.get(`/api/nobel/count?${params.toString()}`);
        set({ total: res.data?.total || 0 });
    } catch (err) {
        console.error("Failed to fetch count:", err);
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
