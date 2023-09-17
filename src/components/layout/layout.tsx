import "../../../styles/globals.css";
import { styled } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import SelectedListItem from "../../../src/components/SelectedListItem";
import Box from "@mui/material/Box";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 250,
  flexShrink: 0,
}));

const StyledDrawerContainer = styled("div")(({ theme }) => ({
  overflow: "auto",
}));

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

export default function AppLayout(props) {
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
            <SelectedListItem />
          </StyledDrawerContainer>
        </StyledDrawer>
        <Main>
          <Box sx={{ p: 3, overflowX: "hidden" }}>{props.mainPage}</Box>
        </Main>
      </Box>
    </>
  );
}
