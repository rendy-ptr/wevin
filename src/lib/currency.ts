export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatThousandSeparator(value: number | string): string {
  if (!value && value !== 0) return '';
  const numberString = value.toString().replace(/[^0-9]/g, '');
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function parseThousandSeparator(value: string): number {
  if (!value) return 0;
  return parseInt(value.replace(/\./g, ''), 10) || 0;
}
