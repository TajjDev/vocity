import React from 'react'
import './features.css'
import RevealOnScroll from '../onscroll/ReavealOnScroll'

const FeatProb = ({ img, h4, p, span }) => {
    return (
        <RevealOnScroll>
        <div id='eachFeat'>
            <img src={img} alt="" />
            <div id="textFeat">
                <h4>{h4} <br /> <span>{span}</span></h4>
                <p>{p}</p>
            </div>
        </div>
        </RevealOnScroll>
    )
}

export default FeatProb