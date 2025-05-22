import { NextPage } from "next";
import React, { FC, ReactElement, ReactNode, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import { SettingsLayout } from "../../../modules/settings/components/SettingsLayout";

const GeneralSettingsPage: FC & {
  getLayout?: (page: ReactElement) => ReactNode;
} = () => {
  const [gradeName, setGradeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: gradeName }),
      });
      if (!res.ok) throw new Error((await res.json()).message || "Failed");
      setSuccessOpen(true);
      setGradeName("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
          onSubmit={handleSubmit}
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
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            size="large"
          >
            {loading ? "Adding…" : "Add Grade"}
          </Button>
        </Box>
      </Box>

      {/* ——— Success Snackbar ——— */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Grade added!
        </Alert>
      </Snackbar>
    </Box>
  );
};

GeneralSettingsPage.getLayout = (page: ReactElement) => (
  <SettingsLayout>{page}</SettingsLayout>
);

export default GeneralSettingsPage;
