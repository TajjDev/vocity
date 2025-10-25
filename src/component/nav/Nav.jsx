import { useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import vocityLogo from '/src/assets/image/logoVC.png'
import "./nav.css"
import MobileMenu from './MobileMenu'

const Nav = () => {
  const location = useLocation();
  const isUserProfile = location.pathname.startsWith("/profile/")
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
    const Features = document.getElementById('phone');
    if (Features) {
      Features.scrollIntoView({ behavior: "smooth" });
    }
  }
  const scrollToAbout = () => {
    const About = document.getElementById('useAbt');
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

      {!isUserProfile &&  (
      <div id="navs">
        <a
          className={`nav-link ${activeLink === 'home' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToHeader();
            handleLinkClick('home');
          }}
          href="#"
        >
          Home
        </a>

        <a
          className={`nav-link ${activeLink === 'features' ? 'active' : ''}`}
          onClick={() => {
            scrollToFeatures();
            handleLinkClick('features');
          }}
          href="#features"
        >
          Features
        </a>

        <a
          className={`nav-link ${activeLink === 'About' ? 'active' : ''}`}
          onClick={() => {
            scrollToAbout();
            handleLinkClick('About');
          }}
          href="#aboutus"
        >
          About us
        </a>

        <a
          className={`nav-link ${activeLink === 'howitwork' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            scrollToHowItWorks();
            handleLinkClick('howitwork');
          }}
          href="#howitwork"
        >
          How it works
        </a>
      </div>
      )}
      <div id="downNav">
        <a id='downloadNav' href="#">Download now</a>
      </div>
      <MobileMenu />
    </div>
  )
}


export default Nav
