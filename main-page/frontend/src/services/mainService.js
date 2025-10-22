import axios from "axios";

const API_URL = "http://localhost:5000/main";

export const fetchItems = async () => {
  const res = await axios.get(`${API_URL}/data`, { withCredentials: true });
  return res.data;
};

export const addItem = async (name, value) => {
  if (!name || value === null) throw new Error("All fields are required");
  const res = await axios.post(`${API_URL}/data`, { name, value }, { withCredentials: true });
  return res.data;
};