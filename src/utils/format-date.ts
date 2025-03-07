/**
 * Formats a date string into a more readable format
 *
 * @param dateString - The date string to format
 * @returns Formatted date string (e.g., "25 Nov, 2024")
 */
export function formatDate(dateString: string): string {
  if (!dateString) return "-";

  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return dateString;
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
}
