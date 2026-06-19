import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { usePriorityNotifications } from "../hooks/useNotifications";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationFilter } from "../components/NotificationFilter";

export function PriorityInboxPage() {
  const [filter, setFilter] = useState("All");
  const [topN, setTopN] = useState(10);

  const { priorityNotifications, loading, error, readIds, toggleRead, reload } =
    usePriorityNotifications(topN, filter);

  return (
    <Box>
      {/* Controls row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2,
        }}
      >
        <NotificationFilter value={filter} onChange={setFilter} />

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="topn-label">Show Top</InputLabel>
            <Select
              labelId="topn-label"
              value={topN}
              label="Show Top"
              onChange={(e) => setTopN(e.target.value)}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value={10}>Top 10</MenuItem>
              <MenuItem value={15}>Top 15</MenuItem>
              <MenuItem value={20}>Top 20</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title="Refresh" arrow>
            <IconButton size="small" onClick={reload}>
              <RefreshIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block" }}>
        Showing top {topN} unread notifications sorted by priority (Placement &gt; Result &gt; Event)
        then recency.
      </Typography>

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
      {!loading && !error && priorityNotifications.length === 0 && (
        <Alert severity="success" sx={{ borderRadius: 2 }}>
          All caught up! No unread priority notifications.
        </Alert>
      )}

      {/* List */}
      {!loading && !error && priorityNotifications.length > 0 && (
        <Stack spacing={1.5}>
          {priorityNotifications.map((n, idx) => (
            <Box key={n.ID} sx={{ position: "relative" }}>
              <Box
                sx={{
                  position: "absolute",
                  left: -28,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: idx < 3 ? "primary.main" : "grey.300",
                  color: idx < 3 ? "#fff" : "text.secondary",
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                }}
              >
                {idx + 1}
              </Box>
              <NotificationCard
                notification={n}
                isRead={readIds.has(n.ID)}
                onToggleRead={toggleRead}
              />
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}
