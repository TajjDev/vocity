import React from 'react'
import './features.css'

const FeatProb = ({ img, h4, p, span }) => {
    return (
        <div id='eachFeat'>
            <img src={img} alt="" />
            <div id="textFeat">
                <h4>{h4} <br /> <span>{span}</span></h4>
                <p>{p}</p>
            </div>
        </div>
    )
}

export default FeatProb