export function formatNumber(num: number) {
  if (!Number.isFinite(num)) return num;

  const suffixes = ["", "k", "M", "B", "T"];
  let tier = Math.floor(Math.log10(Math.abs(num)) / 3);

  // Handle numbers less than 1000
  if (tier === 0) return num.toString();

  // Prevent array out of bounds for very large numbers
  if (tier >= suffixes.length) tier = suffixes.length - 1;

  const scaled = num / Math.pow(10, tier * 3);
  // Round to 1 decimal place if not a whole number
  const formatted = scaled % 1 === 0 ? scaled : scaled.toFixed(1);

  return `${formatted}${suffixes[tier]}`;
}
