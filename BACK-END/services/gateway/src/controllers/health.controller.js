import { catalogBase, legacyBase } from "../config.js";

async function fetchDbStatus(baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/health/db`, {
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.db === true;
  } catch {
    return false;
  }
}

async function fetchServiceHealth(baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function getHealth(req, res) {
  const [catalogOk, legacyOk, catalogDb, legacyDb] = await Promise.all([
    fetchServiceHealth(catalogBase),
    fetchServiceHealth(legacyBase),
    fetchDbStatus(catalogBase),
    fetchDbStatus(legacyBase),
  ]);

  const dbOk = catalogDb || legacyDb;

  res.json({
    backend: true,
    catalog: catalogOk,
    legacy: legacyOk,
    db: dbOk,
    status: catalogOk && legacyOk && dbOk ? "ok" : "degraded",
  });
}

export async function getDbHealth(req, res) {
  const [catalogDb, legacyDb] = await Promise.all([
    fetchDbStatus(catalogBase),
    fetchDbStatus(legacyBase),
  ]);

  const dbOk = catalogDb || legacyDb;

  res.json({
    db: dbOk,
    status: dbOk ? "ok" : "error",
  });
}
