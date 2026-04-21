import { useEffect, useState } from "react";
//componente que mostra o status do frontend, backend e banco de dados
export default function StatusLed() {
    const BASE_URL = "http://localhost:3000";
    const [status, setStatus] = useState({
  frontend: "ok",
  backend: "loading",
  db: "loading",
});
  //checagem do backend
  const checkBackend = async () => {
  try {
    const res = await fetch("http://localhost:3000/health");
    const data = await res.json();
    return data.backend === true;
  } catch {
    return false;
  }
};
//checagem do banco de dados
const checkDb = async () => {
  try {
    const res = await fetch("http://localhost:3000/health/db");
    const data = await res.json();
    return data.db === true;
  } catch {
    return false;
  }
};
useEffect(() => {
  const run = async () => {
    setStatus(s => ({
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
//componente que mostra o status do frontend, backend e banco de dados
  const Led = ({ state }) => {
  const color =
    state === "ok" ? "green" :
    state === "loading" ? "yellow" :
    "red";
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
  //retorno do componente
  return (
    <div style={{ display: "flex", gap: 20, padding: 10 }}>
      <div><Led state={status.frontend} /> Frontend</div>
      <div><Led state={status.backend} /> Backend</div>
      <div><Led state={status.db} /> Banco de dados</div>
    </div>
  );
}