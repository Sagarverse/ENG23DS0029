import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const TYPES = ["All", "Placement", "Result", "Event"];

export function NotificationFilter({ value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={(_, val) => {
        if (val !== null) onChange(val);
      }}
      size="small"
      sx={{
        gap: 0.5,
        flexWrap: "wrap",
        "& .MuiToggleButtonGroup-grouped": {
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "20px !important",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "0.8rem",
          px: 2,
          py: 0.5,
          "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "#fff",
            borderColor: "primary.main",
            "&:hover": { bgcolor: "primary.dark" },
          },
        },
      }}
    >
      {TYPES.map((t) => (
        <ToggleButton key={t} value={t}>
          {t}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}