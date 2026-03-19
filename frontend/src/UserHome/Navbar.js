import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import NotificationBell from '../Common/NotificationBell'

function Navbar() {
  const [auth] = useState(JSON.parse(localStorage.getItem("user")))
  const handlelogout = () => {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <>
      <header id="header" className="header d-flex align-items-center fixed-top" style={{ backgroundColor: "#0b1c3c", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
        <div className="container-fluid container-xl position-relative d-flex align-items-center justify-content-between">

          <Link to="/" className="logo d-flex align-items-center" style={{ textDecoration: "none" }}>
            {/* <img src={require("../assets/img/logo.png")} alt="CareSync Logo" style={{ height: '40px', marginRight: '10px' }} /> */}
            <i className="bi bi-heart-pulse-fill" style={{ fontSize: '32px', color: '#0dcaf0', marginRight: '10px' }}></i>
            <h1 className="sitename" style={{ fontFamily: '"Outfit", sans-serif', fontWeight: 700, letterSpacing: '1px' }}>CareSync</h1>
          </Link>

          <nav id="navmenu" className="navmenu">
            <ul>
              {auth === null ? (
                <>
                  <li><Link to="/" style={{ textDecoration: "none" }}>Home</Link></li>
                  <li className="dropdown">
                    <span>Register</span> <i className="bi bi-chevron-down toggle-dropdown"></i>
                    <ul>
                      <li><Link to="/staffregister" style={{ textDecoration: "none" }}>StaffRegister</Link></li>
                      <li><Link to="/parentregister" style={{ textDecoration: "none" }}>GuardianRegister</Link></li>
                    </ul>
                  </li>
                  <li><Link to="/login" style={{ textDecoration: "none" }}>Login</Link></li>
                </>
              ) : auth.status === 3 ? (
                <>
                  <li><Link to="/" style={{ textDecoration: "none" }}>Home</Link></li>
                  <li><Link to="/about" style={{ textDecoration: "none" }}>About</Link></li>
                  <li><Link to="/childmilestones" style={{ textDecoration: "none" }}>Milestone</Link></li>
                  <li><Link to="/childattendance" style={{ textDecoration: "none" }}>Attendance</Link></li>
                  <li><Link to="/contact" style={{ textDecoration: "none" }}>Contact</Link></li>
                  {/* <li><Link to="/child/immunization" style={{ textDecoration: "none" }}>Immunization</Link></li> */}
                  <li className="ms-3 me-3 d-flex align-items-center">
                    <NotificationBell />
                  </li>
                  <li><Link to="/" style={{ textDecoration: "none" }} onClick={handlelogout}>Logout</Link></li>
                </>
              ) : (
                <>
                  <li><Link to={auth.role === 'admin' ? '/admin' : auth.status === 1 ? '/staffhome' : auth.status === 2 ? '/parenthome' : '/'} style={{ textDecoration: "none" }}>Dashboard</Link></li>
                  <li><Link to="/about" style={{ textDecoration: "none" }}>About</Link></li>
                  <li><Link to="/contact" style={{ textDecoration: "none" }}>Contact</Link></li>
                  <li className="ms-3 me-3 d-flex align-items-center">
                    <NotificationBell />
                  </li>
                  <li><Link to="/" style={{ textDecoration: "none" }} onClick={handlelogout}>Logout</Link></li>
                </>
              )}
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list"></i>
          </nav>

        </div>
      </header>

      {/* 
      <main className="main">
        <section id="hero" className="hero section dark-background">
          <img src="assets/img/hero-bg-2.jpg" alt="" className="hero-bg" />

          <div className="container">
            <div className="row gy-4 justify-content-between">
              <div className="col-lg-4 order-lg-last hero-img" data-aos="zoom-out" data-aos-delay="100">
                <img src="assets/img/hero-img.png" className="img-fluid animated" alt="" />
              </div>

              <div className="col-lg-6 d-flex flex-column justify-content-center" data-aos="fade-in">
                <h1>Build Your Landing Page With <span>Bootslander</span></h1>
                <p>We are team of talented designers making websites with Bootstrap</p>
                <div className="d-flex">
                  <a href="#about" className="btn-get-started">Get Started</a>
                  <a href="https://www.youtube.com/watch?v=Y7f98aduVJ8" className="glightbox btn-watch-video d-flex align-items-center">
                    <i className="bi bi-play-circle"></i><span>Watch Video</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main> 
      */}
    </>
  )
}

export default Navbar
