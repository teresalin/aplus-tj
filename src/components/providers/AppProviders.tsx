"use client";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import React from "react";

import { darkTheme, lightTheme } from "@/styles/theme";
import { SnackbarProvider } from "@/components/feedback/SnackbarProvider";

type ColorMode = "light" | "dark";

const ColorModeContext = React.createContext<{
  mode: ColorMode;
  toggleColorMode: () => void;
} | null>(null);

export function useColorMode() {
  const context = React.useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within AppProviders");
  }
  return context;
}

/** Client-side providers shared by every page (styling, theme, dates, notifications). */
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = React.useState<ColorMode>("light");

  const colorMode = React.useMemo(
    () => ({
      mode,
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    [mode],
  );

  return (
    <AppRouterCacheProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={mode === "light" ? lightTheme : darkTheme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <SnackbarProvider>{children}</SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AppRouterCacheProvider>
  );
}
