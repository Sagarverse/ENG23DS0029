import React, { useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  IconButton,
  Tooltip,
  Pagination,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";

export function AllNotificationsPage() {
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const LIMIT = 10;

  const { notifications, loading, error, readIds, toggleRead, markAllRead, reload } =
    useNotifications(page, LIMIT, filter);

  const handleFilterChange = (val) => {
    setFilter(val);
    setPage(1);
  };

  const unreadCount = notifications.filter((n) => !readIds.has(n.ID)).length;

  return (
    <Box>
      {/* Controls row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1,
          mb: 2,
        }}
      >
        <NotificationFilter value={filter} onChange={handleFilterChange} />
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Mark all as read" arrow>
            <span>
              <IconButton size="small" onClick={markAllRead} disabled={unreadCount === 0}>
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Refresh" arrow>
            <IconButton size="small" onClick={reload}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {!loading && error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Empty */}
      {!loading && !error && notifications.length === 0 && (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
          No notifications found.
        </Alert>
      )}

      {/* List */}
      {!loading && !error && notifications.length > 0 && (
        <>
          <Stack spacing={1.5}>
            {notifications.map((n) => (
              <NotificationCard
                key={n.ID}
                notification={n}
                isRead={readIds.has(n.ID)}
                onToggleRead={toggleRead}
              />
            ))}
          </Stack>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={4}
              page={page}
              onChange={(_, p) => setPage(p)}
              color="primary"
              shape="rounded"
            />
          </Box>
        </>
      )}
    </Box>
  );
}
