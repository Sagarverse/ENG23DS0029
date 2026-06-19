import { useState, useEffect, useCallback } from "react";
import { fetchNotifications } from "../api/notifications";
import { logMessage } from "../api/logging";

// ── Read/Unread persistence via localStorage ──
const STORAGE_KEY = "campus_notifications_read_ids";

function loadReadIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveReadIds(set) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
}

/**
 * Hook for the "All Notifications" page.
 * Fetches one page at a time from the API (limit ≤ 10).
 */
export function useNotifications(page = 1, limit = 10, filterType = "All") {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readIds, setReadIds] = useState(loadReadIds);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotifications({
        limit: Math.min(limit, 10),
        page,
        notification_type: filterType,
      });
      setNotifications(data.notifications ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterType]);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRead = useCallback((id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveReadIds(next);
      logMessage("info", "state", `Notification ${id} toggled read/unread`);
      return next;
    });
  }, []);

  const markAllRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      notifications.forEach((n) => next.add(n.ID));
      saveReadIds(next);
      return next;
    });
  }, [notifications]);

  return { notifications, loading, error, readIds, toggleRead, markAllRead, reload: load };
}

/**
 * Hook for the "Priority Inbox" page.
 * Fetches page 1 & page 2 (up to 20 notifications total),
 * then sorts client-side by weight + recency and returns top N unread.
 */
export function usePriorityNotifications(topN = 10, filterType = "All") {
  const [pool, setPool] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readIds, setReadIds] = useState(loadReadIds);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch two pages of 10 each to get a pool of up to 20 notifications
      const [page1, page2] = await Promise.all([
        fetchNotifications({ limit: 10, page: 1 }),
        fetchNotifications({ limit: 10, page: 2 }),
      ]);
      const all = [...(page1.notifications ?? []), ...(page2.notifications ?? [])];
      // dedupe by ID
      const unique = [...new Map(all.map((n) => [n.ID, n])).values()];
      setPool(unique);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleRead = useCallback((id) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveReadIds(next);
      logMessage("info", "state", `Priority notification ${id} toggled`);
      return next;
    });
  }, []);

  // ── Priority computation ──
  const TYPE_WEIGHT = { Placement: 3, Result: 2, Event: 1 };

  const priorityNotifications = pool
    .filter((n) => !readIds.has(n.ID)) // only unread
    .filter((n) => filterType === "All" || n.Type === filterType)
    .sort((a, b) => {
      const wA = TYPE_WEIGHT[a.Type] ?? 0;
      const wB = TYPE_WEIGHT[b.Type] ?? 0;
      if (wB !== wA) return wB - wA; // higher weight first
      return new Date(b.Timestamp) - new Date(a.Timestamp); // more recent first
    })
    .slice(0, topN);

  return { priorityNotifications, pool, loading, error, readIds, toggleRead, reload: load };
}
