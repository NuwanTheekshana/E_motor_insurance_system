import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';

import Header from './Components/header';
import Footer from './Components/footer';

function Validatingpage() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);




  const handleHomePageClick = () => {
    navigate('/');
  };



  return (
    <div>
      <Header />

      <main className="main">
      <div className="page-title" data-aos="fade">
        
        </div>


        <section id="starter-section" className="starter-section section">
        
        <div className="container section-title" data-aos="fade-up">
                <h2>Insurance Success</h2>
                <p>Your insurance process was successful. We have sent an acknowledgment email to your provided email address.</p>
            </div>

          <div className="container text-center">
          
              <div id='validating_div' className="d-flex flex-column justify-content-center align-items-center" data-aos="fade-in" data-aos-delay="300">
                <img src="assets/img/vector/9.jpg" className="img-fluid hero-img" alt="" data-aos="zoom-out" data-aos-delay="300" style={{ width: '550px', height: '400px' }} />

                <button className='get-submit-button' onClick={handleHomePageClick}> Go to Home Page </button>
                {/* <p className='mt-2' style={{color: 'var(--accent-color)'}}>Validating your information...</p> */}
              </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>   
  );
}

export default Validatingpage;
