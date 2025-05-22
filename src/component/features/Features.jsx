import React from 'react'
import './features.css'
import poll from "/src/assets/image/poll.png"
import event from "/src/assets/image/event.png"
import crowd from "/src/assets/image/crowd.png"
import FeatProb from './FeatProb'
import RevealOnScroll from '../onscroll/ReavealOnScroll'

const Features = () => {
    const probs = [
        {
            img: poll,
            h4: 'Poll',
            p: 'We are passionate about helping businesses grow and succeed in the digital age. We take pride in our work and strive to exceed your expectations every time.',
            span: 'Voting'
        },
        {
            img: event,
            h4: 'Event',
            p: 'Our vision is to become the leading e-service platform for voting, ticketing and fundraising in Africa, driving innovation, transparency and financial inclusion.',
            span: 'Booking'
        }, {
            img: crowd,
            h4: 'Crowd',
            p: 'Our vision is to become the leading e-service platform for voting, ticketing and fundraising in Africa, driving innovation, transparency and financial inclusion.',
            span: 'Funding'
        }
    ]

    return (
        <div id='Features'>
            <RevealOnScroll>
                <div id="feat">
                    <div id="featLink">
                        <h3>Features</h3>
                        <div id="feattlink">
                            {/* <a id='downloadFeat' href="#">Download now</a> */}
                        </div>

                    </div>
                    <p>This are the main features of the Vocity app</p>
                </div>
            </RevealOnScroll>
            <RevealOnScroll>
                <div id="pollProb">
                    {
                        probs.map((data, index) => {
                            return <FeatProb key={index} img={data.img} h4={data.h4} p={data.p} span={data.span} />
                        })
                    }
                </div>
            </RevealOnScroll>
        </div>
    )
}

export default Features