import React from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useSWR from "swr";

import { Class } from "../../classes/types";
import { CreateSessionDTO } from "../dtos";
import { Session } from "../types";
import fetcher from "../../../../utils/fetcher";
import SessionFormFields from "./SessionFormFields";

export interface ICreateSessionDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSessionDTO, resetForm: () => void) => Promise<void>;
}

export default function CreateSessionDialog({
  open,
  onClose,
  onSubmit,
}: ICreateSessionDialogProps) {
  const initialSessionState = {} as CreateSessionDTO;
  const [newSession, setNewSession] = React.useState(initialSessionState);
  const [hasError, setHasError] = React.useState(false);

  const { data, error, isLoading } = useSWR<Class[]>("/api/classes", fetcher);
  const classes = data || [];

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    if (!hasError) {
      await onSubmit(newSession, () => setNewSession(initialSessionState));
    }
  };

  // console.log(newSession);

  return (
    <Dialog open={open} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <DialogTitle>New session</DialogTitle>
        <DialogContent>
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              {error && (
                <Alert severity="error">
                  Failed to load class data: {error.message}
                </Alert>
              )}
              {!error && (
                <SessionFormFields
                  session={newSession}
                  setFormData={setNewSession}
                  classes={classes}
                  setHasError={setHasError}
                />
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button autoFocus type="submit">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
