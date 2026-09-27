"use client";

import { useRouter } from "next/navigation";
import AddBoxIcon from "@mui/icons-material/AddBox";
import Button from "@mui/material/Button";
import React from "react";

import { apiRequest, getErrorMessage } from "@/lib/api/client";
import { useSnackbar } from "@/components/feedback/SnackbarProvider";
import type { Grade } from "@/modules/grades";
import type { StaffOption } from "@/modules/persons/staffs";
import CreateClassDialog from "./CreateClassDialog";
import type { ClassFormValues } from "./ClassFormFields";

// TODO allow user to select a color for each class in admin settings

export default function CreateClassButton({
  grades,
  teachers,
}: {
  grades: Grade[];
  teachers: StaffOption[];
}) {
  const router = useRouter();
  const notify = useSnackbar();
  const [open, setOpen] = React.useState(false);

  const handleCreateClass = async (
    data: ClassFormValues,
    resetForm: () => void,
  ) => {
    try {
      await apiRequest("/api/classes", "POST", data);
      setOpen(false);
      notify("Class created successfully");
      resetForm();
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
        startIcon={<AddBoxIcon />}
        onClick={() => setOpen(true)}
      >
        Add Class
      </Button>
      <CreateClassDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateClass}
        grades={grades}
        teachers={teachers}
      />
    </>
  );
}
