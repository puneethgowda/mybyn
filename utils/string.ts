export function toTitleCase(str: string) {
  if (str.length === 0) {
    return ""; // Handle empty strings
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}
