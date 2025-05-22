import React from 'react'
import BG from '/src/assets/viddBG.mp4'
import './abt2.css'
import Button from '../join/Button'

const About2 = () => {
    return (
        <div className="wrap">
            <video autoPlay="true" loop muted playsInline src={BG}></video>
            <div id='show'>
                <div id="text">
                    <h1>Join the Movement with <span>VoteCity</span></h1>
                    <p>VoteCity empowers you to participate in community decisions, stay updated on events, support local causes, and engage in announcements</p>
                </div>
                <div className="bb">
                    <Button idd={"idd"} href={"/#"} text={"Download Now"}></Button>
                    <Button idd={"idd"} bod={"1px solid rgba(224, 224, 224, 1)"} fon={'none'} the={"rgba(224, 224, 224, 1)"} href={"/#"} text={"Learn More"}></Button>
                </div>
            </div>
        </div>
    )
}

export default About2