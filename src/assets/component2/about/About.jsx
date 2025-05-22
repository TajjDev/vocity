import { useState } from 'react'
import React from 'react'
import './abt.css'
import VisMis from './VisMis'
const About = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpandedM, setIsExpandedM] = useState(false);

  const longTextM = "Our Mission is to empower users with easy-to-use,monetizable, and reliable services."
  const p = `'' Votecity is a robust and integrated platform designed to facilitate seamless voting experiences, hosting of polls, event listing and booking, as well as
  crowdfunding project. By providing a comprehensive suite of tools, Votecity empowers individuals to participate in various activities with ease and efficiency.''`
  const longText = "Our vision is to become the leading e-service platform for voting, ticketing and fundraising in Africa, driving innovation, transparency and finacial inclusion.";
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };
  const toggleReadMoreM = () => {
    setIsExpandedM(!isExpandedM);
  };
  return (
    <>
      <div id='aboutt'>
        <div id="abt">
          {/* <h6>About The Company</h6> */}
          {/* <a href="https://www.vecteezy.com/free-videos/creative">Creative Stock Videos by Vecteezy</a> */}
          <p id='p'>What You Should Know About Vote<span>City</span></p>
          <p id="pp"> {isExpanded ? p : `${p.substring(0, 150)}...`}  <span className='vM' onClick={toggleReadMore}>{isExpanded ? 'Read Less' : 'Read More'}</span></p>
          <p id="ppp">'' Votecity is a robust and integrated platform designed to facilitate seamless voting experiences, hosting of polls, event listing and booking, as well as crowdfunding project. By providing a comprehensive suite of tools, Votecity empowers individuals to participate in various activities with ease and efficiency.''`</p>
        </div>
        <div id="misvis">
          <VisMis id={"mission"} textH3={"Mission"} p={longTextM}></VisMis>
          <VisMis id={"vision"} textH3={"Vision"} p={longText} />
        </div>
      </div>
      {/* <div id="con"> */}
      {/* <div id="contact"> */}
      {/* <h6>contact information</h6> */}
      {/* <p><span>Email</span>: support@votecity.ng</p> */}
      {/* <p><span>Phone Number</span>: +234 913 926 5486</p> */}
      {/* <p><span>Address</span>: Lagos State, Nigeria</p> */}
      {/* </div> */}
      {/* <div id="social"> */}
      {/* <h6>Our Social Media</h6> */}
      {/* </div> */}
      {/* </div> */}
    </>
  )
}
// # php -- BEGIN cPanel-generated handler, do not edit
// # Set the “ea-php81” package as the default “PHP” programming language.
{/* <IfModule mime_module> */ }
{/* AddHandler application/x-httpd-ea-php81 .php .php8 .phtml */ }
// </IfModule>
// # php -- END cPanel-generated handler, do not edit


export default About