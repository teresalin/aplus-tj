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

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#3d6fa0",
    },
    secondary: {
      main: "#dc9770",
    },
    background: {
      default: "#f8f6fc",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#58acdc",
    },
    secondary: {
      main: "#dc8858",
    },
    background: {
      default: "#1e1e1f",
    },
  },
});

export { lightTheme, darkTheme };
