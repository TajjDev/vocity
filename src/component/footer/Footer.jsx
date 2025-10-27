import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
// import React from 'react'
import "./footer.css"
import face from "/src/assets/image/facebk.png"
import call from "/src/assets/image/call.png"
import google from "/src/assets/image/goofle.png"
import insta from "/src/assets/image/insta.png"
import ytbu from "/src/assets/image/youtube.png"
import whtapp from "/src/assets/image/whatsapp.png"
import tele from "/src/assets/image/telegram.png"
import RevealOnScroll from '../onscroll/ReavealOnScroll'
import NewsLetter from './NewsLetter'
import TC from '../footer/TC'
import PPandTC from '../footer/PPandtTC'
// import PPandTC from './PPandTC'
// import { Link } from 'react-router-dom'
const Footer = ({ onShowP, onShowPP }) => {
    const [showP, setShowP] = useState(false)
    const [showPP, setShowPP] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate();
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


    const goToSection = (sectionId) => {
        navigate("/"); // Go to homepage
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.scrollIntoView({ behavior: "smooth" });
            }
        }, 500); // Wait for homepage to load
    };

    return (
        <div id='Footer'>
            {/* <RevealOnScroll> */}
            <div id="footOne">
                <RevealOnScroll>
                    <div id="navi">
                        <div id="navvi">
                            <p>Navigation</p>
                        </div>
                        <div id="links">
                            <div id="linkone">
                                <a onClick={(e) => { e.preventDefault(); goToSection("render") }} href="#">Home</a>
                                <a onClick={() => { goToSection("Features"); }} href="#features">Features</a>
                                <a onClick={() => { goToSection("About"); }} href="#aboutus">About us</a>
                                <a onClick={(e) => { e.preventDefault(); goToSection("howitwork"); }} href="#howitwork">How it works</a>
                                <a href="#">Download</a>
                            </div>
                            <div id="linktwo">
                                <a href="#">About Votcity</a>
                                <a href="#">Gallery</a>
                                <a href="#">Blogs</a>
                                <a href="#">Contacts</a>
                            </div>
                        </div>
                    </div>
                </RevealOnScroll>
                <RevealOnScroll>

                    <div id="con">
                        <div id="conn">
                            <p id='conP'>Contact us</p>
                            <div id="conts">
                                <div id="contsO">
                                    <a href="tel:+2349139265486">+234 913  926-5486</a>
                                    <a href="tel:+2349139265486">+234 913  926-5486</a>
                                </div>
                                <div id="contsT">
                                    <a href="https://www.vocity.com.ngn">www.vocity.com.ng</a>
                                    <a href="mailto:vocityng@gmail.com">vocityng@gmail.com</a>
                                </div>
                            </div>
                        </div>
                        {/* </RevealOnScroll> */}
                        <RevealOnScroll>
                            <div id="contactss">
                                <div id="tex">
                                    <p>Follow us</p>
                                    <div id="foll">
                                        {/* <Link>hi</Link> */}
                                        <a href="#"><img src={face} alt="" /></a>
                                        <a href="#"><img src={google} alt="" /></a>
                                        <a href="#"><img src={insta} alt="" /></a>
                                        <a href="#"> <img src={ytbu} alt="" /></a>
                                    </div>

                                </div>
                                <div id="folChat">
                                    <p>Let's chat</p>                                <div id="chat">
                                        <a href="#"><img src={call} alt="" /></a>
                                        <a href="#"><img src={tele} alt="" /></a>
                                        <a href="#"><img src={whtapp} alt="" /></a>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </RevealOnScroll>

            </div>
            <RevealOnScroll>
                <div id="loc">
                    <NewsLetter
                        onShowPP={() =>
                            setShowPP(true)}
                        onShowP={() =>
                            setShowP(true)} />
                  
                  
                  
                  
                  
                  
                  
                  
                  
                  
                    <div className="dav">
                        <p>Location</p>
                        <p id='david'>
                            David's Court 2 Orchid road Lekki
                        </p>
                    </div>
                </div>
            </RevealOnScroll>
            <RevealOnScroll>
                <div id="footTwo">
                    <div id="copy">
                        <p>Copyright
                            Vocity Ltd
                            All rghts reserved</p>
                    </div>
                    <div id="enO">
                        <p>© 2025 vocity</p>
                    </div>
                </div>
            </RevealOnScroll>
              {showP && (
      <PPandTC
          isActive={showP}
          onClose={() =>
              setShowP(false)} />
  )}
  {showPP && (
      <TC onClose={() =>
          setShowPP(false)} />
  )}
        </div>
    )
}


export default Footer
