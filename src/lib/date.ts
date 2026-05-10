export function formatDate(
  date: string | number | Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = new Date(date);

  if (isNaN(d.getTime())) {
    return '-';
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return d.toLocaleDateString('id-ID', options || defaultOptions);
}

export function formatDateTime(date: string | number | Date): string {
  return formatDate(date, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
