"use client";

import { GridColDef, GridColumnVisibilityModel } from "@mui/x-data-grid";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import BaseDataGrid from "@/components/DataGrid";
import {
  addWeeks,
  type AttendanceRow,
  type AttendanceStatus,
} from "@/modules/attendance";

const chipColors: Record<
  AttendanceStatus,
  { backgroundColor: string; color: string }
> = {
  Present: { backgroundColor: "#bef0cc", color: "#507b67" },
  Absent: { backgroundColor: "#f9e8e8", color: "#9f3d49" },
};

function renderChip(status: AttendanceStatus | undefined) {
  if (!status) return null;
  return (
    <Chip
      label={status}
      size="small"
      sx={{ height: "20px", width: 0.8 }}
      style={chipColors[status]}
    />
  );
}

const initialColumnVisibilityModel: GridColumnVisibilityModel = {
  id: false,
};

export default function WeeklyAttendanceGrid({
  classId,
  dates,
  rows,
}: {
  classId: string;
  dates: string[];
  rows: AttendanceRow[];
}) {
  const columns: GridColDef<AttendanceRow>[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 130 },
    ...dates.map(
      (date): GridColDef<AttendanceRow> => ({
        field: date,
        headerName: date,
        width: 130,
        valueGetter: ({ row }) => row.attendance[date],
        renderCell: ({ row }) => renderChip(row.attendance[date]),
      }),
    ),
  ];

  const weekHref = (weeks: number) =>
    `/attendance/${classId}?week=${addWeeks(dates[0], weeks)}`;

  return (
    <>
      <Stack direction="row" alignItems="center" spacing={1}>
        <IconButton
          aria-label="previous week"
          size="small"
          component={Link}
          href={weekHref(-1)}
        >
          <ArrowBackIosIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="overline">
          {dates[0]} - {dates[6]}
        </Typography>
        <IconButton
          aria-label="next week"
          size="small"
          component={Link}
          href={weekHref(1)}
        >
          <ArrowForwardIosIcon fontSize="inherit" />
        </IconButton>
      </Stack>
      <BaseDataGrid
        data={rows}
        columns={columns}
        initialColumnVisibilityModel={initialColumnVisibilityModel}
      />
    </>
  );
}
