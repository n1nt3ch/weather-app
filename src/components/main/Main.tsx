import { WeatherDisplay } from "./WeatherDisplay"
// import RainViewerMap from "./RainViewerMap"
import { NewsFeed } from "./NewsFeed";

const Main = () => {
  return (
    <div className='min-h-screen container mx-auto'>
      <div className="min-h-screen ">
          <WeatherDisplay />
          {/* <RainViewerMap /> */}
          <NewsFeed></NewsFeed>
      </div>
    </div>
  )
}

export default Main;

