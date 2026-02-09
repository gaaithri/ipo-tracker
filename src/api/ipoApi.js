const BASE_URL = "http://127.0.0.1:8000/api"; // adjust if needed

export async function fetchIPOs() {
  const res = await fetch(`${BASE_URL}/ipos/`);
  if (!res.ok) throw new Error("Failed to fetch IPOs");
  return res.json();
}

export async function syncIPOs(days = 30, page = 1) {
  const res = await fetch(
    `${BASE_URL}/ipos/sync-from-api/?days=${days}&page=${page}`,
    {
      method: "POST",
    },
  );
  if (!res.ok) throw new Error("Failed to sync IPOs");
  return res.json();
}

export async function fetchSyncStats() {
  const res = await fetch(`${BASE_URL}/ipos/sync-stats/`);
  if (!res.ok) throw new Error("Failed to fetch sync stats");
  return res.json();
}

export async function fetchIPO(id) {
  const res = await fetch(`${BASE_URL}/ipos/${id}/`);
  if (!res.ok) throw new Error("Failed to fetch IPO");
  return res.json();
}

export async function createIPO(data) {
  const res = await fetch(`${BASE_URL}/ipos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create IPO");
  return res.json();
}

export async function updateIPO(id, data) {
  const res = await fetch(`${BASE_URL}/ipos/${id}/`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update IPO");
  return res.json();
}
