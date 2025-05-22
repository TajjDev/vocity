import React from 'react'
import './about.css'
import image from '/src/assets/vote.png'
import image2 from '/src/assets/voteimg.png'
import Button from '../join/Button'
// import Button from '../../component/join/Button'
// import image1 from '/src/assets/votepic.jpg'


const Aboutt = () => {
  return (
    <div id='about'>
    <div id="head">
      <div id="image">
        {/* <img id='im' src={image1} alt="" /> */}
        <img id='idm' src={image2} alt="" />
        <p>VOTECITY</p>
      </div>
      <div id="text">
        <h1>Join the Movement with <span>VoteCity</span></h1>
        <p>VoteCity empowers you to participate in community decisions, stay updated on events, support local causes, and engage in announcements</p>
      </div>
      <div className="bbb">
      <Button idd={"idd"} href={"/#"} text={"Download Now"}></Button>
<Button idd={"idd"} bod={"1px solid rgba(224, 224, 224, 1)"} fon={'none'} the={"rgba(224, 224, 224, 1)"} href={"/#"} text={"Learn More"}></Button>
      </div>
    </div>
    {/* <Button */}
    <div id="body1">
      <Button idd={"idd"} href={"/#"} text={"Download Now"}></Button>
      <Button idd={"idd"} bod={"1px solid rgba(224, 224, 224, 1)"} fon={'none'} the={"rgba(224, 224, 224, 1)"} href={"/#"} text={"Learn More"}></Button>
    </div>
    </div>
  )
}

export default Aboutt