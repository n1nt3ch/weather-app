import { useGetCurrentWeatherQuery } from "@/store/api/weatherApi/weatherApi"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Hourly5DayForecast } from "./5DayForecast"
import type { RootState } from "@/store"

export const WeatherDisplay = () => {
  const currentCity = useSelector((state: RootState) => state.city.selectedCity)
  const { data: weather, isLoading } = useGetCurrentWeatherQuery(currentCity, {
  })
  const [daysCount, setDaysCount] = useState<number>(7);

  const CurrentDate = () => {
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

    return <div>{dayName} | {day}.{month}.{year}</div>;
  };

  const capitalizeFirstLetterInFirstWord = (str: string):string  => {
    const [firstWord, ...anyWords] = str.split(' ');
    const newWord = firstWord.split('')
    return `${newWord[0].toUpperCase()}${newWord.join('').slice(1)} ${anyWords.join(' ')}`
  }

  // const currentWeatherIcon = (weatherType) => {
  //   switch (weatherType) {
  //     case 'Thunderstorm':
  //       return '';
  //     case 'Drizzle':
  //       return '';
  //     case 'Rain':
  //       return '';
  //     case 'Snow':
  //       return '';
  //     case 'Atmosphere':
  //       return '';
  //     case 'Clear':
  //       return '';
  //     case 'Clouds':
  //       return '';
  //     default: 
  //       return;
  //   }
  // }
 
  return (
    <>
      {isLoading && <div>Загрузка погоды...</div>}

      {weather && (
        <div className="py-8 rounded">
          <div className="flex justify-between">
              <div className="flex-col">
                <h1 className="text-5xl mb-24">{capitalizeFirstLetterInFirstWord(weather.weather[0].description)}</h1>
                <div className="flex flex-col content-between">
                  <span className="text-6xl">
                    {Math.round(weather.main.temp)}°C
                  </span>
                  <span className="text-2xl">
                    {CurrentDate()}
                  </span>
                </div>
              </div>
              <div className="flex items-center">
                <img
                  src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                  alt={weather.weather[0].description}
                />
                <p>{weather.weather[0].main}</p>
              </div>
            </div>
            <Hourly5DayForecast
              lat={weather.coord.lat}
              lon={weather.coord.lon}
              cityName={currentCity}
            />
            
          {/* <h4 className="font-bold text-xl">
            {weather.name}, {weather.sys.country}
          </h4>
          <div className="flex items-center mt-2">
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
              alt={weather.weather[0].description}
            />
            <span className="text-2xl ml-2">
              {Math.round(weather.main.temp)}°C
            </span>
          </div>
          <p className="capitalize">{weather.weather[0].description}</p>
          <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
            <div>Ощущается: {Math.round(weather.main.feels_like)}°C</div>
            <div>Влажность: {weather.main.humidity}%</div>
            <div>Ветер: {weather.wind.speed} м/с</div>
            <div>Давление: {Math.round(weather.main.pressure * 0.75)} мм.рт.ст</div>
          </div> */}
        </div>
      )}
    </>
  )
}