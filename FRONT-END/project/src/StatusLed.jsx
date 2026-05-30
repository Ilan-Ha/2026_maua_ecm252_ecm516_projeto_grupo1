import { useEffect, useState } from "react";
import { apiBase } from "./config.jsx";

export default function StatusLed() {
  const [status, setStatus] = useState({
    frontend: "ok",
    backend: "loading",
    db: "loading",
  });

  const checkBackend = async () => {
    try {
      const res = await fetch(`${apiBase}/health`);
      const data = await res.json();
      return data.backend === true;
    } catch {
      return false;
    }
  };

  const checkDb = async () => {
    try {
      const res = await fetch(`${apiBase}/health/db`);
      const data = await res.json();
      return data.db === true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const run = async () => {
      setStatus((s) => ({
        ...s,
        backend: "loading",
        db: "loading",
      }));
      const backendOk = await checkBackend();
      const dbOk = await checkDb();
      setStatus({
        frontend: "ok",
        backend: backendOk ? "ok" : "error",
        db: dbOk ? "ok" : "error",
      });
    };
    run();
    const interval = setInterval(run, 5000);
    return () => clearInterval(interval);
  }, []);

  const Led = ({ state }) => {
    const color =
      state === "ok" ? "green" : state === "loading" ? "yellow" : "red";
    return (
      <span
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          display: "inline-block",
          marginRight: 8,
          backgroundColor: color,
        }}
      />
    );
  };

  return (
    <div style={{ display: "flex", gap: 20, padding: 10 }}>
      <div>
        <Led state={status.frontend} /> Frontend
      </div>
      <div>
        <Led state={status.backend} /> Backend
      </div>
      <div>
        <Led state={status.db} /> Banco de dados
      </div>
    </div>
  );
}
