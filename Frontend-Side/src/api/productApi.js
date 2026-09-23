import axios from "axios";

const API_BASE = "http://localhost:3000/api/events";

export const productApi = {
  getAll: () => axios.get(API_BASE).then((r) => r.data),
  getOne: (id) => axios.get(`${API_BASE}/${id}`).then((r) => r.data),
  create: (data) => axios.post(API_BASE, data).then((r) => r.data),
  update: (id, data) => axios.put(`${API_BASE}/${id}`, data).then((r) => r.data),
  remove: (id) => axios.delete(`${API_BASE}/${id}`).then((r) => r.data),
};
