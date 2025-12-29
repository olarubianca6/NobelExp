import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:5000/auth";
axios.defaults.withCredentials = true; 

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  checkAuth: async () => {
    try {
      const res = await axios.get(`${API_URL}/check`);
      set({ user: res.data.user, isAuthenticated: true, loading: false });
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  register: async (mail, password) => {
    const res = await axios.post(`${API_URL}/register`, { mail, password });
    return res.data;
  },

  confirmEmail: async (token) => {
    const res = await axios.get(`${API_URL}/confirm/${token}`)
    return res.data
  },

  login: async (mail, password) => {
    const res = await axios.post(`${API_URL}/login`, { mail, password });
    set({ user: mail, isAuthenticated: true });
    return res.data;
  },

  logout: async () => {
    await axios.post(`${API_URL}/logout`, {});
    set({ user: null, isAuthenticated: false });
  },

  deleteAccount: async () => {
    const res = await axios.delete(`${API_URL}/delete`);
    set({ user: null, isAuthenticated: false });
    return res.data;
  },
}));
