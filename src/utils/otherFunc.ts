export const getWindDirection = (degrees: number): string => {
  const directions = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
};

export const getWindDirectionArrow = (degrees: number): string => {
  const arrows = ['⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️'];
  const index = Math.round(degrees / 45) % 8;
  return arrows[index];
};

export const capitalize = (str: string):string  => {
  const [firstWord, ...anyWords] = str.split(' ');
  const newWord = firstWord.split('')
  return `${newWord[0].toUpperCase()}${newWord.join('').slice(1)} ${anyWords.join(' ').toLowerCase()}`
}

export const getCityTime = (timezoneOffset: number): Date => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (timezoneOffset * 1000));
};

export const CurrentDate = () => {
  const now = new Date();
  
  const days = [
    'Воскресенье',
    'Понедельник',
    'Вторник',
    'Среда',
    'Четверг',
    'Пятница',
    'Суббота'
  ];
  
  const months = [
    '01', '02', '03', '04', '05', '06',
    '07', '08', '09', '10', '11', '12'
  ];

  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getUTCFullYear()

  // return <>{dayName}, {day}.{month}.{year}</>;
  return {
    dayName,
    day,
    month,
    year
  }
};