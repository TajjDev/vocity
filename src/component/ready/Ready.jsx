import React from 'react'
import './ready.css'
import RevealOnScroll from '../onscroll/ReavealOnScroll'

const Ready = () => {
    return (
        <div id='Ready'>
            <RevealOnScroll>
                <div id="read">
                    <div id="readLink">
                        <h3>Ready to Take the Next Step</h3>
                        <div id="feattlink">
                            {/* <a id='downloadFeat' href="#">Download now</a> */}
                        </div>
                    </div>
                    <p>Whether you're looking to grow, learn, connect, or earn — our app brings everything to your fingertips.</p>
                </div>
            </RevealOnScroll>
            <RevealOnScroll>
                <div id="ReadBtn">
                    <a id='downloadRead' href="#">Download now</a>
                    <a id='downloadRead2' href="#">Learn more</a>
                </div>
            </RevealOnScroll>
        </div>
    )
}

export default Ready