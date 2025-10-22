import axios from "axios";

const API_URL = "http://127.0.0.1:5000/api/nobel";

export async function fetchNobelPrizes() {
  const res = await axios.get(`${API_URL}/`, { withCredentials: true });
  return res.data;
}