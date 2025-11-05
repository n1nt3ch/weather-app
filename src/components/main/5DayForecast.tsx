// components/Hourly5DayForecast.tsx (на основе 5-Day Forecast)
import React from 'react';
import { useGet5DayForecastQuery } from '@/store/api/forecastApi/forecastApi';
import { getWindDirection, getWindDirectionArrow, capitalize } from '@/utils/otherFunc';
import { format, fromUnixTime, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';


interface Hourly5DayForecastProps {
  lat: number;
  lon: number;
  cityName: string;
}

export const Hourly5DayForecast: React.FC<Hourly5DayForecastProps> = ({ lat, lon, cityName }) => {
  const { data: forecastData, isLoading, error } = useGet5DayForecastQuery({ lat, lon });

  const getDayName = (date: Date): string => {
    if (isToday(date)) return 'Сегодня';
    if (isTomorrow(date)) return 'Завтра';
    return format(date, 'EEEE', { locale: ru });
  };

  const groupByDay = (data: any[]) => {
    const grouped: { [key: string]: any[] } = {};
    
    data?.forEach(item => {
      const date = fromUnixTime(item.dt);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      
      grouped[dateKey].push({
        ...item,
        time: format(date, 'HH:mm'),
        dayName: getDayName(date)
      });
    });
    
    return grouped;
  };

  if (isLoading) return <div className="forecast-loading">Загрузка прогноза...</div>;
  if (error) {
    console.error('Forecast API Error:', error);
    return (
      <div className="forecast-error">
        <h4>Ошибка загрузки прогноза</h4>
        <p>API недоступно. Используется бесплатный тариф OpenWeatherMap.</p>
        <p style={{ fontSize: '0.8rem', color: '#666' }}>
          Доступные бесплатные API: 5-Day Forecast и Current Weather
        </p>
      </div>
    );
  }
  if (!forecastData) return null;

  const groupedData = groupByDay(forecastData);

  return (
    <div className="hourly-5day-forecast">
      <h3>Прогноз на 5 дней</h3>
      
      {Object.entries(groupedData).slice(0).map(([dateKey, dayData]) => (
        <div key={dateKey} className="day-section">
          <h4 className="day-title">{dayData[0].dayName}</h4>
          <div className="hourly-grid">
            {dayData.map((hour) => (
              <div key={hour.dt} className="hourly-card">
                <div className="hour-time">{hour.time}</div>
                <img 
                  src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} 
                  alt={hour.weather[0].description}
                  className="weather-icon"
                />
                <div className="hour-temp">{Math.round(hour.main.temp)}°C</div>
                <div className="hour-details">
                  <div className="hour-pop">💧 {Math.round((hour.main.humidity))}%</div>
                  <div className="hour-wind">💨 {Math.round(hour.wind.speed)} м/с, {getWindDirectionArrow(hour.wind.deg)}{getWindDirection(hour.wind.deg)}</div>
                </div>
                {/* <div className="hour-desc">{(hour.weather[0].description).toLowerCase()}</div> */}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};