import React, { useEffect, useRef, useState } from 'react'
import './aboutUs.css'
import image from "/src/assets/image/aboutUs.png"
import RevealOnScroll from '../onscroll/ReavealOnScroll';

const CountUp = ({ target = 100, duration = 2000, label }) => {
    const [count, setCount] = useState(0);
    const ref = useRef();
    const hasStarted = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted.current) {
                    hasStarted.current = true;
                    const increment = target / (duration / 20);
                    let current = 0;
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            clearInterval(timer);
                            setCount(target);
                        } else {
                            setCount(Math.floor(current));
                        }
                    }, 20);
                }
            },
            { threshold: 0.5 }
        )
        if (ref.current) {
            observer.observe(ref.current);
        }
        return () => {
            if (ref.current) observer.unobserve(ref.current);
        }
    }, [target, duration])
    return (
        <div id='counting' ref={ref}>
            {count}+
        </div>
    )
}
const AboutUs = () => {
    return (
        <div id='About'>
            <RevealOnScroll>
                <div id="abt">
                    <div id="abtLink">
                        <h3>About us</h3>
                        <div id="abttlink">
                            {/* <a id='downloadFeat' href="#">Download now</a> */}
                        </div>

                    </div>
                    <div id="abtP">
                        <p>Vocity is a robust and integrated platform designed to facilitate seamless voting experiences, hosting of polls, event listing and booking, including projects like crowdfunding. By providing a comprehensive suite of tools, Vocity empowers individuals to participate in various activities with ease and efficiency.</p>
                    </div>
                </div>
            </RevealOnScroll>
            <RevealOnScroll>
                <div id="MissVis">
                    <div id="img">
                        <img src={image} alt="" />
                    </div>
                    <div id="misVis">
                        <RevealOnScroll>
                        <div id="miss">
                            <h4>Our <span>Missions</span></h4>
                            <p>Our mission is to empower users with an easy-to-use, monetizable, and reliable service.</p>
                        </div>
                        </RevealOnScroll>
                        <RevealOnScroll>
                        <div id="vis">
                            <h4>Our <span>Vision</span></h4>
                            <p>Our vision is to become the leading e-service platform for voting, ticketing and fundraising in Africa, driving innovation, transparency and financial inclusion.</p>
                        </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </RevealOnScroll>
            <RevealOnScroll>
                <div id="count">
                    <div className="counts">
                        <CountUp target={100} duration={2000} />
                        <p>Project Posts</p>
                    </div>
                    <div className="counts">
                        <CountUp target={666} duration={2000} />
                        <p>Test Completed</p>
                    </div>
                    <div className="counts">
                        <CountUp target={50} duration={2000} />
                        <p>sponsors</p>
                    </div>
                    <div className="counts">
                        <CountUp target={10} duration={2000} />
                        <p>Events Created</p>
                    </div>


                </div>
            </RevealOnScroll>
        </div>
    )
}

export default AboutUs