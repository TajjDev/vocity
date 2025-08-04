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
            p: 'Create your own polls, cast your vote,join the conversation and make an impact',
            span: 'Voting'
        },
        {
            img: event,
            h4: 'Event',
            p: 'Discover, Organize, and Register for local events.Stay connected!',
            span: 'Booking'
        }, {
            img: crowd,
            h4: 'Crowd',
            p: 'Bring your idea to life, get funding and donate to support cause that matters to you',
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
                            return <RevealOnScroll> <FeatProb key={index} img={data.img} h4={data.h4} p={data.p} span={data.span} /></RevealOnScroll>
                        })
                    }
                    
                </div>
                <div id="useAbt"></div>
            </RevealOnScroll>
           
        </div>
    )
}

export default Features