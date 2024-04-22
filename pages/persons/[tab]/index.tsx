// import { useRouter } from "next/router";
// import React from "react";
// import AddBoxIcon from "@mui/icons-material/AddBox";
// import Box from "@mui/material/Box";
// import Chip from "@mui/material/Chip";
// import CircularProgress from "@mui/material/CircularProgress";
// import dayjs from "dayjs";
// import IconButton from "@mui/material/IconButton";
// import Tab from "@mui/material/Tab";
// import Tabs from "@mui/material/Tabs";
// import useSWR from "swr";
// import {
//   DataGrid,
//   GridColDef,
//   GridColumnVisibilityModel,
//   GridRowHeightParams,
//   GridRowSelectionModel,
//   GridValueFormatterParams,
// } from "@mui/x-data-grid";

// import CustomToolBar from "../../../src/components/grid/CustomToolBar";
// import fetcher from "../../../utils/fetcher";
// import UpdateCreateStaffDialog from "../../../src/components/person/staff/forms/UpdateCreateStaffDialog";
// import UpdateCreateStudentDialog from "../../../src/components/person/student/forms/UpdateStudentDialog";
// import { Staff } from "../../../src/components/person/staff/types";
// import { Student } from "../../../src/components/person/student/types";

// function a11yProps(key: string) {
//   return {
//     id: `simple-tab-${key}`,
//     "aria-controls": `simple-tabpanel-${key}`,
//   };
// }

// const personTypes = ["students", "parents", "staffs"];

// export default function PersonGrid() {
//   const router = useRouter();
//   const [tab, setTab] = React.useState("students");
//   const [rowSelectionModel, setRowSelectionModel] =
//     React.useState<GridRowSelectionModel>([]);
//   const [columnVisibilityModel, setColumnVisibilityModel] =
//     React.useState<GridColumnVisibilityModel>({
//       detailPanel: true,
//       personId: false,
//       name: true,
//       gender: false,
//       phone: true,
//       email: true,
//       dateOfBirth: true,
//       active: true,
//       created: false,
//       action: true,
//     });
//   const [dialogOpen, setDialogOpen] = React.useState(false);
//   const [isCreateStudentDialogOpen, setIsCreateStudentDialogOpen] =
//     React.useState(false);
//   const [isCreateParentDialogOpen, setIsCreateParentDialogOpen] =
//     React.useState(false);
//   const [isCreateStaffDialogOpen, setIsCreateStaffDialogOpen] =
//     React.useState(false);
//   const [isUpdate, setIsUpdate] = React.useState(false);
//   const [rowToEdit, setRowToEdit] = React.useState({});
//   const [buttonEl, setButtonEl] = React.useState<HTMLButtonElement | null>(
//     null
//   );

//   const { data } = useSWR(`/api/persons/${tab}`, fetcher);
//   const [persons, setPersons] = React.useState([]);

//   React.useEffect(() => {
//     if (data) {
//       setPersons(data);
//     }
//   }, [data]);

//   const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
//     setTab(newValue);
//     // Define the route to navigate to based on the selected tab
//     let routeToNavigate = `/persons/${newValue}`; // Construct the new route
//     // Use the router to navigate to the selected route
//     router.push(routeToNavigate);
//   };

//   const handleAddButtonClick = () => {
//     setIsUpdate(false);
//     setRowToEdit({}); // Reset any data
//     openDialog();
//   };

//   const dialogStates = {
//     students: {
//       isOpen: isCreateStudentDialogOpen,
//       setIsOpen: setIsCreateStudentDialogOpen,
//     },
//     parents: {
//       isOpen: isCreateParentDialogOpen,
//       setIsOpen: setIsCreateParentDialogOpen,
//     },
//     staffs: {
//       isOpen: isCreateStaffDialogOpen,
//       setIsOpen: setIsCreateStaffDialogOpen,
//     },
//   };

