// components/Hourly5DayForecast.tsx (на основе 5-Day Forecast)
import React from 'react';
import { useGet5DayForecastQuery } from '@/store/api/forecastApi/forecastApi';
import { getWindDirection, getWindDirectionArrow } from '@/utils/otherFunc';
import { format, fromUnixTime, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Wind, Droplet } from "lucide-react"

interface Hourly5DayForecastProps {
  lat: number;
  lon: number;
  cityName: string;
}

export const Hourly5DayForecast: React.FC<Hourly5DayForecastProps> = ({ lat, lon }) => {
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
  
  const groupByDay = (list) => {
    const days = {};

    list.forEach(item => {
      const date = new Date(item.dt * 1000).toLocaleDateString();
      if (!days[date]) {
      days[date] = {
      temps: [],
      descriptions: {},
      icons: {},
      timestamps: []
      };
      }

      days[date].temps.push(item.main.temp);
      days[date].timestamps.push(item.dt);

      // Считаем частоту описаний и иконок
      const desc = item.weather[0].description;
      const icon = item.weather[0].icon;
      days[date].descriptions[desc] = (days[date].descriptions[desc] || 0) + 1;
      days[date].icons[icon] = (days[date].icons[icon] || 0) + 1;
    });

    // Расчет значений для каждого дня
    return Object.keys(days).map(date => {
      const dayData = days[date];

      // Находим наиболее частые описание и иконку
      const mostFrequentDesc = Object.keys(dayData.descriptions)
      .reduce((a, b) => dayData.descriptions[a] > dayData.descriptions[b] ? a : b);

      const mostFrequentIcon = Object.keys(dayData.icons)
      .reduce((a, b) => dayData.icons[a] > dayData.icons[b] ? a : b);

      return {
        date,
        temp: Math.round(dayData.temps.reduce((a, b) => a + b) / dayData.temps.length),
        temp_min: Math.round(Math.min(...dayData.temps)),
        temp_max: Math.round(Math.max(...dayData.temps)),
        description: mostFrequentDesc,
        icon: mostFrequentIcon,
        timestamp: dayData.timestamps[0] // первая временная метка дня
      };
    });
  };


  return (
    <div className="hourly-5day-forecast flex justify-between">
      {/* <h3>Прогноз на 5 дней</h3> */}
      {console.log(groupedData)}
      
      {Object.entries(groupedData).map(([dateKey, dayData]) => (
        <div key={dateKey} className="day-section">
          <h4 className="day-title">{dayData[0].dayName}</h4>
          <div className="flex-col">
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
                  <div className="hour-pop"><Droplet /> {Math.round((hour.main.humidity))}%</div>
                  <div className="hour-wind"><Wind /> {Math.round(hour.wind.speed)} м/с, {getWindDirectionArrow(hour.wind.deg)}{getWindDirection(hour.wind.deg)}</div>
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