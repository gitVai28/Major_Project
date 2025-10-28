import axios from "./axiosConfig";

export const getAllEvents = async () => {
  const res = await axios.get("/events");
  return res.data;
};

export const createEvent = async (eventData) => {
  const res = await axios.post("/events", eventData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await axios.delete(`/events/${id}`);
  return res.data;
};
