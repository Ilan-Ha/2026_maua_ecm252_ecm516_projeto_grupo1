const CATALOG_PREFIXES = ["/catalogo", "/produto"];

export function isCatalogRoute(path) {
  return CATALOG_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`)
  );
}

export async function forwardRequest(targetBase, req, res) {
  const url = `${targetBase}${req.originalUrl}`;

  const headers = { ...req.headers };
  delete headers.host;
  delete headers.connection;

  const options = {
    method: req.method,
    headers,
  };

  if (req.method !== "GET" && req.method !== "HEAD" && req.body !== undefined) {
    options.body =
      typeof req.body === "string" ? req.body : JSON.stringify(req.body);
    if (!headers["content-type"]) {
      headers["content-type"] = "application/json";
    }
  }

  const response = await fetch(url, options);
  const body = await response.text();

  res.status(response.status);
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "transfer-encoding") return;
    res.setHeader(key, value);
  });
  res.send(body);
}

export async function checkServiceHealth(baseUrl) {
  try {
    const res = await fetch(`${baseUrl}/health`, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return { ok: false, data: null };
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false, data: null };
  }
}
