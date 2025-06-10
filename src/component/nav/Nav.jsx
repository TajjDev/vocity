import React, { useEffect, useState } from 'react'
import vocityLogo from '/src/assets/image/logoVocity.png'
import "./nav.css"

const Nav = () => {
    const [activeLink, setActiveLink] = useState('home')
    const handleLinkClick = (link) => {
        setActiveLink(link)
    };
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }

    }
        , [])


    const scrollToFeatures = () => {
        const Features = document.getElementById('Features');
        if (Features) {
            Features.scrollIntoView({ behavior: "smooth" });
        }
    }
    const scrollToAbout = () => {
        const About = document.getElementById('About');
        if (About) {
            About.scrollIntoView
                ({ behavior: "smooth" });
        }
    }

    const scrollToHeader = () => {
        const Header = document.getElementById('render');
        if (Header) {
            Header.scrollIntoView
                ({ behavior: "smooth" });
        }
    }
    const scrollToHowItWorks = () => {
        const HowItWorks = document.getElementById('howitwork');
        if (HowItWorks) {
            HowItWorks.scrollIntoView
                ({ behavior: "smooth" });
        }
    }
    return (
        <div className={`nav ${scrolled ? 'scrolled' : ''}`}>
            {/* <div className='nav'> */}
            <div id="navImg">
                <img id='iimg' src={vocityLogo} alt="" />
                <p>Vocity</p>
            </div>

            <div id="navs">
                <a style={{ color: activeLink === 'home' ? 'rgba(255, 233, 152, 1)' : 'white', textDecoration: activeLink === 'home' ? 'underline' : 'none', textDecorationThickness: activeLink === 'home' ? '2px' : undefined, textUnderlineOffset: activeLink === 'home' ? '5px' : undefined }} onClick={(e) => { e.preventDefault(); scrollToHeader(); handleLinkClick('home') }} href="#">Home</a>
                <a style={{ color: activeLink === 'features' ? 'rgba(255, 233, 152, 1)' : 'white', textDecoration: activeLink === 'features' ? 'underline' : 'none', textDecorationThickness: activeLink === 'features' ? '2px' : undefined, textUnderlineOffset: activeLink === 'features' ? '5px' : undefined }} onClick={() => { scrollToFeatures(), handleLinkClick('features') }} href="#features">Features</a>
                <a style={{ color: activeLink === 'About' ? 'rgba(255, 233, 152, 1)' : 'white', textDecoration: activeLink === 'About' ? 'underline' : 'none', textDecorationThickness: activeLink === 'About' ? '2px' : undefined, textUnderlineOffset: activeLink === 'About' ? '5px' : undefined }} onClick={() => { scrollToAbout(); handleLinkClick('About') }} href="#aboutus">About us</a>
                <a style={{ color: activeLink === 'howitwork' ? 'rgba(255, 233, 152, 1)' : 'white', textDecoration: activeLink === 'howitwork' ? 'underline' : 'none', textDecorationThickness: activeLink === 'howitwork' ? '2px' : undefined, textUnderlineOffset: activeLink === 'howitwork' ? '5px' : undefined }} onClick={(e) => {e.preventDefault(); scrollToHowItWorks(); handleLinkClick('howitwork') }} href="#howitwork">How it works</a>
            </div>
            <div id="downNav">
                <a id='downloadNav' href="#">Download now</a>
            </div>
        </div>
    )
}

export default Nav