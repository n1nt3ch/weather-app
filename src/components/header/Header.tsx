import { useTheme } from "@/context/theme-provider"
import { Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom"


const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 border-b z-50 bg-background/95 backdrop-blur py-2 supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link to={'/'}>
          <img src={theme === 'dark' ? 'src/context/weather-logo(dark).png' : 'src/context/weather-logo(light).png'} 
          alt="Weather app logo" 
          className="h-14"/>
        </Link>
        <div>
          <button onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`flex items-center cursor-pointer transition-transform duration-500
            ${isDark ? 'rotate-180' : 'rotate-0'}
            `}
          >
            {isDark ? (
              <Sun className="h-6 w-6 text-yellow-500 rotate-0 transition-all"></Sun>
              ) : (
                <Moon className="h-6 w-6 text-blue-500 rotate-0 transition-all"></Moon>
              )}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
