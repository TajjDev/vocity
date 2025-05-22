import React from 'react'
import './join.css'
import Button from './Button'
const Join = () => {
    return (
        <div id='join'>
            <h1>Join the movement with <span>vote</span>City</h1>
            <p><span>Vote</span>City empowers you to participate in community decisions, stay updated on events, support local causes, and engage in announcements</p>
            <div id="btn">
                <Button  href={"/#"} text={"Download Now"}></Button>
                <Button bod={"1px solid rgba(224, 224, 224, 1)"} fon={'none'} the={"rgba(224, 224, 224, 1)"} href={"/#"} text={"Learn More"}></Button>
            </div>
        </div>
    )
}

export default Join