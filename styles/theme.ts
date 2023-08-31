import { ThemeOptions, createTheme } from "@mui/material/styles";

// export const themeOptions: ThemeOptions = {
//   palette: {
//     mode: "light",
//     primary: {
//       main: "#3d6fa0",
//     },
//     secondary: {
//       main: "#dc9770",
//     },
//   },
// };

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3d6fa0",
    },
    secondary: {
      main: "#dc9770",
    },
  },
});

export default theme;
