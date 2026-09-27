"use client";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

import { usePendingAction } from "@/hooks/use-pending-action";

type SetValues<V> = React.Dispatch<React.SetStateAction<V>>;

interface FormDialogProps<V> {
  open: boolean;
  title: string;
  /** Values the form starts from each time the dialog opens. */
  initialValues: V;
  onClose: () => void;
  onSubmit: (values: V) => Promise<void>;
  /** Extra check for input the browser can't validate, such as date/time pickers. */
  canSubmit?: (values: V) => boolean;
  /** Renders the form fields for the current values. */
  children: (values: V, setValues: SetValues<V>) => React.ReactNode;
}

/**
 * A dialog wrapping a form with Cancel/Submit actions. The form's state lives
 * inside the dialog content, which MUI unmounts while the dialog is closed, so
 * every opening starts fresh from `initialValues` and no reset logic is needed.
 */
export default function FormDialog<V>({
  open,
  onClose,
  ...contentProps
}: FormDialogProps<V>) {
  const titleId = React.useId();

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby={titleId}>
      <FormDialogContent
        titleId={titleId}
        onClose={onClose}
        {...contentProps}
      />
    </Dialog>
  );
}

function FormDialogContent<V>({
  titleId,
  title,
  initialValues,
  onClose,
  onSubmit,
  canSubmit,
  children,
}: Omit<FormDialogProps<V>, "open"> & { titleId: string }) {
  const [values, setValues] = React.useState(initialValues);
  const [submit, submitting] = usePendingAction(onSubmit);
  const complete = canSubmit?.(values) ?? true;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (complete) void submit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogTitle id={titleId}>{title}</DialogTitle>
      <DialogContent>{children(values, setValues)}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={submitting || !complete}>
          Submit
        </Button>
      </DialogActions>
    </form>
  );
}
