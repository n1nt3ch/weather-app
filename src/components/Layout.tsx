import type { PropsWithChildren } from 'react'
import Header from './header/Header'
import Main from './main/Main'
import { WeatherDisplay } from './main/WeatherDisplay'

// const Layout = ({ children }: PropsWithChildren) => {
const Layout = () => {
  return (
    <div className='bg-gradient-to-br from-backgroung-to-muted'>
      <Header/>
      <Main/>
        {/* {children} */}
      <footer className='border-t backdrop-blur py-12 
      supports-[backdrop-filter]:bg-background/60'>
        <div className='container mx-auto px-4 text-center text-gray-400'>
          <p>Salo uronili</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
