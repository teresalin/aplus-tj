import type { Metadata } from "next";
import Grid from "@mui/material/Grid";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { requirePageAccess } from "@/lib/authz";
import { classService } from "@/modules/classes/class.service";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  await requirePageAccess();
  const classes = await classService.getOptions();

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          Billing
        </Typography>
      </Grid>
      {classes.length === 0 && (
        <Paper variant="outlined" sx={{ my: 2, p: 2 }}>
          No classes yet.
        </Paper>
      )}
      {classes.map((row) => (
        <Link href={`/billing/${row.id}`} key={row.id}>
          <Paper sx={{ my: 2, p: 2 }}>
            <Typography>{row.name}</Typography>
          </Paper>
        </Link>
      ))}
    </>
  );
}
