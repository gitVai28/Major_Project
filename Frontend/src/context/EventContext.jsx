import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axiosConfig"; // ✅ uses your configured axios instance

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch all events from backend on load
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await api.get("/events"); // 👈 match your backend route
        setEvents(res.data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to fetch events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // ✅ Post a new event (Organizer)
  const addEvent = async (newEvent) => {
    try {
      const res = await api.post("/events", newEvent);
      const createdEvent = res.data;

      setEvents((prev) => [createdEvent, ...prev]);

      // 🧠 Simulate sending emails to participants (mock)
      showToast(`📧 Email sent to all participants about "${createdEvent.title}"`);
    } catch (err) {
      console.error("Error posting event:", err);
      showToast("❌ Failed to post event", true);
    }
  };

  // ✅ Apply for an event (Participant)
  const applyForEvent = async (eventId) => {
    try {
      await api.post(`/events/${eventId}/apply`);
      showToast("✅ Successfully applied for event!");
    } catch (err) {
      console.error("Error applying:", err);
      showToast("❌ Failed to apply", true);
    }
  };

  // ✅ Helper for showing toast notifications
  const showToast = (message, isError = false) => {
    const toast = document.createElement("div");
    toast.textContent = message;
    toast.className = `
      fixed bottom-5 right-5 z-[9999]
      ${isError ? "bg-red-500" : "bg-green-500"}
      text-white px-4 py-2 rounded-lg shadow-lg fade-in
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2500);
  };

  return (
    <EventContext.Provider
      value={{
        events,
        setEvents,
        addEvent,
        applyForEvent,
        loading,
        error,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
