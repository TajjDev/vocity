import React from 'react'
import RenderAll from './component/renderAll/RenderAll'
import ProfileII from './component/Profile/ProfileII'
import UserProfile from './component/Profile/Profile'
import { BrowserRouter as Router,Routes, Route  } from 'react-router-dom'
import EventII from './component/Profile/Event/EventII'
import Nav from './component/nav/Nav'
import Footer from './component/footer/Footer'
import ScrollToTop from './ScrollToTop'
import ReloadOnBack from './ReloadOnBack'
// import UserCreation from './component/Profile/UserCreation'
// import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
// import Modal from './component/footer/PPandTC'
const App = () => {
  return (
    <>
    <Router>


      <Nav /> {/* Always visible */}

      <Routes>
        <Route path="/" element={<RenderAll />} />
        <Route path="/profile/*" element={<ProfileII />} />
        <Route path="/post/*" element={<EventII />} />
      </Routes>

      <Footer /> {/* Always visible */}
    </Router>
    {/* <UserProfile/> */}
    {/* <UserCreation/> */}
    {/* <BrowserRouter> */}
      {/* <Routes> */}
        {/* <Route path='/' element={""}/> */}
        {/* <Route path='privacy_policy' element= {<Modal/>} /> */}
      {/* </Routes> */}
    {/* </BrowserRouter> */}
    </>
  )
}

export default App
