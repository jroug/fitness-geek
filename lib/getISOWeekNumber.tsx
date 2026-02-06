export const getISOWeekNumber = (date: Date): number => {
  const d = new Date(Date.UTC(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  ));

  // ISO week date weeks start on Monday
  // so correct the day number
  const dayNum = d.getUTCDay() || 7;

  // Set the target date to the Thursday in the current week
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);

  // Calculate week number
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((+d - +yearStart) / 86400000 + 1) / 7);

  return weekNo;
};