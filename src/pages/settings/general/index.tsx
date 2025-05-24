import { NextPage } from "next";
import React, { ReactElement, ReactNode, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { SettingsLayout } from "../../../modules/settings/components/SettingsLayout";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

const GeneralSettingsPage: NextPageWithLayout = () => {
  // — form state
  const [gradeName, setGradeName] = useState("");
  const [roleName, setRoleName] = useState("");

  // — separate loading & error for each
  const [gradeLoading, setGradeLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [gradeError, setGradeError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);

  // — one snackbar with dynamic message
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const closeSnackbar = () => setSnackbarMessage(null);

  const handleGradeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGradeLoading(true);
    setGradeError(null);

    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: gradeName.trim() }),
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.message || "Failed to add grade");
      }

      setSnackbarMessage("Grade added successfully!");
      setGradeName("");
    } catch (err: any) {
      setGradeError(err.message);
    } finally {
      setGradeLoading(false);
    }
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRoleLoading(true);
    setRoleError(null);

    try {
      const res = await fetch("/api/persons/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: roleName.trim() }), // ← use roleName here
      });

      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.message || "Failed to add role");
      }

      setSnackbarMessage("Role added successfully!");
      setRoleName(""); // ← clear roleName, not gradeName
    } catch (err: any) {
      setRoleError(err.message);
    } finally {
      setRoleLoading(false);
    }
  };

  return (
    <Box>
      {/* ——— Add Grade Section ——— */}
      <Box component="section" mt={4}>
        <Typography variant="h6" gutterBottom>
          Add Grade
        </Typography>
        <Box
          component="form"
          onSubmit={handleGradeSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          maxWidth={400}
        >
          <TextField
            label="Grade Name"
            value={gradeName}
            onChange={(e) => setGradeName(e.target.value)}
            required
          />
          {gradeError && (
            <Typography color="error" variant="body2">
              {gradeError}
            </Typography>
          )}
          <Button type="submit" variant="contained" disabled={gradeLoading}>
            {gradeLoading ? "Adding…" : "Add Grade"}
          </Button>
        </Box>
      </Box>

      {/* ——— Add Role Section ——— */}
      <Box component="section" mt={4}>
        <Typography variant="h6" gutterBottom>
          Add Role
        </Typography>
        <Box
          component="form"
          onSubmit={handleRoleSubmit}
          display="flex"
          flexDirection="column"
          gap={2}
          maxWidth={400}
        >
          <TextField
            label="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            required
          />
          {roleError && (
            <Typography color="error" variant="body2">
              {roleError}
            </Typography>
          )}
          <Button type="submit" variant="contained" disabled={roleLoading}>
            {roleLoading ? "Adding…" : "Add Role"}
          </Button>
        </Box>
      </Box>

      {/* ——— Success Snackbar ——— */}
      <Snackbar
        open={Boolean(snackbarMessage)}
        autoHideDuration={4000}
        onClose={closeSnackbar}
      >
        <Alert
          onClose={closeSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

GeneralSettingsPage.getLayout = (page: ReactElement) => (
  <SettingsLayout>{page}</SettingsLayout>
);

export default GeneralSettingsPage;
