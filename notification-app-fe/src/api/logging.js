import { getAuthToken } from "./config";

const LOGS_URL = "http://4.224.186.213/evaluation-service/logs";

/**
 * Sends a log message to the remote logging service.
 * Failures are silently caught so they never break app functionality.
 */
export async function logMessage(level, pkg, message) {
  try {
    const token = await getAuthToken();
    const res = await fetch(LOGS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        stack: "frontend",
        level: level || "info",
        package: pkg || "general",
        message: typeof message === "string" ? message : JSON.stringify(message),
      }),
    });

    if (!res.ok) {
      console.warn("[LogMiddleware] Log send failed:", res.status);
    }
  } catch {
    // Silently swallow — logging must never crash the app
  }
}
