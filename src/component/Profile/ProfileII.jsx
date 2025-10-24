import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import UserProfile from './Profile';
import RenderAll from '../renderAll/RenderAll';
import Nav from '../nav/Nav';
import Footer from '../footer/Footer';
import { Component } from 'react';
console.log('UserProfile Component mounted');
const ProfileII = () => {
    return (
        <Router>
            <Nav />         {/* Always visible */}

            <Routes>
                <Route path='/' element={<RenderAll />} />
                <Route path='/profile/:userID' element={<UserProWrap />} />
            </Routes>

            <Footer />      {/* Always visible */}
        </Router>
    );
};

// Wrapper to get userID from URL params
function UserProWrap() {
    const { userID } = useParams();
    return <UserProfile userId={userID} />;
}

export default ProfileII;