import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import BackButton from "@/components/BackButton";
import { requirePageAccess } from "@/lib/authz";
import { formatDate } from "@/lib/dates";
import { isUuid } from "@/lib/ids";
import { classService } from "@/modules/classes/class.service";
import {
  ClassStudentsGrid,
  EditClassButton,
} from "@/modules/classes/components";
import { gradeService } from "@/modules/grades/grade.service";
import { staffService } from "@/modules/persons/staffs/staff.service";
import { formatScheduleDays } from "@/modules/schedules";

export const metadata: Metadata = { title: "Class" };

const labelSx = { fontWeight: 700, color: "primary.main" };

export default async function ClassPage({
  params,
}: {
  params: { classId: string };
}) {
  await requirePageAccess();
  if (!isUuid(params.classId)) notFound();

  const [classDetail, grades, teachers] = await Promise.all([
    classService.getById(params.classId),
    gradeService.getAll(),
    staffService.getOptions(),
  ]);
  if (!classDetail) notFound();

  const assignments = classDetail.classAssignments.map((ca) => ca.assignment);

  return (
    <>
      <BackButton href="/classes" />

      <Box mb={2}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h6" gutterBottom>
            Details
          </Typography>
          <EditClassButton
            existingClass={classDetail}
            grades={grades}
            teachers={teachers}
          />
        </Grid>
        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
          <Grid
            container
            rowSpacing={0}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" sx={labelSx}>
                  Grade
                </Typography>
                <Typography>{classDetail.grade.name}</Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ p: 2 }}>
                {/* add class time */}
                <Typography variant="body2" sx={labelSx}>
                  Schedule
                </Typography>
                <Typography>
                  {classDetail.schedules.length
                    ? formatScheduleDays(classDetail.schedules)
                    : "N/A"}
                </Typography>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="body2" sx={labelSx}>
                  Teacher
                </Typography>
                <Typography>
                  {classDetail.teacher.person.name || "No teacher assigned"}
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      <Typography variant="h6" gutterBottom>
        Assignments
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        {assignments.length ? (
          assignments.map((assignment, index) => (
            <Card
              key={assignment.id}
              style={{
                display: "flex",
                backgroundColor: "#f8f6fc",
                marginBottom: index < assignments.length - 1 ? "1em" : "0",
                boxShadow: "none",
                height: "4.4em",
                padding: "0.8em",
              }}
            >
              <Button sx={{ backgroundColor: "#59addd", color: "#fff", mr: 2 }}>
                {formatDate(assignment.dueDate, "MMM DD")}
              </Button>
              <Stack direction="column" justifyContent="center">
                <Typography>{assignment.name}</Typography>
                {assignment.description && (
                  <Typography variant="subtitle2" sx={{ color: "#808080" }}>
                    {assignment.description}
                  </Typography>
                )}
              </Stack>
            </Card>
          ))
        ) : (
          <p>No upcoming assignments</p>
        )}
      </Paper>

      <Typography variant="h6" gutterBottom>
        Students
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Box sx={{ width: "100%" }}>
          {classDetail.classStudents.length ? (
            <ClassStudentsGrid enrollments={classDetail.classStudents} />
          ) : (
            <p>No active students data available</p>
          )}
        </Box>
      </Paper>
    </>
  );
}
