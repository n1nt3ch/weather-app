import { WeatherDisplay } from "./WeatherDisplay";

const Main = () => {
  return (
    <div className='min-h-screen container mx-auto'>
      <div className="min-h-screen bg-gradient-to-br from-orange-300 to-orange-700 py-8">
        <div className="container mx-auto px-4">
          <div className="p-4 border rounded h-1/2">
            <WeatherDisplay/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main;

