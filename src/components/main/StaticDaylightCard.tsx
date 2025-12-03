import { Sunrise, Sunset } from 'lucide-react';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils/cn';
import { formatTime } from '@/lib/utils/otherFunc';
import type { RootState } from '@/store';

interface StaticDaylightCardProps {
  sunrise: number // Unix timestamp в секундах
  sunset: number // Unix timestamp в секундах
}

export const StaticDaylightCard = ({ sunrise, sunset }: StaticDaylightCardProps) => {
  const currentTheme = useSelector((state: RootState) => state.settings.selectedTheme)

  // Расчёт длительности светового дня
  const daylightMinutes = Math.floor((sunset - sunrise) / 60);
  const hours = Math.floor(daylightMinutes / 60);
  const minutes = Math.floor(daylightMinutes % 60);

  const cardBg = cn(
    currentTheme === 'dark' ? 'bg-neutral-800' : 'bg-blue-100'
  )

  return (
    <div className={`${cardBg} flex flex-col items-center justify-center p-4 rounded-lg`}>
      {/* Дуга */}
      <div className="relative w-full max-w-md h-24 ">
        {/* Фоновая дуга (серая, пунктирная) — вторая половина */}
        <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
          <path
            d="M100,40 A80,30 0 0,1 180,65"
            fill="none"
            stroke="#d1d5db"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="4 8" // 🔥 Прерывистая линия
          />
        </svg>

        {/* Желтая дуга — первая половина (от начала до середины) */}
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 200 80"
          preserveAspectRatio="none"
          className="absolute top-0 left-0 pointer-events-none"
        >
          <path
            d="M20,65 A80,30 0 0,1 100,40"
            fill="none"
            stroke="#f59e0b" // 🟡 Жёлтый цвет
            strokeWidth="4"
            strokeLinecap="round"
            strokeOpacity="1"
          />
        </svg>
        <div className="absolute w-4 h-4 bg-yellow-500 rounded-full pointer-events-none top-10 left-29"/></div>

      {/* Иконки солнца и время */}
      <div className='flex justify-between w-full text-sm'>
        <div className="flex flex-col items-center">
          <Sunrise className="w-6 h-6 text-yellow-500 mb-1" />
          <span>{formatTime(sunrise)}</span>
        </div>
        <div className="text-center">
          <p>Световой день</p>
          <p>{hours} ч {minutes} мин</p>
        </div>
        <div className="flex flex-col items-center">
          <Sunset className="w-6 h-6 text-blue-900 mb-1" />
          <span>{formatTime(sunset)}</span>
        </div>
      </div>
    </div>
  );
}