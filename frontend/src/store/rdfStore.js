import { create } from "zustand"
import axios from "axios"

axios.defaults.baseURL = "http://localhost:5000"
axios.defaults.withCredentials = true

const RDF_BASE = "/api/rdf"

export const useRdfStore = create((set, get) => ({
  likes: [],
  turtle: "",
  sparqlResult: "",
  loading: false,
  error: null,

  fetchLikes: async () => {
    try {
      set({ loading: true, error: null })
      const res = await axios.get(`${RDF_BASE}/likes`)
      set({ likes: res.data?.data || [], loading: false })
    } catch (err) {
      set({
        error: err?.response?.data?.error || err?.message || "Failed to load likes",
        loading: false,
      })
    }
  },

  addLike: async ({ objectUri, kind }) => {
    try {
      set({ loading: true, error: null })
      await axios.post(`${RDF_BASE}/likes`, { uri: objectUri, kind })
      await get().fetchLikes()
      set({ loading: false })
    } catch (err) {
      set({
        error: err?.response?.data?.error || err?.message || "Failed to add like",
        loading: false,
      })
      throw err
    }
  },

  removeLike: async (objectUri) => {
    try {
      set({ loading: true, error: null })
      const params = new URLSearchParams({ uri: objectUri })
      await axios.delete(`${RDF_BASE}/likes?${params.toString()}`)
      await get().fetchLikes()
      set({ loading: false })
    } catch (err) {
      set({
        error: err?.response?.data?.error || err?.message || "Failed to remove like",
        loading: false,
      })
      throw err
    }
  },
}))
