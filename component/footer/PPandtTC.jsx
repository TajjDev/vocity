import React, { useEffect, useState } from 'react'
import "./ppandtc.css"
// import Styles from "./ppandtc.module.css"
const PPandTC = ({ onClose }) => {

  // const [show, setShow] = useState(false)
// 
  // useEffect( () => {setShow(true),10;
  // },[] )
// 
  // const handleCls = ()=>{
    // setShow(false);
    // setTimeout (()=> onClose(),300);
  // }

  return (
    <div id='modal'>
      <div id="popupPR">
        <h3>PRIVACY POLICY FOR WEBSITE</h3>
        <h5>Effective date: December 12, 2024</h5>
        <h5>Applicable to:</h5>
        <h4>1. DEFINITIONS</h4>
        <p><b>"Data Controller"</b> means the publisher and owner of the Website and the party
          also
          responsible for the collection of data. <br />
          <b>"Data Processing Officer"</b> means the party responsible for overseeing data
          protection strategy
          and implementation to ensure compliance. <br />
          <b>"Content"</b> means any content, writing, images, audiovisual content, or other
          information
          published on this Website. <br />
          <b>"Parties"</b> means both You (the user of the Service) and the Data Controller:
          Vocity Limited,
          Tajudeen Khabab. <br />
          <b>"Personal Data"</b> means any personal information collected for You in relation to
          your use of
          this service which is capable of identifying You. <br />
          <b>"Service"</b> means the Website, known as <a href=""> www.vocity.ng</a>, including all pages,
          subpages, blogs,
          forums, and other connected internet content whatsoever. <br />
          <b>"Third Party Service Provider"</b> means a party or parties contracted by the owner/
          data
          controller to process the personal data of the user. <br />
          <b>"You, Yours"</b> The user of this Website.</p>
        <h4>2. INTRODUCTION</h4>
        <p>This Privacy Policy is designed to inform You about the Personal Data we
          collect, how we
          collect this data, the uses of the data, and Your rights relating to the
          Personal Data when You
          use this Service.
          We are committed to protecting your Personal Data while You use this Website.
          By continuing to use our Website, You acknowledge that You have reviewed the
          Privacy Policy
          and agree to its terms. This also means that You have consented to the use of
          Your Personal
          Data and have accepted the applicable disclosures.</p>
        <h4>3. CONTACT</h4>
        <p>The operator who is also the party responsible for the collection of data is
          as
          follows: <br />
          Vocity
          Limited and can be contacted as follows: <br />
          <b>Lekki Lagos, Nigeria</b> <br />
          <b>+234 9139265486</b> <br />
          <b>support@vocity.ng</b> <br />
          The Data Protection Officer is as follows: <br />
          Tajudeen Khabab and can be contacted
          as follows: <br />
          <b>Surulere Lagos, Nigeria</b> <br />
          <b>+234 7010409001</b> <br />
          <b>tajudeenkhabab2@gmail.com</b></p>
        <h4>4. THE PERSONAL DATA WE COLLECT FROM YOU</h4>
        <p>We collect various information to enable us to provide good service to all
          our
          users. Depending
          on how our service will be used, the different types of Personal Data we collect
          are as follows: <br />
          <b>A. All users:</b> We will collect passive information from all users. This
          information includes
          cookies, IP address information, location information, and certain browser
          information. <br />
          <b>B. User experience:</b> From time to time, we may also request certain Personal Data
          that
          may be necessary to improve our Service.</p>
        <h4>5. THE PERSONAL DATA WE COLLECT AS YOU USE OUR SERVICE</h4>
        <p>We use the following to collect Personal Data from You:
          Cookies: We use the data collected by the cookies to offer You the best
          experience on our
          Website. Cookies are information stored on Your browser when You visit our
          Website or use a
          social network with Your PC, Smartphone, or Tablet. They contain various data,
          including the
          name of the server from which it comes, the numeric identifier, etc. The types
          of cookies we use
          are as follows:
          Technical cookies: These cookies are essential for the correct functioning of
          our Website and
          are required to provide the Service required to our users.
          Support in configuring your browser: You can manage these cookies through the
          settings of
          Your browser on Your device. However, deleting cookies from Your browser may
          remove the
          preferences You have set for this Website.
          Log Data: We also use log files which store automatic information collected whe
          users visit
          this Website. The log data which may be collected includes: <br />
          <b>(i)</b> The domain and host from which You access the Website <br />
          <b>(ii)</b> Name of the Internet Service Provider (ISP) <br />
          <b>(iii)</b> Date and time of visit <br />
          <b>(iv)</b> Your computer operating system and browser software <br />
          <b>(v)</b> Web pages visited, the duration, and frequency of visits <br />
          <b>(vi)</b> Your Internet Protocol (IP) address</p>
        <h4>6. THIRD PARTIES</h4>
        <p>We may utilize third party service providers, from time to time, to help in
          processing Your
          Personal Data and help us with our Website.
          We share Your Personal Data with third parties in order to protect our rights,
          properties, and
          safety, and for the safety of users of this Website.</p>
        <h4>7. PURPOSE OF PROCESSING PERSONAL DATA</h4>
        <p>We collect and use Your Personal Data for the following reasons: <br />
          <b>(i)</b> To provide our Service and to maintain and make improvements to the Service
          we
          provide to You <br />
          <b>(ii)</b> To provide personalized Service to You, including making recommendations and
          providing personalized content <br />
          <b>(iii)</b> To provide You with updates on the Website and related items <br />
          <b>(iv)</b> To provide analytics to understand how our Service is used.</p> <br />
        <h4>8. STORAGE OF PERSONAL DATA</h4>
        <p>We take the security of the Personal Data we collect very seriously, and we
          take
          reasonable
          measures to reduce the risk of accidental destruction, loss, or unauthorized
          access to such
          information. However, please note that no system involving the transmission of
          information via
          electronic storage systems or the internet is completely secure.
          The Personal Data and any other information we have about You may be stored for
          such period
          as we may determine until You withdraw Your consent.
          Note that You can withdraw Your consent to store Your Personal Data at any time.
          Once this is
          done, all Personal Data and information we have about You will be deleted.</p>
        <h4>9. PROTECTION OF PERSONAL DATA</h4>
        <p>Our Service is built with strong security features that continuously protect
          Your Personal Data.
          Our security features help us detect and block security threats. If we detect
          any security risk, we
          may inform You and guide You through steps to stay protected.</p>
        <h4>10. DISCLOSURE OF PERSONAL DATA</h4>
        <p>We do not disclose Your Personal Data except for any of the following reasons: <br />
          <b>(i)</b> If You have granted us the permission to do so: We will disclose Your
          Personal Data
          where we have received Your unequivocal consent and permission to do so. However,
          such consent may be withdrawn at any time. <br />
          <b>(ii)</b> For the purposes of processing Your Personal Data: We may disclose Your
          Personal <br />
          Data to trusted businesses or persons for the purpose of processing Your
          Personal Data
          for us, based on our instruction and in compliance with our Privacy Policy.<br />
          <b>(iii)</b> For any other reason that may be necessary for the operation of our Website.
        </p>
        <h4>11. LINKS TO THIRD PARTY SITES/SERVICES</h4>
        <p>The website may contain links to other websites which we believe may offer
          useful information.
          These linked websites are not under our control and this Privacy Policy does not
          apply to these
          websites. We suggest that You contact those websites directly for information on
          their privacy
          policy, security, data collection, and distribution policies.</p>
        <h4>12. ACCESSING, MODIFYING AND DELETING YOUR PERSONAL DATA</h4>
        <p>If you wish to access, review, or modify any information we have about You,
          You
          may do so by
          simply contacting us at the following email address: support@vocity.ng. You
          may also request
          that we delete any information belonging to You that we have stored.</p>
        <h4>13. YOUR RIGHTS</h4>
        <p>Your rights in relation to Your Personal Data are as follows: <br />
          <b>(i)</b> The right to have access to Your Personal Data. <br />
          <b>(ii)</b> The right to be informed about the processing of Your Personal Data. <br />
          <b>(iii)</b> The right to rectify any inaccurate Personal Data or any information about
          You. <br />
          <b>(iv)</b> The right to review, modify or erase Your Personal Data and any other
          information we
          have about You. <br />
          <b>(v)</b> The right to restrict the processing of Your Personal Data. <br />
          <b>(vi)</b> The right to block Personal Data processing in violation of any law. <br />
          <b>(vii)</b> The right to be informed about any rectification or erasure of Personal
          Data or
          restriction of any processing carried out. <br />
          <b>(viii)</b> The right to the portability of Your Personal Data. <br />
          <b>(ix)</b> The right to lodge a complaint with a supervisory authority within Nigeria.</p>
        <h4>14. CONTACT INFORMATION</h4>
        <p>If You have any questions regarding this Privacy Policy or the Personal Data we
          collect, or if
          You wish to make any comments or complaints about anything related to this
          Privacy Policy,
          please contact us at the following email address: support@vocity.ng.</p>
        <button className='btn' onClick={onClose}>close</button>
      </div>
    </div>
  )
}

export default PPandTC