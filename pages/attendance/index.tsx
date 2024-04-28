import React from "react";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "next/link";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import { Class } from "../../src/components/classes/types";
import fetcher from "../../utils/fetcher";

export default function Attendance() {
  const { data, error, isLoading } = useSWR("api/classes", fetcher);
  const classes = data || [];

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      {/* Use Grid here for margin and padding consistency with other pages */}
      <Grid container>
        <Typography variant="h6" gutterBottom>
          Attendance
        </Typography>
      </Grid>

      {/* Display LinearProgress inside the layout if still loading */}
      {isLoading && <LinearProgress />}

      {data && classes.length === 0 ? (
        <Card variant="outlined" sx={{ mt: 2, p: 2 }}>
          No student attendance records.
        </Card>
      ) : (
        classes.map((row: Class) => (
          <Link href={`billing/${row.id}`} key={row.id}>
            <Paper key={row.id} sx={{ my: 2, p: 2 }}>
              <Grid
                container
                spacing={2}
                direction="row"
                alignContent="center"
                justifyContent="space-between"
              >
                <Grid container item alignContent="center" xs={12} md="auto">
                  <Typography>{row.name}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Link>
        ))
      )}
    </>
  );
}
