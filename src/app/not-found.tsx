import Button from "@mui/material/Button";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function NotFound() {
  return (
    <Stack spacing={2} alignItems="flex-start">
      <Typography variant="h6">Page not found</Typography>
      <Typography variant="body2">
        The page or record you are looking for does not exist.
      </Typography>
      <Button component={Link} href="/dashboard" variant="outlined">
        Go to dashboard
      </Button>
    </Stack>
  );
}
