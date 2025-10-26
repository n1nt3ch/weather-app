import { WeatherDisplay } from "./WeatherDisplay";

const Main = () => {
  return (
    <div className='min-h-screen container mx-auto  py-8'>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 py-8">
        <div className="container mx-auto px-4">
          <div className="p-4 border rounded mt-4">
            
            <WeatherDisplay/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main;

