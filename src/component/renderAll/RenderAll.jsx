import React from 'react'
import Nav from '../nav/Nav'
import Features from '../features/Features'
import "./renderAll.css"
import Header from '../header/Header'
import AboutUs from '../aboutUs/AboutUs'
const RenderAll = () => {
    return (
        <div id='render'>
            <div id="navAndHead">
                <Nav/>
                <Header/>
            </div>
            <Features/>
            <AboutUs/>
        </div>
    )
}

export default RenderAll