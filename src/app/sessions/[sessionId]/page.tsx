import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import ClassIcon from "@mui/icons-material/Class";
import EventIcon from "@mui/icons-material/Event";
import Grid from "@mui/material/Grid";
import HailIcon from "@mui/icons-material/Hail";
import HelpCenterIcon from "@mui/icons-material/HelpCenter";
import Link from "next/link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import BackButton from "@/components/BackButton";
import LocalDateTime from "@/components/LocalDateTime";
import { requirePageAccess } from "@/lib/authz";
import { isUuid } from "@/lib/ids";
import type { SessionStudent } from "@/modules/sessions";
import { sessionService } from "@/modules/sessions/session.service";

export const metadata: Metadata = { title: "Session" };

const panelSx = { p: 3, bgcolor: "background.paper", borderRadius: 2 };

function StatCard({
  icon,
  children,
}: {
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card variant="outlined">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: "8px",
          paddingLeft: "16px",
          paddingRight: "8px",
        }}
      >
        {icon}
        <CardContent>
          <Box>{children}</Box>
        </CardContent>
      </Box>
    </Card>
  );
}

function StudentChips({
  students,
  variant,
}: {
  students: SessionStudent[];
  variant?: "outlined";
}) {
  return (
    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
      {students.map((student) => (
        <Chip
          key={student.id}
          label={student.name}
          variant={variant}
          component={Link}
          href={`/persons/students/${student.id}/details`}
          clickable
        />
      ))}
    </Stack>
  );
}

export default async function SessionPage({
  params,
}: {
  params: { sessionId: string };
}) {
  await requirePageAccess();
  if (!isUuid(params.sessionId)) notFound();

  const details = await sessionService.getDetail(params.sessionId);
  if (!details) notFound();

  return (
    <>
      <BackButton href="/sessions" />
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <Box sx={panelSx}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Typography variant="h6" gutterBottom>
                Details
              </Typography>
            </Grid>
            <Grid container spacing={{ xs: 1, sm: 2, md: 2, lg: 3 }}>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <StatCard icon={<EventIcon sx={{ fontSize: "2.8em" }} />}>
                  <Typography>
                    <LocalDateTime value={details.startTime} format="MMM DD" />
                  </Typography>
                  <Typography variant="caption">
                    <LocalDateTime value={details.startTime} format="HH:mm" />
                    {" - "}
                    <LocalDateTime value={details.endTime} format="HH:mm" />
                  </Typography>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <StatCard icon={<ClassIcon sx={{ fontSize: "2.8em" }} />}>
                  <Typography>{details.class.name}</Typography>
                  <Typography variant="caption">
                    {details.class.teacherName}
                  </Typography>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <StatCard icon={<HailIcon sx={{ fontSize: "2.8em" }} />}>
                  <Typography variant="subtitle1">Attended</Typography>
                  <Typography variant="h5">{details.present.length}</Typography>
                </StatCard>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <StatCard icon={<HelpCenterIcon sx={{ fontSize: "2.8em" }} />}>
                  <Typography variant="subtitle1">Absent</Typography>
                  <Typography variant="h5">{details.absent.length}</Typography>
                </StatCard>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item sm={12} md={12} lg={6}>
          <Box sx={panelSx}>
            <Typography variant="h6" gutterBottom>
              Attended Students
            </Typography>
            <StudentChips students={details.present} />
          </Box>
        </Grid>
        <Grid item sm={12} md={12} lg={6}>
          <Box sx={panelSx}>
            <Typography variant="h6" gutterBottom>
              Absent Students
            </Typography>
            <StudentChips students={details.absent} variant="outlined" />
          </Box>
        </Grid>
      </Grid>
    </>
  );
}
