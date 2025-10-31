import React from 'react';
import { useGetHourlyForecastQuery } from '@/store/api/forecastApi/forecastApi';
import { format, fromUnixTime } from 'date-fns';
import { ru } from 'date-fns/locale';

interface HourlyForecastProps {
  lat: number;
  lon: number;
  cityName: string;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ lat, lon, cityName }) => {
  const { data: hourlyData, isLoading, error } = useGetHourlyForecastQuery({ lat, lon });

  if (isLoading) return <div className="forecast-loading">Загрузка прогноза...</div>;
  if (error) return <div className="forecast-error">Ошибка загрузки прогноза {}</div>;
  if (!hourlyData) return null;

  return (
    <div className="hourly-forecast">
      <h3>Почасовой прогноз для {cityName} (24 часа)</h3>
      <div className="hourly-list">
        {hourlyData.map((hour, index) => (
          <div key={hour.dt} className="hourly-item">
            <div className="hour-time">
              {index === 0 
                ? 'Сейчас' 
                : format(fromUnixTime(hour.dt), 'HH:mm', { locale: ru })
              }
            </div>
            <img 
              src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} 
              alt={hour.weather[0].description}
              className="weather-icon"
            />
            <div className="hour-temp">{Math.round(hour.temp)}°C</div>
            <div className="hour-pop">
              💧 {Math.round(hour.pop * 100)}%
            </div>
            <div className="hour-desc">
              {hour.weather[0].description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};