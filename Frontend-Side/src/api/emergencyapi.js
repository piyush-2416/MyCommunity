import client from "./client";

export const getEmergencies = () => client.get("/Emergency");

// Server body deta hai: { success, message, data }
export const emergencyApi = {
  getAll: () => client.get("/Emergency").then((r) => r.data),
  getOne: (id) => client.get(`/Emergency/${id}`).then((r) => r.data),
  create: (data) => client.post("/Emergency", data).then((r) => r.data),
  update: (id, data) => client.put(`/Emergency/${id}`, data).then((r) => r.data),
  remove: (id) => client.delete(`/Emergency/${id}`).then((r) => r.data),
  resolve: (id) =>
    client.patch(`/Emergency/${id}/status`, { status: "resolved" }).then((r) => r.data),
  respond: (id) => client.post(`/Emergency/${id}/respond`).then((r) => r.data),
};