"use client";
import { createContext, useContext, useState } from "react";

const LogContext = createContext<any>(null);

export function LogProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<string[]>([]);

  function addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev]);
  }

  return (
    <LogContext.Provider value={{ logs, addLog }}>
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  return useContext(LogContext);
}
