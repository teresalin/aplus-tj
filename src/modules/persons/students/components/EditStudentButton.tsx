"use client";

import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

import FormDialog from "@/components/FormDialog";
import { useApiMutation } from "@/hooks/use-api-mutation";
import type { Grade } from "@/modules/grades";
import type { Student } from "@/modules/persons/students";
import StudentFormFields, {
  toStudentFormValues,
  toStudentPayload,
  type StudentFormValues,
} from "./StudentFormFields";

export default function EditStudentButton({
  student,
  grades,
}: {
  student: Student;
  grades: Grade[];
}) {
  const mutate = useApiMutation();
  const [open, setOpen] = React.useState(false);

  const handleUpdateStudent = async (values: StudentFormValues) => {
    const updated = await mutate({
      method: "PATCH",
      url: `/api/persons/students/${student.id}`,
      body: toStudentPayload(values),
      successMessage: "Student updated successfully",
    });
    if (updated) setOpen(false);
  };

  return (
    <>
      <Button
        variant="text"
        color="primary"
        startIcon={<EditIcon />}
        onClick={() => setOpen(true)}
      >
        Edit
      </Button>
      <FormDialog
        open={open}
        title="Update Student"
        initialValues={toStudentFormValues(student)}
        onClose={() => setOpen(false)}
        onSubmit={handleUpdateStudent}
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