//   React.useEffect(() => {
//     // Check the tab and set the dialog state accordingly
//     const dialogState = dialogStates[tab];
//     if (dialogState) {
//       setDialogOpen(dialogState.isOpen);
//     }
//   }, [tab, dialogStates]);

//   const openDialog = () => {
//     const tabState = dialogStates[tab];
//     if (tabState) {
//       tabState.setIsOpen(true);
//     }
//   };

//   const closeDialog = () => {
//     const tabState = dialogStates[tab];
//     if (tabState) {
//       tabState.setIsOpen(false);
//     }
//   };

//   const handleUpdateOrCreatePerson = async (data) => {
//     const url = isUpdate
//       ? `/api/persons/${tab}/${data.personId}`
//       : `/api/persons/${tab}/index`;
//     const method = isUpdate ? "PUT" : "POST";

//     const response = await fetch(url, {
//       method: method,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//     });

//     if (response.ok) {
//       closeDialog();
//     } else {
//       console.error("Error creating/updating user:", response.statusText);
//     }
//   };

//   // const handleCloseUpdateCreateStudentDialog = () => {
//   //   setIsCreateStudentDialogOpen(false);
//   //   setRowToEdit({});
//   // };
//   // const handleCloseUpdateCreateStaffDialog = () => {
//   //   setIsCreateStaffDialogOpen(false);
//   //   setRowToEdit({});
//   // };
//   // const handleCloseUpdateCreateParentDialog = () => {
//   //   setIsCreateParentDialogOpen(false);
//   //   setRowToEdit({});
//   // };

//   const onRowClick = (data: { personId: string }) => {
//     router.push(`/persons/[tab]/[id]`, `/persons/${tab}/${data.personId}`);
//   };

//   const getTogglableColumns = (columns: GridColDef[]) => {
//     return columns
//       .filter(
//         (column) =>
//           column.field !== "personId" &&
//           column.field !== "action" &&
//           column.field !== "detailPanel" &&
//           column.field !== "created"
//       )
//       .map((column) => column.field);
//   };

//   const onColumnVisibilityChange = (
//     model: React.SetStateAction<GridColumnVisibilityModel>
//   ) => {
//     let count = 0;
//     for (const key in model) {
//       if (model[key] === true) {
//         count++;
//       }
//     }
//     setColumnVisibilityModel(model);
//   };

//   function AddIconButton({ onClick }) {
//     return (
//       <IconButton
//         aria-label="Add box icon"
//         onClick={onClick}
//         color="primary"
//         sx={{ padding: "4px" }}
//       >
//         <AddBoxIcon />
//       </IconButton>
//     );
//   }

//   const renderChip = (params) => {
//     return params.value ? (
//       <Chip
//         // icon={<CheckIcon />}
//         label="Active"
//         size="small"
//         sx={{ height: "20px", paddingX: 1 }}
//         style={{ backgroundColor: "#bef0cc", color: "#507b67" }}
//       />
//     ) : (
//       <Chip
//         // icon={<CloseIcon />}
//         label="Inactive"
//         size="small"
//         sx={{ height: "20px" }}
//         style={{ backgroundColor: "#f9e8e8", color: "#9f3d49" }}
//       />
//     );
//   };

