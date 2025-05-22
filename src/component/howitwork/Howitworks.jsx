import React from 'react'
import './howitwork.css'
import image1 from "/src/assets/image/step1.png"
import image3 from "/src/assets/image/step3.png"
import image2 from "/src/assets/image/step2.png"
import HowitworkProb from './HowitworkProb'
import RevealOnScroll from '../onscroll/ReavealOnScroll'

const HowItWorks = () => {
  const hiwProbs = [
    {
      img: image1,
      span: "Step 1:",
      p: ` Download the App`,
      pp: '"Available on both Android and iOS."'
    },
    {
      img: image2,
      span: "Step 2:",
      p: ` Create an account`,
      pp: '"Available on both Android and iOS."'
    },
    {
      img: image3,
      span: "Step 3:",
      p: ` Explore the app`,
      pp: '"Available on both Android and iOS"'
    }
  ]
  return (
    <div id='howitwork'>
      <RevealOnScroll>
        <div id="hiw">
          <div id="hiwLink">
            <h3>How it works</h3>
            <div id="hiwlink">
              {/* <a id='downloadFeat' href="#">Download now</a> */}
            </div>
          </div>
          <div id="hiwP">
            <p>VoCity is easy to use! Here's how you can start making a difference in your community.”</p>
          </div>
        </div>
      </RevealOnScroll>
      <RevealOnScroll>
        <div id="howProbs">
          {
            hiwProbs.map((data, index) => {
              return <HowitworkProb key={index} img={data.img} pp={data.pp} p={data.p} span={data.span} />
            })
          }
        </div>
      </RevealOnScroll>
      <RevealOnScroll>
        <div id="hiwwlink">
          <a id='downloadHiww' href="#">Download Vocity now</a>
        </div>
      </RevealOnScroll>
    </div>
  )
}

export default HowItWorks