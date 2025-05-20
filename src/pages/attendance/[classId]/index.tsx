import { useRouter } from "next/router";
import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import useSWR from "swr";
import utc from "dayjs/plugin/utc";

import fetcher from "../../../../utils/fetcher";
import BaseDataGrid from "../../../components/DataGrid";

dayjs.extend(utc);

// Generate dates for the current week based on startDate
const generateWeekDates = (startDate) => {
  const start = dayjs(startDate).startOf("week"); // This assumes the week starts on Sunday
  return Array.from({ length: 7 }, (_, index) =>
    start.add(index, "day").format("YYYY-MM-DD")
  );
};

export default function Attendance() {
  const router = useRouter();
  const classID = router.query.class_id;

  const [dates, setDates] = useState(() => generateWeekDates(dayjs()));
  const [startDate, setStartDate] = React.useState(dayjs());

  const { data, isLoading, error } = useSWR(
    classID ? `/api/attendance/${classID}?start_date=${startDate}` : null,
    fetcher
  );

  //   const attendance = data || [];
  const attendance = React.useMemo(() => {
    const attendanceByStudent = {};

    data?.forEach((item) => {
      const { student_id, student_name, actual_date, attended } = item;
      // Convert and format actual_date from UTC to a simple date string
      const formattedDate = dayjs(actual_date).utc().format("YYYY-MM-DD");

      if (!attendanceByStudent[student_id]) {
        attendanceByStudent[student_id] = {
          id: student_id,
          name: student_name,
        };
        dates.forEach((date) => {
          attendanceByStudent[student_id][date] = ""; // Initialize with no attendance
        });
      }
      attendanceByStudent[student_id][formattedDate] = attended
        ? "Present"
        : "Absent";
    });

    return Object.values(attendanceByStudent);
  }, [data, dates]);

  useEffect(() => {
    setDates(generateWeekDates(startDate));
  }, [startDate]);

  const handlePreviousWeek = () => {
    setStartDate((currentDate) => dayjs(currentDate).subtract(1, "week"));
  };

  const handleNextWeek = () => {
    setStartDate((currentDate) => dayjs(currentDate).add(1, "week"));
  };

  const renderChip = (attendance) => {
    if (attendance === "Present") {
      return (
        <Chip
          label="Present"
          size="small"
          sx={{ height: "20px", width: 0.8 }}
          style={{ backgroundColor: "#bef0cc", color: "#507b67" }}
        />
      );
    } else if (attendance === "Absent") {
      return (
        <Chip
          label="Absent"
          size="small"
          sx={{ height: "20px", width: 0.8 }}
          style={{ backgroundColor: "#f9e8e8", color: "#9f3d49" }}
        />
      );
    }
    // Return null or undefined if attendance is blank
    return null;
  };

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    ...dates.map((date) => ({
      field: date,
      headerName: date,
      width: 130,
      renderCell: (params) => renderChip(params.row[date]), // Assume you want to use renderChip or similar for these cells
    })),
  ];

  const getTogglableColumns = (columns: GridColDef[]) => {
    return columns
      .filter(
        (column) =>
          column.field !== "personId" &&
          column.field !== "action" &&
          column.field !== "detailPanel" &&
          column.field !== "created"
      )
      .map((column) => column.field);
  };

  const initialColumnVisibilityModel: GridColumnVisibilityModel = {
    detailPanel: true,
    personId: false,
    name: true,
    gender: false,
    phone: true,
    email: true,
    dateOfBirth: true,
    active: true,
    created: false,
    action: true,
  };

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
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton
            aria-label="delete"
            size="small"
            onClick={handlePreviousWeek}
          >
            <ArrowBackIosIcon fontSize="inherit" />
          </IconButton>
          <Typography variant="overline">
            {dates[0]} - {dates[6]}
          </Typography>
          <IconButton aria-label="delete" size="small" onClick={handleNextWeek}>
            <ArrowForwardIosIcon fontSize="inherit" />
          </IconButton>
        </Stack>
        <BaseDataGrid
          data={attendance}
          columns={columns}
          isLoading={isLoading}
          getTogglableColumns={getTogglableColumns}
          initialColumnVisibilityModel={initialColumnVisibilityModel}
        />
      </Box>
    </>
  );
}
