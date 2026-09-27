"use client";

import dayjs from "dayjs";
import React from "react";

/**
 * Formats a timestamp in the viewer's timezone. Rendered after hydration, since
 * the server's timezone can differ from the browser's.
 */
export default function LocalDateTime({
  value,
  format,
}: {
  value: Date;
  format: string;
}) {
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    setText(dayjs(value).format(format));
  }, [value, format]);

  return <>{text}</>;
}
