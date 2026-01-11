// import { useEffect, useRef } from 'react';
// import { getCityTime } from '@/lib/utils/otherFunc';

// interface WeatherData {
//   timezone: number;
// }

// export const TimeDisplay = ({ weather }: { weather: WeatherData | null }) => {
//   const timeRef = useRef<HTMLSpanElement>(null);

//   useEffect(() => {
//     if (!weather) return;

//     const updateTime = () => {
//       if (timeRef.current) {
//         const time = getCityTime(weather.timezone); // ваша функция
//         timeRef.current.textContent = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       }
//     };

//     updateTime(); // сразу обновляем
//     const interval = setInterval(updateTime, 1000);

//     return () => clearInterval(interval);
//   }, [weather]); // зависимость — если weather изменится, пересоздаём таймер

//   return <span ref={timeRef}>--:--</span>; // текст обновляется напрямую
// };