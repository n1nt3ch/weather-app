// components/Hourly5DayForecast.tsx (на основе 5-Day Forecast)
import React from 'react';
import { useGet5DayForecastQuery } from '@/store/api/forecastApi/forecastApi';
import { getWindDirection, getWindDirectionArrow } from '@/utils/otherFunc';
import { format, fromUnixTime, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';

import { Wind, Droplet, Thermometer, Gauge, Eye } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface Hourly5DayForecastProps {
  lat: number;
  lon: number;
  cityName: string;
}

interface DailyAverage {
  temp: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  pop: number;
  visibility: number;
  description: string;
  icon: string;
}

export const Hourly5DayForecast: React.FC<Hourly5DayForecastProps> = ({ lat, lon }) => {
  const { data: forecastData, isLoading, error } = useGet5DayForecastQuery({ lat, lon });

  const getDayName = (date: Date): string => {
    if (isToday(date)) return 'Сегодня';
    if (isTomorrow(date)) return 'Завтра';
    return format(date, 'EEEE', { locale: ru });
  };

  const calculateDailyAverage = (dayData: any[]): DailyAverage => {
    const temps = dayData.map(hour => hour.main.temp);
    const feels_like = dayData.map(hour => hour.main.feels_like);
    const pressures = dayData.map(hour => hour.main.pressure);
    const humidities = dayData.map(hour => hour.main.humidity);
    const wind_speeds = dayData.map(hour => hour.wind.speed);
    const wind_degs = dayData.map(hour => hour.wind.deg);
    const pops = dayData.map(hour => hour.pop * 100); // Convert to percentage
    const visibilities = dayData.map(hour => hour.visibility);

    // Находим наиболее часто встречающееся описание погоды
    const weatherCounts: { [key: string]: number } = {};
    dayData.forEach(hour => {
      const desc = hour.weather[0].description;
      weatherCounts[desc] = (weatherCounts[desc] || 0) + 1;
    });
    
    const mostFrequentWeather = Object.keys(weatherCounts).reduce((a, b) => 
      weatherCounts[a] > weatherCounts[b] ? a : b
    );
    
    // Находим иконку для наиболее частого описания
    const mostFrequentHour = dayData.find(hour => 
      hour.weather[0].description === mostFrequentWeather
    );

    return {
      temp: Math.round(temps.reduce((a, b) => a + b) / temps.length),
      feels_like: Math.round(feels_like.reduce((a, b) => a + b) / feels_like.length),
      pressure: Math.round(pressures.reduce((a, b) => a + b) / pressures.length),
      humidity: Math.round(humidities.reduce((a, b) => a + b) / humidities.length),
      wind_speed: Math.round(wind_speeds.reduce((a, b) => a + b) / wind_speeds.length * 10) / 10,
      wind_deg: Math.round(wind_degs.reduce((a, b) => a + b) / wind_degs.length),
      pop: Math.round(pops.reduce((a, b) => a + b) / pops.length),
      visibility: Math.round(visibilities.reduce((a, b) => a + b) / visibilities.length / 1000), // Convert to km
      description: mostFrequentWeather,
      icon: mostFrequentHour?.weather[0].icon || dayData[0].weather[0].icon
    };
  };

  const groupByDay = (data: any[]) => {
    const grouped: { [key: string]: any } = {};
    
    data?.forEach(item => {
      const date = fromUnixTime(item.dt);
      const dateKey = format(date, 'yyyy-MM-dd');
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = {
          hours: [],
          dayName: getDayName(date)
        };
      }
      
      grouped[dateKey].hours.push({
        ...item,
        time: format(date, 'HH:mm'),
        dayName: getDayName(date)
      });
    });

    // Calculate averages for each day
    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].average = calculateDailyAverage(grouped[dateKey].hours);
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
    // <div className="hourly-5day-forecast p-4 rounded-2xl flex-wrap">
    <Carousel className='m-auto w-full max-w-2xl'>
      <CarouselContent className='pl-4'>
      {Object.entries(groupedData).map(([dateKey, dayData]) => (
        <CarouselItem key={dateKey} className="day-section bg-blue-300">
          <h4 className="day-title">{dayData.dayName}</h4>
          
          {/* Средние показатели за сутки */}
          <div className="daily-average-card">
            <div className="daily-average-header">
              <img 
                src={`https://openweathermap.org/img/wn/${dayData.average.icon}@2x.png`} 
                alt={dayData.average.description}
                className="weather-icon-large"
              />
              <div className="daily-average-temp">
                <div className="temp-main">{dayData.average.temp}°C</div>
                <div className="temp-feels">Ощущается как {dayData.average.feels_like}°C</div>
                <div className="weather-desc">{dayData.average.description}</div>
              </div>
            </div>
            <div className="daily-average-details">
              <div className="detail-item">
                <Droplet size={16} />
                <span>Влажность: {dayData.average.humidity}%</span>
              </div>
              <div className="detail-item">
                <Wind size={16} />
                <span>Ветер: {dayData.average.wind_speed} м/с, {getWindDirectionArrow(dayData.average.wind_deg)}{getWindDirection(dayData.average.wind_deg)}</span>
              </div>
              <div className="detail-item">
                <Gauge size={16} />
                <span>Давление: {dayData.average.pressure} гПа</span>
              </div>
              <div className="detail-item">
                <Eye size={16} />
                <span>Видимость: {dayData.average.visibility} км</span>
              </div>
              <div className="detail-item">
                <Thermometer size={16} />
                <span>Вероятность осадков: {dayData.average.pop}%</span>
              </div>
            </div>
          </div>

          {/* Почасовой прогноз */}
          {/* <div className="hourly-section">
            <h5 className="hourly-title">Почасовой прогноз:</h5>
            <div className="hourly-cards">
              {dayData.hours.map((hour: any) => (
                <div key={hour.dt} className="hourly-card">
                  <div className="hour-time">{hour.time}</div>
                  <img 
                    src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} 
                    alt={hour.weather[0].description}
                    className="weather-icon"
                  />
                  <div className="hour-temp">{Math.round(hour.main.temp)}°C</div>
                  <div className="hour-details">
                    <div className="hour-pop"><Droplet size={12} /> {Math.round(hour.main.humidity)}%</div>
                    <div className="hour-wind"><Wind size={12} /> {Math.round(hour.wind.speed)} м/с</div>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
        </CarouselItem >
      ))}
      
      </CarouselContent>
      <CarouselPrevious />
  <CarouselNext />
      </Carousel>
  );
};