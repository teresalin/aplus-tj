import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

function DetailPanel({ data }) {
  return (
    <>
      <Paper
        elevation={0}
        sx={{ p: 2, flexGrow: 1, backgroundColor: "#e3f3fb" }}
      >
        <Grid container direction="row" alignItems="center" spacing={2}>
          <Grid item xs={6}>
            <Typography>{data.name}</Typography>
            <Typography>testingtestingtestingtestingtesting</Typography>
            <Typography>testingtestingtestingtestingtesting</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography>testingtestingtestingtestingtesting</Typography>
            <Typography>testingtestingtestingtestingtesting</Typography>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
}

export default DetailPanel;
