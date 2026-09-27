import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import { requirePageAccess } from "@/lib/authz";
import { isUuid } from "@/lib/ids";
import { formatDate } from "@/lib/dates";
import { gradeService } from "@/modules/grades/grade.service";
import {
  DetailItem,
  PersonHeader,
} from "@/modules/persons/components/PersonDetails";
import { EditStudentButton } from "@/modules/persons/students/components";
import { studentService } from "@/modules/persons/students/student.service";

export const metadata: Metadata = { title: "Student" };

export default async function StudentDetailsPage({
  params,
}: {
  params: { studentId: string };
}) {
  await requirePageAccess();
  if (!isUuid(params.studentId)) notFound();

  const [student, grades] = await Promise.all([
    studentService.getById(params.studentId),
    gradeService.getAll(),
  ]);
  if (!student) notFound();

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "row-reverse" }} m={1}>
        <EditStudentButton student={student} grades={grades} />
      </Box>

      <PersonHeader
        person={student.person}
        subtitle={student.person.preferredName}
      />
      <Typography variant="h6" gutterBottom>
        School Information
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={4}>
            <DetailItem label="Current School">
              {student.currentSchool}
            </DetailItem>
          </Grid>
          <Grid item sm={12} md={4}>
            <DetailItem label="Grade">{student.grade.name}</DetailItem>
          </Grid>
          <Grid item sm={12} md={4}>
            <DetailItem label="Textbook Publisher">
              {student.textbookPublisher}
            </DetailItem>
          </Grid>
        </Grid>
      </Paper>
      <Typography variant="h6" gutterBottom>
        A Plus Enrollment
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={3}>
          <Grid item sm={12} md={4}>
            <DetailItem label="Admission Date">
              {formatDate(student.admissionDate)}
            </DetailItem>
          </Grid>
          <Grid item sm={12} md={4}>
            <DetailItem label="Departure Date">
              {formatDate(student.departureDate)}
            </DetailItem>
          </Grid>
          <Grid item sm={12} md={4}>
            <DetailItem label="Status">
              {student.person.active ? "Active" : "Inactive"}
            </DetailItem>
          </Grid>
        </Grid>
      </Paper>
      <Typography variant="h6" gutterBottom>
        Other
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <DetailItem label="Notes">{student.person.notes || "N/A"}</DetailItem>
      </Paper>
    </>
  );
}
