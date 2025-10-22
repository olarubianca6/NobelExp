import axios from "axios";

axios.defaults.withCredentials = true;

const API_URL = "http://127.0.0.1:5000/auth";

export const register = async (username, password) => {
  const res = await axios.post(`${API_URL}/register`, { username, password }, { withCredentials: true });
  return res.data;
};

export const login = async (username, password) => {
  const res = await axios.post(`${API_URL}/login`, { username, password }, { withCredentials: true });
  return res.data;
};

export const logout = async () => {
  const res = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
  return res.data;
};

export const deleteAccount = async () => {
  const res = await axios.delete(`${API_URL}/delete`, { withCredentials: true });
  return res.data;
};