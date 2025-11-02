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
            <Routes>
                <Route path='/' element={<RenderAll />} />
                <Route path=':userID' element={<UserProWrap />} />
            </Routes>
    );
};

// Wrapper to get userID from URL params
function UserProWrap() {
    const { userID } = useParams();
    return <UserProfile userId={userID} />;
}

export default ProfileII;