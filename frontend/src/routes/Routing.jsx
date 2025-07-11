import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Home } from '../views/Home'
import { AboutMe } from '../components/public/AboutMe'
import { References } from '../components/public/References'
import { Contact } from '../components/public/Contact'
import { Login } from '../components/public/Login'



export const Routing = () => {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/references" element={<References />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>

    </BrowserRouter>
  )
}
