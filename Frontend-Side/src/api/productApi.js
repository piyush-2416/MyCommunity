import client from "./client";

export const getProducts = () => client.get("/products");

// Complaints CRUD (backend route: /api/Events). Server body deta hai: { success, message, data }
export const productApi = {
  getAll: () => client.get("/Events").then((r) => r.data),
  getOne: (id) => client.get(`/Events/${id}`).then((r) => r.data),
  create: (data) => client.post("/Events", data).then((r) => r.data),
  update: (id, data) => client.put(`/Events/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/Events/${id}`).then((r) => r.data),
};