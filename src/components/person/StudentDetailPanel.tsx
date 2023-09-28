import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function DetailPanel({ data }) {
  return (
    <>
      <Paper
        variant="outlined"
        sx={{ m: 2, p: 2, flexGrow: 1, borderColor: "#3c6ea0" }}
      >
        <Grid container alignItems="center" spacing={2}>
          <Grid container item spacing={3}>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Name
              </Typography>
              <Typography variant="body2">{data.name}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                English Name
              </Typography>
              <Typography variant="body2">{data.englishName}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Gender
              </Typography>
              <Typography variant="body2">{data.gender}</Typography>
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Phone
              </Typography>
              <Typography variant="body2">{data.phone}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Email
              </Typography>
              <Typography variant="body2">{data.email}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Date of Birth
              </Typography>
              <Typography variant="body2">{data.dateOfBirth}</Typography>
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Current School
              </Typography>
              <Typography variant="body2">{data.currentSchool}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Grade
              </Typography>
              <Typography variant="body2">{data.grade}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Textbook Publisher
              </Typography>
              <Typography variant="body2">{data.textbookPublisher}</Typography>
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Notes
              </Typography>
              <Typography variant="body2">{data.notes}</Typography>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={4}></Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default DetailPanel;
