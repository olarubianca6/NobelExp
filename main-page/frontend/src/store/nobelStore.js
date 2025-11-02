import { create } from "zustand";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";
axios.defaults.withCredentials = true;

export const useNobelStore = create((set, get) => ({
  prizes: [],
  stats: null,
  loading: false,
  error: null,

  // 🔹 Fetch all prizes
  fetchNobelPrizes: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get("/api/nobel/");
      const normalized = (res.data || []).map((p) => ({
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
          "Failed to load Nobel prizes",
        loading: false,
      });
    }
  },

  // 🔹 Compute statistics locally
  computeStats: () => {
    const data = get().prizes;
    if (!data.length) return null;

    const categories = {};
    let totalLaureates = 0;

    data.forEach((item) => {
      const cat = item.category;
      categories[cat] = (categories[cat] || 0) + 1;
      totalLaureates += item.laureates?.length || 0;
    });

    const sorted = Object.entries(categories).sort((a, b) => b[1] - a[1]);
    const stats = {
      totalPrizes: data.length,
      totalLaureates,
      categories: Object.fromEntries(sorted),
    };

    set({ stats });
    return stats;
  },
}));
