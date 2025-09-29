import type { PropsWithChildren } from 'react'
import Header from './header/Header'
import { WeatherSearch } from './WeatherSearch'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className='bg-gradient-to-br from-backgroung-to-muted'>
      <Header/>
      <main className='min-h-screen container mx-auto px-4 py-8'>
        {children}
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-white text-center mb-8">
              Погодное приложение
            </h1>
            <WeatherSearch />
          </div>
        </div>
      </main>
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
