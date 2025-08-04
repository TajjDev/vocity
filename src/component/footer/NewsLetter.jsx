import React, { useState } from 'react'
import { supabase } from '../../../supabaseClient'

const NewsLetter = ({ onShowP, onShowPP }) => {
    const [Emails, setEmails] = useState('')
    const [formError, setFormError] = useState(null)


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!navigator.onLine) {
            setFormError("Email not submitted, no internet connection");
            return
        }
        if (navigator.onLine) {
            setFormError("")
        }
        if (!Emails) {
            setFormError("Please inpute email")
            return
        }
        else {
            setFormError('Email submitted')
            setEmails('')
            setTimeout(() => {
                setFormError(null)

            }, 1500)
            
        }
        const revEm = Emails;
        setEmails('')

        const { data, error } = await supabase
            .from('Newsletter')
            .insert({ email: revEm })

        if (error) {
            console.log(error)
            setFormError("Please input email")
        }

        if (data) {
            console.log('data')
            setEmails('')
            setFormError(null)
        }
        return
    }


    return (
        <div id='theForm'>
            <p id='nn'>Newsletter Signup</p>
            <form id='form' onSubmit={handleSubmit} action="">
                <input placeholder='Enter your email address' value={Emails} onChange={(e) => setEmails(e.target.value)} type="email" />
                <button>Suscribe</button>

            </form>
            {formError && <p style={{
                color: 'transparent',
                background: 'linear-gradient(1deg, #ad730c 0%, #f9c04c 50%, #856306 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text'
            }}>{formError}</p>}
            <p className='cc'>By clicking “suscribe” you are accepting Vocity.ng</p>
            <p className='cc'> <button className='cc' onClick={onShowP}>  Privacy policy</button> and <button className='cc' onClick={onShowPP}>  Terms & Conditions</button></p>

        </div>
    )
}

export default NewsLetter