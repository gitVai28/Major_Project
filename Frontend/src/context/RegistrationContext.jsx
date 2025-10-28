// src/context/RegistrationContext.jsx
import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const RegistrationContext = createContext();

export const RegistrationProvider = ({ children }) => {
  const { token } = useAuth();
  const API_BASE = "http://localhost:5000/api/registrations";
  const [registrations, setRegistrations] = useState([]);

  // Register for event
  const registerForEvent = async (eventId) => {
    if (!token) return alert("Login first!");
    try {
      const res = await axios.post(
        `${API_BASE}/register`,
        { eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Successfully registered for event!");
      return res.data;
    } catch (err) {
      console.error("Error registering:", err);
      throw err;
    }
  };

  // Get participants list
  const getParticipants = async (eventId) => {
    if (!token) return [];
    try {
      const res = await axios.get(`${API_BASE}/${eventId}/participants`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRegistrations(res.data);
      return res.data;
    } catch (err) {
      console.error("Error fetching participants:", err);
      return [];
    }
  };

  return (
    <RegistrationContext.Provider value={{ registerForEvent, getParticipants, registrations }}>
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => useContext(RegistrationContext);
