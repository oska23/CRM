import axios from "axios";
import { getCurrentUser } from "./authService";

const API_URL = "http://localhost:3001";

const authHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
};

export const getCustomers = async () => {
  return await axios.get(`${API_URL}/customers`, { headers: authHeader() });
};

export const updateCustomer = async (id, data) => {
  return await axios.put(`${API_URL}/customers/${id}`, data, {
    headers: authHeader(),
  });
};

export const addComplaint = async (complaintData) => {
  const response = await axios.post(
    "http://localhost:3001/complaints",
    complaintData
  );
  return response.data;
};

// other service functions...
