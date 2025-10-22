import axios from "axios";

const API_URL = "http://localhost:5000/auth";

export const register = async (username, password) => {
  if (!username || !password) throw new Error("All fields are required");
  const res = await axios.post(
    `${API_URL}/register`,
    { username, password },
    { withCredentials: true }
  );
  return res.data;
};

export const login = async (username, password) => {
  if (!username || !password) throw new Error("All fields are required");
  const res = await axios.post(
    `${API_URL}/login`,
    { username, password },
    { withCredentials: true }
  );
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