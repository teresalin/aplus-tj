export function formatDate(date: Date | string | null): string | null {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  } else if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().split("T")[0];
    }
  }
  return null;
}
