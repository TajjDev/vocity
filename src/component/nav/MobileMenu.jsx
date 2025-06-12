import React, { useState, useEffect } from 'react';
import './nav.css';
import menu from '/src/assets/image/menuPh.png'
// import { c } from 'vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [animationOut, setAnimationOut] = useState(false);
  const [animationin, setAnimationin] = useState(false)
  const openMenu = () => {
    // setAnimationOut(false);
    setIsOpen(true);
  };
  const closeMenu = () =>{
    setAnimationOut(true);
    setTimeout(() =>{
      setIsOpen(false);
      setAnimationOut(false);
      setAnimationin(false)
    },300)
  }
  useEffect(() =>{
    if (isOpen){
      setTimeout(() => {
        setAnimationin(true)
      }, 10);
    }
  },[isOpen])
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
    <nav className="mobile-nav">
      {!isOpen && (
        <button className="menu-toggle" onClick={openMenu}>
          <img src={menu} alt="" />
        </button>
      )}

      {isOpen && (
        <div className={`menu-content ${animationOut ? 'slide-out' : animationin ? 'slide-in' : ""}`}>
          <button className="cancel-btn" onClick={closeMenu}>
            ✖
          </button>
          <div id="navsM">
            <a style={{ color: activeLink === 'home' ? '' : 'white', textDecoration: activeLink === 'home' ? '' : 'none', textDecorationThickness: activeLink === 'home' ? '2px' : undefined, textUnderlineOffset: activeLink === 'home' ? '5px' : undefined }} onClick={(e) => { e.preventDefault(); scrollToHeader(); handleLinkClick('home'); closeMenu() }} href="#">Home</a>
            <a style={{ color: activeLink === 'features' ? '' : 'white', textDecoration: activeLink === 'features' ? '' : 'none', textDecorationThickness: activeLink === 'features' ? '2px' : undefined, textUnderlineOffset: activeLink === 'features' ? '5px' : undefined }} onClick={() => { scrollToFeatures(), handleLinkClick('features');closeMenu() }} href="#features">Features</a>
            <a style={{ color: activeLink === 'About' ? '' : 'white', textDecoration: activeLink === 'About' ? '' : 'none', textDecorationThickness: activeLink === 'About' ? '2px' : undefined, textUnderlineOffset: activeLink === 'About' ? '5px' : undefined }} onClick={() => { scrollToAbout(); handleLinkClick('About'); closeMenu() }} href="#aboutus">About us</a>
            <a style={{ color: activeLink === 'howitwork' ? '' : 'white', textDecoration: activeLink === 'howitwork' ? '' : 'none', textDecorationThickness: activeLink === 'howitwork' ? '2px' : undefined, textUnderlineOffset: activeLink === 'howitwork' ? '5px' : undefined }} onClick={(e) => { e.preventDefault(); scrollToHowItWorks(); handleLinkClick('howitwork'); closeMenu() }} href="#howitwork">How it works</a>
          </div>
          <div id="downNavM">
            <a onClick={closeMenu} id='downloadNavM' href="#">Download now</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MobileMenu;