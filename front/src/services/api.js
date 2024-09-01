// src/services/api.js

import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL; // Ensure you have REACT_APP_API_URL defined in your .env

export const fetchUsers = () => {
  return axios.get(`${API_URL}users`);
};

export const fetchUserById = (id) => {
  return axios.get(`${API_URL}users?id=${id}`);
};

export const createUser = (userData) => {
  return axios.post(`${API_URL}users`, userData);
};

export const updateUser = (id, userData) => {
  return axios.put(`${API_URL}users?id=${id}`, userData);
};

export const deleteUser = (id) => {
  return axios.delete(`${API_URL}users?id=${id}`);
};
