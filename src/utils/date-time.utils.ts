/**
 * Gives the readable version of a date
 *
 * @param date The date as a string format or a date object
 */
export function toReadableDate(date: string | Date) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}
