"use client";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

import { formatDate } from "@/lib/dates";
import type { ClassDetail } from "@/modules/classes";

type Enrollment = ClassDetail["classStudents"][number];

const columns: GridColDef<Enrollment>[] = [
  {
    field: "name",
    headerName: "姓名",
    minWidth: 100,
    flex: 1,
    valueGetter: ({ row }) => row.student.person.name,
  },
  {
    field: "englishName",
    headerName: "英文名",
    minWidth: 100,
    flex: 1,
    valueGetter: ({ row }) => row.student.person.preferredName,
  },
  {
    field: "startDate",
    headerName: "開始日期",
    minWidth: 50,
    flex: 1,
    valueFormatter: ({ value }) => formatDate(value),
  },
  {
    field: "currentSchool",
    headerName: "現讀學校",
    minWidth: 300,
    flex: 1,
    valueGetter: ({ row }) => row.student.currentSchool,
  },
  {
    field: "textbookPublisher",
    headerName: "課本",
    minWidth: 100,
    flex: 1,
    valueGetter: ({ row }) => row.student.textbookPublisher,
  },
];

export default function ClassStudentsGrid({
  enrollments,
}: {
  enrollments: Enrollment[];
}) {
  return (
    <DataGrid
      getRowId={(row) => row.id}
      rows={enrollments}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 5,
          },
        },
      }}
      autoHeight={true}
      pageSizeOptions={[5]}
      disableRowSelectionOnClick
      density="compact"
    />
  );
}
