import type { Metadata } from "next";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export const metadata: Metadata = { title: "No access" };

/** Shown to signed-in users whose account has no staff role. */
export default function NoAccessPage() {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h6">No access</Typography>
      <Typography variant="body2">
        Your account is not authorized to use A Plus. Ask an administrator to
        grant you access, or sign in with a different account.
      </Typography>
      <Button href="/api/auth/signout" variant="outlined">
        Sign out
      </Button>
    </Stack>
  );
}
