import { GridColDef } from "@mui/x-data-grid"; // Make sure to import the correct type

export function generateColumns(apiData: any): GridColDef[] {
  let columns: GridColDef[] = [];
  if (apiData.length > 0) {
    const item = apiData[0];
    if ("name" in item) {
      columns.push({
        field: "name",
        headerName: "姓名",
        minWidth: 100,
        flex: 1,
      });
    }
    if ("englishName" in item) {
      columns.push({
        field: "englishName",
        headerName: "英文名",
        minWidth: 100,
        flex: 1,
      });
    }
    if ("gender" in item) {
      columns.push({
        field: "gender",
        headerName: "Gender",
        minWidth: 100,
        flex: 1,
      });
    }
    if ("phone" in item) {
      columns.push({
        field: "phone",
        headerName: "手機",
        minWidth: 120,
        flex: 1,
      });
    }
    if ("email" in item) {
      columns.push({
        field: "email",
        headerName: "Email",
        minWidth: 150,
        flex: 1,
      });
    }
    if ("dateOfBirth" in item) {
      columns.push({
        field: "dateOfBirth",
        headerName: "出生日期",
        minWidth: 120,
        flex: 1,
      });
    }
    if ("startDate" in item) {
      columns.push({
        field: "startDate",
        headerName: "課程開始日期",
        minWidth: 120,
        flex: 1,
      });
    }
    if ("currentSchool" in item) {
      columns.push({
        field: "currentSchool",
        headerName: "現讀學校",
        minWidth: 300,
        flex: 1,
      });
    }
    if ("grade" in item) {
      columns.push({
        field: "grade",
        headerName: "年級",
        minWidth: 100,
        flex: 1,
      });
    }
    if ("textbookPublisher" in item) {
      columns.push({
        field: "textbookPublisher",
        headerName: "課本",
        minWidth: 100,
        flex: 1,
      });
    }
    if ("joinDate" in item) {
      columns.push({
        field: "joinDate",
        headerName: "開始日期",
        minWidth: 120,
        flex: 1,
      });
    }
    if ("leaveDate" in item) {
      columns.push({
        field: "leaveDate",
        headerName: "離開日期",
        minWidth: 120,
        flex: 1,
      });
    }
    if ("active" in item) {
      columns.push({
        field: "active",
        headerName: "Active",
        minWidth: 100,
        flex: 1,
      });
    }
  }

  return columns;
}
