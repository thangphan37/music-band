function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    day: '2-digit',
  }).format(new Date(date))
}

export {formatDate}
