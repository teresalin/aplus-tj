import type { Person } from "@prisma/client";
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CakeIcon from "@mui/icons-material/Cake";
import EmailIcon from "@mui/icons-material/Email";
import Grid from "@mui/material/Grid";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { formatDate } from "@/lib/dates";

const avatarByGender = {
  Male: "/student-boy.png",
  Female: "/student-girl.png",
  Other: "/student-other.png",
} as const;

const contactButtonSx = {
  "&:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiButton-startIcon": {
    "& > *:first-of-type": { fontSize: 15 },
  },
  fontSize: 12,
};

/** Avatar, name, and contact details at the top of a person's page. */
export function PersonHeader({
  person,
  subtitle,
}: {
  person: Pick<Person, "name" | "gender" | "email" | "phone" | "dateOfBirth">;
  subtitle?: ReactNode;
}) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Grid container direction="row" spacing={3}>
        <Grid item>
          <Box
            component="img"
            sx={{ height: 80, width: 80 }}
            alt="User profile picture"
            src={avatarByGender[person.gender ?? "Other"]}
          />
        </Grid>
        <Grid item>
          <Typography variant="h6">{person.name}</Typography>
          <Typography variant="subtitle2">{subtitle}</Typography>
          <Grid container>
            <Grid item>
              <Button startIcon={<EmailIcon />} sx={contactButtonSx}>
                {person.email}
              </Button>
            </Grid>
            <Grid item>
              <Button startIcon={<LocalPhoneIcon />} sx={contactButtonSx}>
                {person.phone}
              </Button>
            </Grid>
            <Grid item>
              <Button startIcon={<CakeIcon />} sx={contactButtonSx}>
                {formatDate(person.dateOfBirth)}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
}

/** A labelled value inside a details section. */
export function DetailItem({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <>
      <Typography
        variant="body2"
        sx={{ fontWeight: 700, color: "primary.main" }}
      >
        {label}
      </Typography>
      <Typography variant="body2">{children}</Typography>
    </>
  );
}
