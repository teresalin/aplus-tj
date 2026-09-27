"use client";

import { useRouter } from "next/navigation";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

import { apiRequest, getErrorMessage } from "@/lib/api/client";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import type { ClassDetail } from "@/modules/classes";
import type { Grade } from "@/modules/grades";
import type { StaffOption } from "@/modules/persons/staffs";
import UpdateClassDetailsDialog from "./UpdateClassDetailsDialog";
import type { ClassFormValues } from "./ClassFormFields";

export default function EditClassButton({
  existingClass,
  grades,
  teachers,
}: {
  existingClass: ClassDetail;
  grades: Grade[];
  teachers: StaffOption[];
}) {
  const router = useRouter();
  const notify = useSnackbar();
  const [open, setOpen] = React.useState(false);

  const handleUpdateDetails = async (data: ClassFormValues) => {
    try {
      await apiRequest(`/api/classes/${existingClass.id}`, "PUT", data);
      setOpen(false);
      notify("Class updated successfully");
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
      <UpdateClassDetailsDialog
        existingClass={existingClass}
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleUpdateDetails}
        grades={grades}
        teachers={teachers}
      />
    </>
  );
}
