import "../../styles/globals.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AppProps } from "next/app";
import { lightTheme, darkTheme } from "../../styles/theme";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import AppLayout from "../components/layout/layout";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import React from "react";

function getActiveTheme(themeMode: "light" | "dark") {
  return themeMode === "light" ? lightTheme : darkTheme;
}

export default function MyApp({ Component, pageProps }: AppProps) {
  const [activeTheme, setActiveTheme] = React.useState(lightTheme);
  const [selectedTheme, setSelectedTheme] = React.useState<"light" | "dark">(
    "light"
  );

  const toggleTheme: React.MouseEventHandler<HTMLAnchorElement> = () => {
    const desiredTheme = selectedTheme === "light" ? "dark" : "light";
    setSelectedTheme(desiredTheme);
  };

  React.useEffect(() => {
    setActiveTheme(getActiveTheme(selectedTheme));
  }, [selectedTheme]);

  return (
    <>
      <Head>
        <title>A Plus</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?" />
        {/* <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        /> */}
      </Head>
      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <StyledEngineProvider injectFirst>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AppLayout
              mainPage={
                <>
                  <Component {...pageProps} />
                </>
              }
              toggleTheme={toggleTheme}
            />
          </LocalizationProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </>
  );
}
