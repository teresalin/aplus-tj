import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import * as React from "react";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import useSWR from "swr";

import DetailsTab from "../../../src/components/person/student/DetailsTab";
import fetcher from "../../../utils/fetcher";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ClassDetails() {
  const theme = useTheme();

  const router = useRouter();
  const { tab, id } = router.query;
  const { data } = useSWR(id ? `/api/persons/${tab}/${id}` : null, fetcher);
  const details = data || null;
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box mt={-1} mb={2}>
        <Button
          component={Link}
          href={`/persons/${tab}`}
          startIcon={<ArrowBackIosIcon />}
          sx={{
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          Back
        </Button>
      </Box>
      <Box
        sx={{
          width: "100%",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Details" {...a11yProps(0)} />
            <Tab label="Classes" {...a11yProps(1)} />
            <Tab label="Billing" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <DetailsTab details={details} />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Item Two
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Item Three
        </CustomTabPanel>
      </Box>
    </>
  );
}
