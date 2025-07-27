import React, { useState } from 'react'
import Nav from '../nav/Nav'
import Features from '../features/Features'
import "./renderAll.css"
import Header from '../header/Header'
import AboutUs from '../aboutUs/AboutUs'
import HowItWorks from '../howitwork/Howitworks'
import Ready from '../ready/Ready'
import Footer from '../footer/Footer'
// import PPandTC from '../footer/PPandTC'
import TC from '../footer/TC'
import PPandTC from '../footer/PPandtTC'
const RenderAll = () => {

    const [showP, setShowP] = useState(false)
    const [showPP, setShowPP] = useState(false)


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
            <Footer  onShowPP={() =>
            setShowPP(true)}
                     onShowP={() =>
            setShowP(true)} />
            {showP && (
                <PPandTC 
                isActive={showP}
                onClose={() =>
                    setShowP(false)}/>
            )}
            {showPP && (
    <TC onClose={() =>
        setShowPP(false)}/>
)}
        </div>
    )
}

export default RenderAll