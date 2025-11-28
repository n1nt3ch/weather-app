import { useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useGetRainViewerDataQuery } from '@/store/api/rainApi/rainApi';

const BASE_MAP_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

export default function RainViewerMap() {
  const { data, refetch, error, isLoading } = useGetRainViewerDataQuery();

  useEffect(() => {
    const id = setInterval(() => {
      refetch();
    }, 10 * 60 * 1000); // 10 минут

    return () => clearInterval(id);
  }, [refetch]);

  if (isLoading) return <div>Загрузка карты осадков...</div>;
  if (error || !data?.current) return <div>Не удалось загрузить осадки{console.log(error)}</div>;

  return (
    <MapContainer
      center={[55.75, 37.62]}
      zoom={6}
      style={{ height: '600px', width: '100%' }}
    >
      {/* Базовая карта */}
      <TileLayer url={BASE_MAP_URL} />

      {/* Слой текущих осадков */}
      <TileLayer
        url={data.current}
        opacity={0.7}
        zIndex={10}
      />
    </MapContainer>
  );
}