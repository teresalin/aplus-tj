import "../../../styles/globals.css";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import SelectedListItem from "../../../src/components/SelectedListItem";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 250,
  flexShrink: 0,
}));

const StyledDrawerContainer = styled("div")(({ theme }) => ({
  overflow: "auto",
}));

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  overflowX: "hidden",
  padding: theme.spacing(3),
}));

export default function AppLayout({ mainPage, toggleTheme }) {
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <StyledDrawer
          variant="permanent"
          PaperProps={{
            sx: {
              width: 250,
            },
          }}
        >
          <StyledDrawerContainer>
            <SelectedListItem toggleTheme={toggleTheme} />
          </StyledDrawerContainer>
        </StyledDrawer>
        <Main>
          <Box sx={{ p: 3, overflowX: "hidden" }}>{mainPage}</Box>
        </Main>
      </Box>
    </>
  );
}
