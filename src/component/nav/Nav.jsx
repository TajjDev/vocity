import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import vocityLogo from "/src/assets/image/logoVC.png";
import "./nav.css";
import MobileMenu from "./MobileMenu";

const Nav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isUserProfile =
    location.pathname.startsWith("/profile/") ||
    location.pathname.startsWith("/post/");

  const [activeLink, setActiveLink] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll to a specific section
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Navigate to home then scroll to section
  const goToSection = (id) => {
    navigate("/");
    setTimeout(() => scrollToSection(id), 500);
  };
  const handleLinkClick = (link, sectionId) => {
    setActiveLink(link);
  
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // the space you want above the section
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const scrollTarget = elementTop - offset;
  
      window.scrollTo({
        top: scrollTarget,
        behavior: 'smooth'
      });
    }
  };
  

  return (
    <div className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div id="navImg">
        <img id="iimg" src={vocityLogo} alt="Vocity Logo" />
        <p>Vocity</p>
      </div>

      {!isUserProfile && (
        <div id="navs">
          <a
            className={`nav-link ${activeLink === "home" ? "active" : ""}`}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("home", "render");
            }}
          >
            Home
          </a>

          <a
            className={`nav-link ${activeLink === "features" ? "active" : ""}`}
            href="#features"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("features", "Features");
            }}
          >
            Features
          </a>

          <a
            className={`nav-link ${activeLink === "about" ? "active" : ""}`}
            href="#aboutus"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("about", "useAbt");
            }}
          >
            About us
          </a>

          <a
            className={`nav-link ${activeLink === "howitwork" ? "active" : ""}`}
            href="#howitwork"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick("howitwork", "howitwork");
            }}
          >
            How it works
          </a>
        </div>
      )}

      <div
        style={{
          display: "flex",
          width: !isUserProfile ? "18%" : "35%",
          justifyContent: "end",
        }}
      >
        <div
          id="downNav"
          style={{ width: !isUserProfile ? "100%" : "" }}
        >
          <a
            id="downloadNav"
            href="https://api.votecity.ng/media/apps/vocity-app.apk"
            style={{ width: !isUserProfile ? "100%" : "80%" }}
          >
            Download now
          </a>
        </div>

        {isUserProfile && (
          <a
            className="navi"
            href="#aboutus"
            onClick={(e) => {
              e.preventDefault();
              goToSection("useAbt");
            }}
          >
            About us
          </a>
        )}
      </div>

      <MobileMenu />
    </div>
  );
};

export default Nav;
