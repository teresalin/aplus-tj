import "../styles/globals.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import AppLayout from "../src/components/layout/layout";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import React from "react";
import theme from "../styles/theme";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>A Plus</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico?" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <StyledEngineProvider injectFirst>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <AppLayout
              mainPage={
                <>
                  <Component {...pageProps} />
                </>
              }
            />
          </LocalizationProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </>
  );
}
