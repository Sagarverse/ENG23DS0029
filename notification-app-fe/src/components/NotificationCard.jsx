import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import WorkOutlinedIcon from "@mui/icons-material/WorkOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

const TYPE_CONFIG = {
  Placement: {
    color: "#1565c0",
    bgUnread: "rgba(21, 101, 192, 0.06)",
    icon: <WorkOutlinedIcon sx={{ fontSize: 15 }} />,
    label: "Placement",
  },
  Result: {
    color: "#2e7d32",
    bgUnread: "rgba(46, 125, 50, 0.06)",
    icon: <SchoolOutlinedIcon sx={{ fontSize: 15 }} />,
    label: "Result",
  },
  Event: {
    color: "#e65100",
    bgUnread: "rgba(230, 81, 0, 0.06)",
    icon: <EventOutlinedIcon sx={{ fontSize: 15 }} />,
    label: "Event",
  },
};

function formatTimestamp(ts) {
  try {
    const d = new Date(ts.replace(" ", "T"));
    return d.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

export function NotificationCard({ notification, isRead, onToggleRead }) {
  const { ID, Type, Message, Timestamp } = notification;
  const cfg = TYPE_CONFIG[Type] || TYPE_CONFIG.Event;

  return (
    <Card
      variant="outlined"
      sx={{
        borderLeft: `4px solid ${isRead ? "#bdbdbd" : cfg.color}`,
        bgcolor: isRead ? "#fafafa" : cfg.bgUnread,
        opacity: isRead ? 0.75 : 1,
        transition: "all 0.25s ease",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-1px)",
        },
      }}
    >
      <CardContent sx={{ py: 1.5, px: 2, "&:last-child": { pb: 1.5 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          {/* Left content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
              <Chip
                icon={cfg.icon}
                label={cfg.label}
                size="small"
                sx={{
                  bgcolor: isRead ? "transparent" : cfg.color,
                  color: isRead ? cfg.color : "#fff",
                  border: isRead ? `1px solid ${cfg.color}` : "none",
                  fontWeight: 600,
                  fontSize: "0.7rem",
                  height: 22,
                  "& .MuiChip-icon": { color: isRead ? cfg.color : "#fff" },
                }}
              />
              {!isRead && (
                <Chip
                  label="NEW"
                  size="small"
                  sx={{
                    bgcolor: "#d32f2f",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.6rem",
                    height: 18,
                    letterSpacing: 0.5,
                  }}
                />
              )}
              <Typography variant="caption" sx={{ color: "text.secondary", ml: "auto" }}>
                {formatTimestamp(Timestamp)}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: isRead ? 400 : 600,
                color: "text.primary",
                lineHeight: 1.4,
              }}
            >
              {Message}
            </Typography>
          </Box>

          {/* Read/Unread button */}
          <Tooltip title={isRead ? "Mark as Unread" : "Mark as Read"} arrow>
            <IconButton
              size="small"
              onClick={() => onToggleRead(ID)}
              sx={{ color: isRead ? "text.disabled" : cfg.color, mt: -0.25 }}
            >
              {isRead ? (
                <MarkEmailUnreadOutlinedIcon fontSize="small" />
              ) : (
                <MarkEmailReadOutlinedIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
}
