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