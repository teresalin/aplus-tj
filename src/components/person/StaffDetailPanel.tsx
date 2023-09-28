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
                Role
              </Typography>
              <Typography variant="body2">{data.role}</Typography>
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
                Join Date
              </Typography>
              <Typography variant="body2">{data.joinDate}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Leave Date
              </Typography>
              <Typography variant="body2">{data.leaveDate}</Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: "#3c6ea0" }}
              >
                Notes
              </Typography>
              <Typography variant="body2">{data.notes}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default DetailPanel;
