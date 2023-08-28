import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AppProps } from "next/app";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Head from "next/head";
import React from "react";
import SelectedListItem from "../src/components/SelectedListItem";

declare global {
  interface Window {
    ace?: any;
  }
}

const Root = styled("div")({
  display: "flex",
});

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 250,
  flexShrink: 0,
}));

const StyledDrawerContainer = styled("div")(({ theme }) => ({
  overflow: "auto",
}));

const Content = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const Logo = styled("img")(({ theme }) => ({
  maxWidth: 30,
  marginRight: theme.spacing(1),
}));

export default function MyApp({ Component, pageProps }: AppProps) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  // HACK the classnames don't work on the first render on the outer element
  // for some reason. This answer may help fix properly
  //
  return (
    <div>
      <Root style={{ backgroundColor: "#f8f6fc" }}>
        <Head>
          <title>A Plus</title>
          <link rel="icon" type="image/x-icon" href="/favicon.ico?" />
          {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="anonymous"
          />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
          /> */}
        </Head>
        <StyledDrawer
          variant="permanent"
          PaperProps={{
            sx: {
              width: 250,
            },
          }}
        >
          <StyledDrawerContainer>
            <SelectedListItem />
          </StyledDrawerContainer>
        </StyledDrawer>
        <Content>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Component {...pageProps} />
            </Box>
          </LocalizationProvider>
        </Content>
      </Root>
    </div>
  );
}
