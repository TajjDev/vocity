import React from 'react'

const Stepp = ({ step, textSt, img, ttt, pp }) => {
    return (
        <>
            <div id="step1">
                <div id="bodypart">
                    <img id={pp} src={img} alt="" />
                </div>
                <p><span>{step}: </span>{textSt}<br />
                    {ttt}</p>
            </div>
        </>
    )
}

export default Stepp