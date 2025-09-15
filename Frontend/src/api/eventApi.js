import api from "./axiosConfig";

export const getRoles = () => api.get("/home/roles");
export const applyRole = (id) => api.post(`/home/roles/${id}/apply`);
