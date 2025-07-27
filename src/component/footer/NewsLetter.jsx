import React, {useState} from 'react'
import { supabase } from '../../../supabaseClient'

const NewsLetter = ({ onShowP, onShowPP }) => {
    const [Emails, setEmails] = useState('')
    const [formError, setFormError] = useState(null)


    const handleSubmit = async (e) =>{
        e.preventDefault()

        if (!Emails) {
            setFormError("Please inpute email")
            return
        }
        else{
            setFormError('Email submitted')
            setTimeout (()=>{
                setFormError(null)
            },1500)
        }
        const revEm = Emails;
        setEmails('')

        const {data, error } = await supabase
        .from('NewsletterEmail')
        .insert({Emails: revEm})

        if (error){
            console.log(error)
            setFormError("Please input email")
        }

        if (data) {
            console.log('data')
            // setEmails('')
            setFormError(null)
        }
        
    }


  return (
    <div id='theForm'>
        <p  id='nn'>Newsletter Signup</p>
        <form id='form' onSubmit={handleSubmit} action="">
            <input placeholder='Enter your email address' value={Emails} onChange={(e) => setEmails(e.target.value)} type="email" />
            <button>Suscribe</button>
            
        </form>
        {formError && <p style={{color:"#FFE988"}}>{formError}</p>}
        <p className='cc'>By clicking “suscribe” you are accepting Vocity.ng</p>
        <p className='cc'> <button className='cc' onClick={onShowP}>  Privacy policy</button> and <button className='cc' onClick={onShowPP}>  Terms & Conditions</button></p>

    </div>
  )
}

export default NewsLetter
