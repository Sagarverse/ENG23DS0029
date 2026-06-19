import React, { useState } from "react";
import { Box, Paper, Typography, Tabs, Tab, Badge } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import InboxIcon from "@mui/icons-material/Inbox";
import StarIcon from "@mui/icons-material/Star";
import { AllNotificationsPage } from "./AllNotificationsPage";
import { PriorityInboxPage } from "./PriorityInboxPage";

export function NotificationsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: { xs: 1.5, sm: 3 }, py: { xs: 2, sm: 4 } }}>
      {/* Header banner */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3 },
          mb: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)",
          color: "#fff",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <NotificationsActiveIcon sx={{ fontSize: { xs: 28, sm: 34 } }} />
          <Box>
            <Typography variant="h5" fontWeight={800} sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}>
              Campus Notifications
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 0.25 }}>
              Placements · Results · Events
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{
          mb: 2.5,
          borderBottom: 1,
          borderColor: "divider",
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
        }}
      >
        <Tab icon={<InboxIcon />} iconPosition="start" label="All Notifications" />
        <Tab icon={<StarIcon />} iconPosition="start" label="Priority Inbox" />
      </Tabs>

      {/* Page content */}
      <Box sx={{ pl: { sm: 3.5 } }}>
        {tab === 0 && <AllNotificationsPage />}
        {tab === 1 && <PriorityInboxPage />}
      </Box>
    </Box>
  );
}
