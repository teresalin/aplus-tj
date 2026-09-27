"use client";

import AddBoxIcon from "@mui/icons-material/AddBox";
import Button from "@mui/material/Button";
import React from "react";

import FormDialog from "@/components/FormDialog";
import { useApiMutation } from "@/hooks/use-api-mutation";
import type { Grade } from "@/modules/grades";
import type { StaffOption } from "@/modules/persons/staffs";
import ClassFormFields, {
  emptyClassFormValues,
  isClassFormValid,
  type ClassFormValues,
} from "./ClassFormFields";

// TODO allow user to select a color for each class in admin settings

export default function CreateClassButton({
  grades,
  teachers,
}: {
  grades: Grade[];
  teachers: StaffOption[];
}) {
  const mutate = useApiMutation();
  const [open, setOpen] = React.useState(false);

  const handleCreateClass = async (values: ClassFormValues) => {
    const created = await mutate({
      method: "POST",
      url: "/api/classes",
      body: values,
      successMessage: "Class created successfully",
    });
    if (created) setOpen(false);
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
      <FormDialog
        open={open}
        title="New Class"
        initialValues={emptyClassFormValues}
        canSubmit={isClassFormValid}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateClass}
      >
        {(values, setValues) => (
          <ClassFormFields
            classData={values}
            setFormData={setValues}
            grades={grades}
            teachers={teachers}
          />
        )}
      </FormDialog>
    </>
  );
}
