import { useState, useEffect } from 'react'
import { Home } from './Pages/Home'
import { History } from './Pages/History'
import { BrowserRouter, Route, Link, Routes } from "react-router-dom"
export default function App() {

  return (

    <>
      <BrowserRouter>
      <nav className="header">
          
          <Link to="/"><h1> 2025 M. LEAGUE OF LEGENDS RANKED SOLO GRIND</h1></Link>
      </nav>

        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/History/:name/:id" element={<History />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}


