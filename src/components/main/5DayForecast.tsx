import React from 'react';
import { useState } from 'react';
import { useGet5DayForecastQuery } from '@/store/api/forecastApi/forecastApi';
import { getWindDirection, capitalize } from '@/lib/utils/otherFunc';
import { format, fromUnixTime, isToday, isTomorrow } from 'date-fns';
import { ru } from 'date-fns/locale';
import { min, max } from 'lodash';

import { Wind, Droplet, CloudDrizzle, Gauge, Eye, X } from "lucide-react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { buttonAnimation } from '@/lib/animations';

interface Hourly5DayForecastProps {
  lat: number;
  lon: number;
}

interface DailyAverage {
  tempMin: number;
  tempMax: number;
  feels_like: number;
  pressure: number;
  humidity: number;
  wind_speed: number;
  wind_deg: number;
  pop: number;
  visibility: number;
  precipitation: number
  description: string;
  icon: string;
}

export const Hourly5DayForecast: React.FC<Hourly5DayForecastProps> = ({ lat, lon }) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const { data: forecastData, isLoading, error } = useGet5DayForecastQuery({ lat, lon });

  const getDayName = (date: Date): string => {
    if (isToday(date)) return 'Сегодня';
    if (isTomorrow(date)) return 'Завтра';
    return format(date, 'EEEEEE, ii.LL', { locale: ru });
  };

  const calculateDailyAverage = (dayData: any[]): DailyAverage => {
    const tempsMin = dayData.map(hour => hour.main.temp_min);
    const tempsMax = dayData.map(hour => hour.main.temp_max);
    const feels_like = dayData.map(hour => hour.main.feels_like);
    const pressures = dayData.map(hour => hour.main.pressure);
    const humidities = dayData.map(hour => hour.main.humidity);
    const wind_speeds = dayData.map(hour => hour.wind.speed);
    const wind_degs = dayData.map(hour => hour.wind.deg);
    const pops = dayData.map(hour => hour.pop * 100);
    const visibilities = dayData.map(hour => hour.visibility);
    const precipitations = dayData.map((hour) => {
      const rain = hour.rain && hour.rain['3h'] ? hour.rain['3h'] : 0;
      const snow = hour.snow && hour.snow['3h'] ? hour.snow['3h'] : 0;
      return rain + snow;
    });

    const weatherCounts: { [key: string]: number } = {};
    dayData.forEach(hour => {
      const desc = hour.weather[0].description;
      weatherCounts[desc] = (weatherCounts[desc] || 0) + 1;
    });
    
    const mostFrequentWeather = Object.keys(weatherCounts).reduce((a, b) => 
      weatherCounts[a] > weatherCounts[b] ? a : b
    );

    const mostFrequentHour = dayData.find(hour => 
      hour.weather[0].description === mostFrequentWeather
    );

    return {
      tempMin: Math.round(min(tempsMin)),
      tempMax: Math.round(max(tempsMax)),
      feels_like: Math.round(feels_like.reduce((a, b) => a + b) / feels_like.length),
      pressure: Math.round(pressures.reduce((a, b) => a + b) / pressures.length),
      humidity: Math.round(humidities.reduce((a, b) => a + b) / humidities.length),
      wind_speed: Math.round(wind_speeds.reduce((a, b) => a + b) / wind_speeds.length * 10) / 10,
      wind_deg: Math.round(wind_degs.reduce((a, b) => a + b) / wind_degs.length),
      pop: Math.round(pops.reduce((a, b) => a + b) / pops.length),
      visibility: Math.round(visibilities.reduce((a, b) => a + b) / visibilities.length / 1000),
      precipitation: Math.round(precipitations.reduce((a, b) => a + b) * 10) / 10,
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

    Object.keys(grouped).forEach(dateKey => {
      grouped[dateKey].average = calculateDailyAverage(grouped[dateKey].hours);
    });
    
    return grouped;
  };

  const handleDayClick = (dateKey: string) => {
    setSelectedDay(dateKey);
  };

  const closeHourlyView = () => {
    setSelectedDay(null);
  };

  const renderHourlyForecast = (hours: any[], dayName: string) => {
    return (
      <div 
        className="fixed inset-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-center z-50 p-4">
        <div className="flex flex-col gap-4 bg-white rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Почасовой прогноз на <span className='font-bold'>{dayName.toLowerCase()}</span></h3>
            <button 
              onClick={closeHourlyView}
              className={` hover:bg-gray-300 rounded-full transition-colors`} 
            >
              <X size={24} />
            </button>
          </div>
          <Carousel className='w-full px-6 py-4 border rounded-2xl'>
            <CarouselContent className='pl-4 w-full gap-2'>
              {hours.map((hour: any) => 
                (
                  <CarouselItem key={hour.dt} className="day-section flex flex-col justify-center items-center gap-2 bg-blue-100 rounded-lg transition-colors p-2 max-w-30">
                    <div className="font-medium">{hour.time}</div>
                    <img 
                      src={`https://openweathermap.org/img/wn/${hour.weather[0].icon}.png`} 
                      alt={hour.weather[0].description}
                      className="weather-icon mx-auto w-12 h-12"
                    />
                    <div className="text-lg font-bold">{Math.round(hour.main.temp)}°C</div>
                    <div className="hour-details flex flex-col items-start text-sm space-y-1">
                      <div className="flex gap-1">
                        <Droplet size={12} /> 
                        {Math.round(hour.main.humidity)}%
                      </div>
                      <div className="flex gap-1">
                        <Wind size={12} /> 
                        {Math.round(hour.wind.speed)} м/с
                      </div>
                      <div className="detail-item flex items-center gap-2">
                        <Gauge size={16} className="text-gray-500" />
                        <span className="text-sm">{Math.round(hour.main.pressure * 0.75)} мм.рт.ст</span>
                      </div>
                      <div className="detail-item flex items-center gap-2">
                        <CloudDrizzle size={16} className="text-gray-500" />
                        {/* <span className="text-sm">{hour.rain['3h'] + hour.snow['3h']} мм</span> */}
                      </div>
                    </div>
                  </CarouselItem>
                )
              )}
            </CarouselContent>
            <CarouselPrevious className='hover:bg-gray-300 transition-colors'/>
            <CarouselNext className='hover:bg-gray-300 transition-colors'/>
          </Carousel>
        </div>
      </div>
    );
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
    <>
      <Carousel className='w-full mt-8 px-6 py-4 border rounded-2xl'>
        <h3 className='text-2xl font-bold mb-2'>Прогноз на 5 дней</h3>
        <CarouselContent className='pl-4 w-full gap-2'>
          {Object.entries(groupedData).map(([dateKey, dayData]) => (
            <CarouselItem 
              key={dateKey} 
              onClick={() => handleDayClick(dateKey)} 
              className="day-section max-w-55 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors p-4"
            >
              <h4 className="text-xl font-semibold mb-2">{capitalize(dayData.dayName)}</h4>
              
              <div className="daily-average-card rounded-lg p-2 flex flex-col items-center">
                <div className="daily-average-header flex flex-col items-center mb-4">
                  <img 
                    src={`https://openweathermap.org/img/wn/${dayData.average.icon}@2x.png`} 
                    alt={dayData.average.description}
                    className="weather-icon-large w-16 h-16"
                  />
                  <div className="daily-average-temp">
                    <div className='flex justify-center gap-8 mb-2'>
                      <span className="temp-main text-2xl font-bold">{dayData.average.tempMax}°</span>
                      <span className="temp-main text-2xl font-bold text-gray-500">{dayData.average.tempMin}°</span>
                    </div>
                    <div className="text-center w-full max-h-6">
                      <span className='text-sm text-nowrap text-gray-600'>{capitalize(dayData.average.description)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="detail-item flex items-center gap-2">
                    <Wind size={16} className="text-gray-500" />
                    <span className="text-sm">{Math.round(dayData.average.wind_speed)} м/с, {getWindDirection(dayData.average.wind_deg)}</span>
                  </div>
                  <div className="detail-item flex items-center gap-2">
                    <Gauge size={16} className="text-gray-500" />
                    <span className="text-sm">{Math.round(dayData.average.pressure * 0.75)} мм.рт.ст</span>
                  </div>
                  <div className="detail-item flex items-center gap-2">
                    <CloudDrizzle size={16} className="text-gray-500" />
                    <span className="text-sm">{dayData.average.precipitation} мм</span>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className='carousel-btn hover:bg-gray-300 transition-colors'/>
        <CarouselNext className='carousel-btn hover:bg-gray-300 transition-colors'/>
      </Carousel>

      {/* Модальное окно с почасовым прогнозом */}
      {selectedDay && groupedData[selectedDay] && 
        renderHourlyForecast(groupedData[selectedDay].hours, groupedData[selectedDay].dayName)
      }
    </>
  );
};