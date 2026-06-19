import { getAuthToken, invalidateToken } from "./config";
import { logMessage } from "./logging";

const BASE_URL = "http://4.224.186.213/evaluation-service/notifications";

/**
 * Fetches notifications from the API.
 * Supports optional query params: limit (max 10), page, notification_type.
 * Automatically retries once with a fresh token on 401.
 */
export async function fetchNotifications({ limit, page, notification_type } = {}) {
  const url = new URL(BASE_URL);
  if (limit) url.searchParams.set("limit", String(Math.min(limit, 10)));
  if (page) url.searchParams.set("page", String(page));
  if (notification_type && notification_type !== "All") {
    url.searchParams.set("notification_type", notification_type);
  }

  const doFetch = async (retry = false) => {
    const token = await getAuthToken();
    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401 && !retry) {
      invalidateToken();
      return doFetch(true); // one retry with fresh token
    }

    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }

    return res.json();
  };

  try {
    const data = await doFetch();
    // fire-and-forget log (non-blocking)
    logMessage("debug", "api", `Fetched ${data?.notifications?.length ?? 0} notifications`);
    return data;
  } catch (err) {
    logMessage("error", "api", err.message);
    throw err;
  }
}
