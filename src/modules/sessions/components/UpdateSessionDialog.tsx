import { Alert } from "@mui/material";
import React from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useSWR, { mutate } from "swr";

import { Class } from "../../classes/types";
import { Session } from "../types";
import { sessionToUpdateSessionDTO } from "../session.transformers";
import { UpdateSessionDTO } from "../dtos";
import fetcher from "../../../../utils/fetcher";
import SessionFormFields from "./SessionFormFields";

export interface IUpdateSessionDialogProps {
  existingSession: Session | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateSessionDTO, resetForm: () => void) => Promise<void>;
}

export default function UpdateSessionDialog({
  existingSession,
  open,
  onClose,
  onSubmit,
}: IUpdateSessionDialogProps) {
  const initialSessionState = {} as UpdateSessionDTO;
  const [formData, setFormData] = React.useState(initialSessionState);
  const [hasError, setHasError] = React.useState(false);

  const { data, error, isLoading } = useSWR<Class[]>("/api/classes", fetcher);
  const classes = data || [];

  React.useEffect(() => {
    if (open && existingSession) {
      mutate(`/api/sessions/${existingSession.id}`).then(() => {
        setFormData(sessionToUpdateSessionDTO(existingSession));
      });
    }
  }, [open, existingSession]);

  const handleSubmit: React.FormEventHandler = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();
    if (!hasError) {
      await onSubmit(formData as UpdateSessionDTO, () =>
        setFormData(initialSessionState)
      );
    }
  };

  const handleClose = () => {
    onClose();
    setFormData(initialSessionState);
  };

  return (
    formData && (
      <Dialog open={open} onClose={handleClose}>
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
                    session={formData}
                    setFormData={setFormData}
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
    )
  );
}
