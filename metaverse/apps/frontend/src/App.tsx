import { Route, Routes } from 'react-router-dom'
import Navbar from './Navbar'
import Home from './pages/Home'

const App = () => {
  return (
    <div className='text-black w-screen h-[calc(100vh+2rem)]'>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
      </Routes>
    </div>
  )
}

export default App
