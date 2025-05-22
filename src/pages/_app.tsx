import "../../styles/globals.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { AppProps } from "next/app";
import { lightTheme, darkTheme } from "../../styles/theme";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StyledEngineProvider } from "@mui/material/styles";
import { ThemeProvider } from "@emotion/react";
import AppLayout from "../components/layout/layout";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import React, { FC, ReactElement, ReactNode } from "react";

type ComponentWithLayout = FC & {
  /** Optional per-page layout function */
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: ComponentWithLayout;
};

function getActiveTheme(themeMode: "light" | "dark") {
  return themeMode === "light" ? lightTheme : darkTheme;
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const [selectedTheme, setSelectedTheme] = React.useState<"light" | "dark">(
    "light",
  );
  const [activeTheme, setActiveTheme] = React.useState(
    getActiveTheme(selectedTheme),
  );

  const toggleTheme: React.MouseEventHandler<HTMLAnchorElement> = () => {
    setSelectedTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  React.useEffect(() => {
    setActiveTheme(getActiveTheme(selectedTheme));
  }, [selectedTheme]);

  // Pull in page-specific layout if provided, otherwise use identity
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  // Render the page into its layout
  const content = getLayout(<Component {...pageProps} />);

  return (
    <>
      <Head>
        <title>A Plus</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={activeTheme}>
        <CssBaseline />
        <StyledEngineProvider injectFirst>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {/* AppLayout will now receive your page already wrapped
                in SettingsLayout (or whatever) via getLayout */}
            <AppLayout mainPage={content} toggleTheme={toggleTheme} />
          </LocalizationProvider>
        </StyledEngineProvider>
      </ThemeProvider>
    </>
  );
}
