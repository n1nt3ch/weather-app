import { WeatherDisplay } from "./WeatherDisplay";

const Main = () => {
  return (
    <div className='min-h-screen container mx-auto'>
      <div className="min-h-screen bg-gradient-to-br from-orange-300 to-orange-700">
          <div className="border rounded">
            <WeatherDisplay/>
          </div>
      </div>
    </div>
  )
}

export default Main;

