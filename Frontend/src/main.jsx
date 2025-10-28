import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// ✅ Import all providers
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import { RegistrationProvider } from "./context/RegistrationContext";
import { MessageProvider } from "./context/MessageContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <RegistrationProvider>
            <MessageProvider>
              <App />
            </MessageProvider>
          </RegistrationProvider>
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
