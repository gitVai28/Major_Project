import api from "./axiosConfig"; // ✅ this should already have baseURL + token interceptor

// Get all events
export const getAllEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

// Create new event (authenticated)
export const createEvent = async (formData) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/events", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// Delete event (only organizer)
export const deleteEvent = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
