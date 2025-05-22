import React from 'react'
import Nav from '../nav/Nav'
import Features from '../features/Features'
import "./renderAll.css"
import Header from '../header/Header'
import AboutUs from '../aboutUs/AboutUs'
import HowItWorks from '../howitwork/Howitworks'
import Ready from '../ready/Ready'
const RenderAll = () => {
    return (
        <div id='render'>
            <div id="navAndHead">
                <Nav/>
                <Header/>
            </div>
            <Features/>
            <AboutUs/>
            <HowItWorks/>
            <Ready/>
        </div>
    )
}

export default RenderAll