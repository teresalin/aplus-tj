"use client";

import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

import { apiRequest, getErrorMessage } from "@/lib/api/client";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import type { Grade } from "@/modules/grades";
import type { Student } from "@/modules/persons/students";
import UpdateStudentDialog from "./UpdateStudentDialog";
import { toStudentPayload, type StudentFormValues } from "./StudentFormFields";

export default function EditStudentButton({
  student,
  grades,
}: {
  student: Student;
  grades: Grade[];
}) {
  const router = useRouter();
  const notify = useSnackbar();
  const [open, setOpen] = React.useState(false);

  const handleUpdateStudent = async (data: StudentFormValues) => {
    try {
      await apiRequest(
        `/api/persons/students/${student.id}`,
        "PATCH",
        toStudentPayload(data),
      );
      setOpen(false);
      notify("Student updated successfully");
      router.refresh();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
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
      <UpdateStudentDialog
        existingStudent={student}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleUpdateStudent}
        grades={grades}
      />
    </>
  );
}
