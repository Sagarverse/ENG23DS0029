// ── Auth Configuration ──
// Credentials for the evaluation service
const AUTH_URL = "http://4.224.186.213/evaluation-service/auth";

const CREDENTIALS = {
  email: "eng23ds0029@dsu.edu.in",
  name: "SAGAR M",
  rollNo: "ENG23DS0029",
  accessCode: "BgWZSW",
  clientID: "35240c1c-8038-467f-b86c-fdf913092a06",
  clientSecret: "KCktYreVazKGepSw",
};

let cachedToken = null;
let tokenExpiry = 0;

/**
 * Fetches a fresh Bearer token from the auth endpoint.
 * Caches the token and only refreshes when it expires.
 */
export async function getAuthToken() {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 30s buffer)
  if (cachedToken && tokenExpiry > now + 30) {
    return cachedToken;
  }

  try {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(CREDENTIALS),
    });

    if (!res.ok) {
      throw new Error(`Auth failed: ${res.status}`);
    }

    const data = await res.json();
    cachedToken = data.access_token;
    tokenExpiry = data.expires_in || now + 600; // fallback 10 min
    return cachedToken;
  } catch (err) {
    console.error("Auth token fetch failed:", err);
    throw err;
  }
}

/**
 * Clears the cached token so the next call to getAuthToken() fetches fresh.
 */
export function invalidateToken() {
  cachedToken = null;
  tokenExpiry = 0;
}
