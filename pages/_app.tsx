import React from "react";
import { AppProps } from "next/app";
import { styled } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Drawer from "@mui/material/Drawer";
import Head from "next/head";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ListItemButton from "@mui/material/ListItemButton";
import Divider from "@mui/material/Divider";

import fetcher from "../utils/fetcher";

import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import SelectedListItem from "../src/components/SelectedListItem";

declare global {
  interface Window {
    ace?: any;
  }
}

const Root = styled("div")({
  display: "flex",
});
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#08194d",
}));
const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  lineHeight: "normal",
}));
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
      <Root>
        <Head>
          <title>A Plus</title>
          <link rel="icon" type="image/x-icon" href="/favicon.ico?" />
          <script
            src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.13/ace.js"
            integrity="sha512-OMjy8oWtPbx9rJmoprdaQdS2rRovgTetHjiBf7RL7LvRSouoMLks5aIcgqHb6vGEAduuPdBTDCoztxLR+nv45g=="
            crossOrigin="anonymous"
            referrerPolicy="no-referrer"
          ></script>
        </Head>
        <StyledAppBar position="fixed">
          <Toolbar>
            <Logo src="/logo2.png" alt="A Plus" />
            <Title variant="h6">
              <Link href="/">A Plus</Link>
            </Title>
          </Toolbar>
        </StyledAppBar>
        <StyledDrawer
          variant="permanent"
          PaperProps={{
            sx: {
              width: 250,
            },
          }}
        >
          <Toolbar />
          <StyledDrawerContainer>
            <SelectedListItem />
          </StyledDrawerContainer>
        </StyledDrawer>
        <Content>
          <Toolbar />
          <Component {...pageProps} />
        </Content>
      </Root>
    </div>
  );
}
