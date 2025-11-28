import './App.css'
import Layout from './components/Layout'
import { ThemeProvider } from './context/theme-provider'


function App() {
  return (
      <ThemeProvider defaultTheme='dark'>
        <Layout />
      </ThemeProvider>
  )
}

export default App
