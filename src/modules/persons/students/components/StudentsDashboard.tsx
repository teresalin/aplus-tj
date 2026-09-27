"use client";

import { useRouter } from "next/navigation";
import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from "@mui/icons-material/AddBox";

import BaseDataGrid from "@/components/DataGrid";
import FormDialog from "@/components/FormDialog";
import { useApiMutation } from "@/hooks/use-api-mutation";
import type { Grade } from "@/modules/grades";
import type { StudentSummary } from "@/modules/persons/students";
import PersonsTabs from "../../PersonsTabs";
import {
  getTogglablePersonColumns,
  personColumnVisibility,
  personColumns,
} from "../../components/personColumns";
import StudentFormFields, {
  emptyStudentFormValues,
  toStudentPayload,
  type StudentFormValues,
} from "./StudentFormFields";

const columns = personColumns<StudentSummary>();

export default function StudentsDashboard({
  students,
  grades,
}: {
  students: StudentSummary[];
  grades: Grade[];
}) {
  const router = useRouter();
  const mutate = useApiMutation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);

  const handleCreateStudent = async (values: StudentFormValues) => {
    const created = await mutate({
      method: "POST",
      url: "/api/persons/students",
      body: toStudentPayload(values),
      successMessage: "Student created successfully",
    });
    if (created) setIsCreateDialogOpen(false);
  };

  const toolbarButtons = (
    <IconButton
      aria-label="Add student"
      onClick={() => setIsCreateDialogOpen(true)}
      color="primary"
    >
      <AddBoxIcon />
    </IconButton>
  );

  return (
    <>
      <Box sx={{ width: "100%", height: "auto", overflow: "auto" }}>
        <PersonsTabs />
        <BaseDataGrid
          data={students}
          columns={columns}
          onRowClick={(params) =>
            router.push(`/persons/students/${params.id}/details`)
          }
          getTogglableColumns={getTogglablePersonColumns}
          initialColumnVisibilityModel={personColumnVisibility}
          additionalToolbarButtons={toolbarButtons}
        />
      </Box>
      <FormDialog
        open={isCreateDialogOpen}
        title="New Student"
        initialValues={emptyStudentFormValues}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={handleCreateStudent}
      >
        {(values, setValues) => (
          <StudentFormFields
            student={values}
            setFormData={setValues}
            grades={grades}
          />
        )}
      </FormDialog>
    </>
  );
}
