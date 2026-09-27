"use client";

import React, { useState } from "react";
import { Box, Typography, TextField, Button } from "@mui/material";

import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import { apiRequest, getErrorMessage } from "@/lib/api/client";

interface NameFormProps {
  title: string;
  label: string;
  endpoint: string;
  successMessage: string;
}

/** A single-field form that creates a named record (a grade or a role). */
function CreateByNameForm({
  title,
  label,
  endpoint,
  successMessage,
}: NameFormProps) {
  const notify = useSnackbar();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiRequest(endpoint, "POST", { name: name.trim() });
      notify(successMessage);
      setName("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="section" mt={4}>
      <Typography variant="h6" gutterBottom>
        {title}
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
          label={label}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}
        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Adding…" : title}
        </Button>
      </Box>
    </Box>
  );
}

export default function GeneralSettingsForm() {
  return (
    <Box>
      <CreateByNameForm
        title="Add Grade"
        label="Grade Name"
        endpoint="/api/grades"
        successMessage="Grade added successfully!"
      />
      <CreateByNameForm
        title="Add Role"
        label="Role Name"
        endpoint="/api/persons/roles"
        successMessage="Role added successfully!"
      />
    </Box>
  );
}
