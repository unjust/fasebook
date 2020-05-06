const oneMinute = 1000 * 60;
const oneDay = 24 * 60 * oneMinute;

const dateFormatter = new Intl.DateTimeFormat('es', { year: 'numeric', month: 'short', day: 'numeric' });
  
export const formatDate = (date) => {
  
  const now = Date.now();
  const diff = now - date;
  if (diff < oneMinute) {
    return 'Just now';
  } else {
    const minutes = diff / oneMinute;
    if (minutes < 60) {
      return `Hace ${Math.floor(minutes)} minutos`;
    }
    if ((minutes < oneDay) && 
      new Date(Date.now()).getDate() === new Date(date).getDate()) {
      return 'Hoy';
    }
  }
  return dateFormatter.format(date);
}
