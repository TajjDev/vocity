import React from 'react'
import './header.css'
import Phone from '/src/assets/image/desktopPh.png'
const Header = () => {
    return (
        <div id='header'>
            <div id="headWord">
                <h5>Join the movement with <span id='headSpan'>VOCITY</span></h5>
                <p>VoteCity empowers you to participate in community decisions, stay updated on events, support local causes, and engage in announcements</p>
                
                <div id="headBtn">
                <a id='downloadHead' href="#">Download now</a>
                <a id='downloadHead2' href="#">Learn more</a>
               
                </div>
            </div>
            <div id="phone">
                <img src={Phone} alt="" />
            </div>
           
        </div>
    )
}

export default Header