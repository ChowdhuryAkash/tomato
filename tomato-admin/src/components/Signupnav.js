import { Link, Router, useNavigate } from 'react-router-dom';
import React from 'react'
import './Navbar.css'
const Signupnav = () => {
    return (
        <div className="navbar">
            <div className="nav-left">
                <h1>Tomato</h1>
            </div>

            <div className="nav-right">
                <Link to="/login" style={{ textDecoration: 'none' }}>
                    <p>login</p>
                </Link>
                <Link to="/signup" style={{ textDecoration: 'none' }}>
                    <p>Sign up</p>
                </Link>
               
            </div>
           
        </div>
    )
}

export default Signupnav