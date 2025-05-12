import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './components/header'
import Footer from './components/footer'

function App() {
  const [count, setCount] = useState(0)
  const location = useLocation()

  return (
    <>
      <div>
        {location.pathname !== '/' && location.pathname !== '/agri' && location.pathname !== '/kisan' && <Header />}
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App