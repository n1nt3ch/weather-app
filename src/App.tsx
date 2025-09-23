import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout'
import { ThemeProvider } from './context/theme-provider'

function App() {


  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme='dark'>
        <Layout>
          Hello
          <Routes>
            <Route>
              
            </Route>
          </Routes>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
