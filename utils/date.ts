/**
 * Format a date string to a relative time string (e.g., "2 hours ago")
 */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than a minute
  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks <= 4) return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`; // inclusive 4 weeks

  const months = Math.floor(days / 30);
  if (months < 12)
    return `${months || 1} ${months === 1 ? "month" : "months"} ago`; // fallback to 1 month if <1

  const years = Math.floor(days / 365);
  return `${years} ${years === 1 ? "year" : "years"} ago`;
}


/**
 * Format a date string to a localized date string
 */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options || defaultOptions);
}

/**
 * Check if a date is today
 */
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Format a date for display in the UI
 */
export function formatDateForDisplay(dateString: string): string {
  if (isToday(dateString)) {
    return "Today";
  }

  const date = new Date(dateString);
  const yesterday = new Date();

  yesterday.setDate(yesterday.getDate() - 1);

  if (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  ) {
    return "Yesterday";
  }

  return formatDate(dateString);
}
