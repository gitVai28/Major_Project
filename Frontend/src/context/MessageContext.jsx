// src/context/MessageContext.jsx
import React, { createContext, useContext } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
  const { token } = useAuth();
  const API_BASE = "http://localhost:5000/api/messages";

  // Send message to participants
  const sendMessage = async (eventId, subject, message) => {
    if (!token) return alert("Login first!");
    try {
      const res = await axios.post(
        `${API_BASE}/${eventId}/message`,
        { subject, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Message sent to ${res.data.sentTo} participants!`);
      return res.data;
    } catch (err) {
      console.error("Error sending message:", err);
      throw err;
    }
  };

  return (
    <MessageContext.Provider value={{ sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => useContext(MessageContext);
