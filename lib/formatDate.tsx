export const formatDate = (dateInput: string | Date): string => {
  const date =
    typeof dateInput === 'string'
      ? new Date(`${dateInput}`)
      : dateInput;

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};