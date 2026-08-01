import API from "./api";

// Register User
export const register = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login User
export const login = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};