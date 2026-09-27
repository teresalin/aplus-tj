"use client";

import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import React from "react";

import FormDialog from "@/components/FormDialog";
import { useApiMutation } from "@/hooks/use-api-mutation";
import type { ClassDetail } from "@/modules/classes";
import type { Grade } from "@/modules/grades";
import type { StaffOption } from "@/modules/persons/staffs";
import ClassFormFields, {
  isClassFormValid,
  toClassFormValues,
  type ClassFormValues,
} from "./ClassFormFields";

export default function EditClassButton({
  existingClass,
  grades,
  teachers,
}: {
  existingClass: ClassDetail;
  grades: Grade[];
  teachers: StaffOption[];
}) {
  const mutate = useApiMutation();
  const [open, setOpen] = React.useState(false);

  const handleUpdateDetails = async (values: ClassFormValues) => {
    const updated = await mutate({
      method: "PUT",
      url: `/api/classes/${existingClass.id}`,
      body: values,
      successMessage: "Class updated successfully",
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
        title="Update Class Details"
        initialValues={toClassFormValues(existingClass)}
        canSubmit={isClassFormValid}
        onClose={() => setOpen(false)}
        onSubmit={handleUpdateDetails}
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
