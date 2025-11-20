import { useEffect } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useAlertsChannel = (onEvent) => {
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });
    if (onEvent) {
      socket.on("alert:updated", onEvent);
    }
    return () => {
      socket.disconnect();
    };
  }, [onEvent]);
};