//   const columns: GridColDef[] = [
//     {
//       field: "personId",
//       headerName: "id",
//       minWidth: 50,
//       flex: 1,
//     },
//     {
//       field: "name",
//       headerName: "Name",
//       minWidth: 150,
//       flex: 1,
//     },
//     {
//       field: "gender",
//       headerName: "Gender",
//       minWidth: 100,
//       flex: 1,
//     },
//     {
//       field: "phone",
//       headerName: "Phone",
//       minWidth: 120,
//       flex: 1,
//     },
//     {
//       field: "email",
//       headerName: "Email",
//       minWidth: 200,
//       flex: 1,
//     },
//     {
//       field: "dateOfBirth",
//       headerName: "Date of Birth",
//       minWidth: 120,
//       flex: 1,
//       valueFormatter: (params: GridValueFormatterParams<Date>) => {
//         if (params.value == null) {
//           return "";
//         }
//         return dayjs(params.value).format("YYYY-MM-DD");
//       },
//     },
//     {
//       field: "active",
//       headerName: "Active",
//       minWidth: 100,
//       flex: 1,
//       renderCell: renderChip,
//     },
//     // TODO fix failed prop type warning
//     {
//       field: "created",
//       headerName: "Created On",
//       minWidth: 120,
//       flex: 1,
//       valueFormatter: (params: GridValueFormatterParams<Date>) => {
//         if (params.value == null) {
//           return "";
//         }
//         return dayjs(params.value).format("YYYY-MM-DD");
//       },
//     },
//     // {
//     //   field: "action",
//     //   headerName: "Action",
//     //   minWidth: 70,
//     //   maxWidth: 70,
//     //   flex: 1,
//     //   renderCell: (params) => (
//     //     <RenderMenu
//     //       onEditClick={() => handleEditClick(params.row)}
//     //       onDeleteClick={() => handleDeactivateClick(params.row)}
//     //     />
//     //   ),
//     // },
//   ];

//   if (!persons) return <CircularProgress />;

//   return (
//     <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
//       <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
//         <Tabs value={tab} onChange={handleTabChange} aria-label="users tabs">
//           {personTypes.map((key) => (
//             <Tab key={key} value={key} label={key} {...a11yProps(key)} />
//           ))}
//         </Tabs>
//       </Box>
//       <DataGrid
//         getRowId={(row) => row.personId}
//         autoHeight={true}
//         sx={{
//           width: "100%",
//           overflow: "hidden",
//           ".MuiDataGrid-cell:focus": {
//             outline: "none",
//           },
//           "& .MuiDataGrid-row:hover": {
//             cursor: "pointer",
//           },
//         }}
//         columnVisibilityModel={columnVisibilityModel}
//         onColumnVisibilityModelChange={(newModel) => {
//           onColumnVisibilityChange(newModel);
//         }}
//         rows={persons}
//         columns={columns}
//         rowSelectionModel={rowSelectionModel}
//         onRowClick={(params) => onRowClick(params.row)}
//         localeText={{
//           toolbarColumns: "",
//           toolbarFilters: "",
//           toolbarDensity: "",
//           toolbarExport: "",
//         }}
//         initialState={{
//           pagination: { paginationModel: { pageSize: 10 } },
//           columns: {
//             columnVisibilityModel: columnVisibilityModel,
//           },
//         }}
//         slots={{
//           toolbar: CustomToolBar,
//         }}
//         slotProps={{
//           panel: {
//             anchorEl: buttonEl,
//             placement: "bottom-end",
//           },
//           toolbar: {
//             children: <AddIconButton onClick={handleAddButtonClick} />,
//             setButtonEl,
//           },
//           columnsPanel: {
//             getTogglableColumns,
//           },
//         }}
//         pageSizeOptions={[5, 10, 25]}
//         hideFooterSelectedRowCount
//       />
//       {/* <UpdateCreateStudentDialog
//         isUpdate={isUpdate}
//         existingData={rowToEdit as Student}
//         open={isCreateStudentDialogOpen}
//         onClose={closeDialog}
//         onSubmit={handleUpdateOrCreatePerson}
//       />
//       <UpdateCreateStaffDialog
//         isUpdate={isUpdate}
//         existingData={rowToEdit as Staff}
//         open={isCreateStaffDialogOpen}
//         onClose={closeDialog}
//         onSubmit={handleUpdateOrCreatePerson}
//       /> */}
//       {/* <DeactivateStudentDialog
//         open={isDeactivateDialogOpen}
//         onClose={handleCloseDeactivateDialog}
//         onSubmit={handleDeactivatePerson}
//       /> */}
//     </Box>
//   );
// }
