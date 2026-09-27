import type { Person } from "@prisma/client";
import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import CakeIcon from "@mui/icons-material/Cake";
import EmailIcon from "@mui/icons-material/Email";
import Grid from "@mui/material/Grid";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import IconLabel from "@/components/IconLabel";
import { formatDate } from "@/lib/dates";

const avatarByGender = {
  Male: "/student-boy.png",
  Female: "/student-girl.png",
  Other: "/student-other.png",
} as const;

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
            alt=""
            src={avatarByGender[person.gender ?? "Other"]}
          />
        </Grid>
        <Grid item>
          <Typography variant="h6">{person.name}</Typography>
          <Typography variant="subtitle2">{subtitle}</Typography>
          <Grid container columnSpacing={2}>
            <Grid item>
              <IconLabel
                icon={EmailIcon}
                label="Email"
                href={`mailto:${person.email}`}
                size="small"
              >
                {person.email}
              </IconLabel>
            </Grid>
            {person.phone && (
              <Grid item>
                <IconLabel
                  icon={LocalPhoneIcon}
                  label="Phone"
                  href={`tel:${person.phone}`}
                  size="small"
                >
                  {person.phone}
                </IconLabel>
              </Grid>
            )}
            <Grid item>
              <IconLabel icon={CakeIcon} label="Date of birth" size="small">
                {formatDate(person.dateOfBirth)}
              </IconLabel>
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
