import { WeatherDisplay } from "./WeatherDisplay"
const Main = () => {
  return (
    <div className='min-h-screen container mx-auto'>
      <div className="min-h-screen ">
          <div className="border rounded">
            <WeatherDisplay/>
          </div>
      </div>
    </div>
  )
}

export default Main;

