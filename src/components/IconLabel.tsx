import type { SvgIconComponent } from "@mui/icons-material";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

const sizes = {
  small: { icon: 15, text: 12 },
  medium: { icon: 20, text: 14 },
} as const;

interface IconLabelProps {
  icon: SvgIconComponent;
  /** What the value is (e.g. "Teacher"); shown as a tooltip and read by screen readers. */
  label: string;
  children: ReactNode;
  /** Makes the value a link, e.g. `mailto:` or `tel:`. */
  href?: string;
  size?: keyof typeof sizes;
}

/** An icon followed by a short value. Non-interactive unless `href` is set. */
export default function IconLabel({
  icon: Icon,
  label,
  children,
  href,
  size = "medium",
}: IconLabelProps) {
  const content = (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.75}
      sx={{ color: "primary.main", py: 0.75 }}
    >
      <Icon titleAccess={label} sx={{ fontSize: sizes[size].icon }} />
      <Typography variant="button" sx={{ fontSize: sizes[size].text }}>
        {children}
      </Typography>
    </Stack>
  );

  return (
    <Tooltip title={label} describeChild>
      {href ? (
        <Link href={href} underline="hover">
          {content}
        </Link>
      ) : (
        content
      )}
    </Tooltip>
  );
}
