import { format, isThisWeek, isThisYear, isYesterday } from "date-fns";

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
  options?: Intl.DateTimeFormatOptions
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
export function isToday(dateString: string | Date): boolean {
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
export function formatDateForDisplay(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return format(dateObj, "MMM dd, yyyy");
}

export function formatTimeForDisplay(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return format(dateObj, "HH:mm");
}

export function formatDateTimeForDisplay(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return format(dateObj, "MMM dd, yyyy HH:mm");
}

export function getRelativeTime(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);

    return `${minutes}m ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);

    return `${hours}h ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);

    return `${days}d ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);

    return `${months}mo ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);

    return `${years}y ago`;
  }
}

export function getMessageDateLabel(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isToday(dateObj)) {
    return "Today";
  } else if (isYesterday(dateObj)) {
    return "Yesterday";
  } else if (isThisWeek(dateObj)) {
    return format(dateObj, "EEEE"); // Day name
  } else if (isThisYear(dateObj)) {
    return format(dateObj, "MMM dd"); // Month and day
  } else {
    return format(dateObj, "MMM dd, yyyy"); // Full date
  }
}

export function groupMessagesByDate(messages: any[]): any[] {
  if (!messages.length) return [];

  const groups: { [key: string]: any[] } = {};

  messages.forEach(message => {
    const date = new Date(message.created_at);
    const dateKey = format(date, "yyyy-MM-dd");

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });

  return Object.entries(groups).map(([dateKey, messages]) => ({
    date: dateKey,
    label: getMessageDateLabel(new Date(dateKey)),
    messages: messages.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    ),
  }));
}
