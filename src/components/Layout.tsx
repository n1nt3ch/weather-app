// import type { PropsWithChildren } from 'react'
import Header from './header/Header'
import Main from './main/Main'
import { AppBg } from './bg/AppBg'

// const Layout = ({ children }: PropsWithChildren) => {
const Layout = () => {
  return (
    <div className='relative bg-gradient-to-br from-backgroung-to-muted'>
      <Header/>
      <AppBg>
        <Main/>
      </AppBg>
    </div>
  )
}

export default Layout
