import dayjs from "dayjs";

export function formatDate(date?: Date): string | null {
  if (date) {
    return dayjs(date).utc().format("YYYY-MM-DD");
  }
  return null;
}
