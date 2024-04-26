import { useRouter } from "next/router";
import React from "react";
import Button from "@mui/material/Button";
import Link from "next/link";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";

const BackButton = ({ backRoute }) => {
  const router = useRouter();

  return (
    <Box mt={-1} mb={2}>
      <Button
        component={Link}
        href={backRoute}
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
  );
};

export default BackButton;
