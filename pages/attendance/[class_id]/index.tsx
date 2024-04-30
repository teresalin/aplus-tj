import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";
import Typography from "@mui/material/Typography";
import useSWR from "swr";

import fetcher from "../../../utils/fetcher";

export default function Attendance() {
  const classID = useRouter().query.class_id;
  const { data, isLoading, error } = useSWR(
    classID ? `/api/attendance/${classID}` : null,
    fetcher
  );
  const attendance = data || [];

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

      {isLoading && <LinearProgress />}

      {data &&
        attendance.map((a) => (
          <Box m={1}>
            <Typography>{a.class_name}</Typography>
            <Typography>
              {a.student_name} (ID: {a.student_id})
            </Typography>
            <Typography>SCHEDULED DATE: {a.scheduled_date}</Typography>
            <Typography>ACTUAL DATE: {a.actual_date}</Typography>
            <Typography>{a.attended ? "true" : "false"}</Typography>
          </Box>
        ))}
    </>
  );
}
