import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function BackButton({ href }: { href: string }) {
  return (
    <Box mt={-1} mb={2}>
      <Button
        component={Link}
        href={href}
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
}
