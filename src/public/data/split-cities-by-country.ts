// split-cities-by-country.ts
import fs from 'fs';
import path from 'path';

// Тип для города
interface City {
  id: number;
  name: string;
  country: string;
  coord: { lat: number; lon: number };
}

// Путь к исходному файлу
const inputPath = path.join(__dirname, 'city.list.json');
// Папка для вывода
const outputPath = path.join(__dirname, 'output');

// Убедимся, что папка output существует
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

// Читаем файл
console.log('Чтение файла city.list.json...');
const data: City[] = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

console.log(`Загружено ${data.length} городов.`);

// Группируем по стране
const grouped = new Map<string, City[]>();

data.forEach(city => {
  const country = city.country;

  if (!grouped.has(country)) {
    grouped.set(country, []);
  }

  grouped.get(country)!.push(city);
});

console.log(`Группировка завершена. Найдено ${grouped.size} стран.`);

// Записываем файлы
grouped.forEach((cities, country) => {
  const filePath = path.join(outputPath, `${country}.json`);
  fs.writeFileSync(filePath, JSON.stringify(cities, null, 2));
  console.log(`Создан файл: ${filePath} (${cities.length} городов)`);
});

console.log('Разделение по странам завершено!');