import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';

import Header from './Components/header';
import Footer from './Components/footer';

function Validatingpage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { responseData } = location.state || {};
  const policy_id = responseData?.policy_id;
  const [blacklist, setBlacklist] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
      async function fetchValidateStatus() {
        try {
          const response = await axios.get(`http://127.0.0.1:8001/api/validatepolicy/${policy_id}`);
          setBlacklist(response.data.blacklist_status);
          console.log(response);
          
          if (!response.data.blacklist_status) {
            setTimeout(() => {
              navigate('/paymentgateway', { state: { responseData: response.data } });
            }, 3000);
          }
        } catch (error) {
          console.error('Error fetching validation status:', error);
        }
      }

      setTimeout(() => {
      fetchValidateStatus();
      }, 3000);    
  }, []);




  const handleHomePageClick = () => {
    navigate('/');
  };



  return (
    <div>
      <Header />

      <main className="main">
        <div className="page-title" data-aos="fade">
          {/* You can add page title content here if needed */}
        </div>

        <section id="starter-section" className="starter-section section">
          <div className="container text-center">
            {!blacklist ? (
              <div id='validating_div' className="d-flex flex-column justify-content-center align-items-center" data-aos="fade-in" data-aos-delay="300">
                <img src="assets/img/vector/4.gif" className="img-fluid hero-img" alt="" data-aos="zoom-out" data-aos-delay="300" style={{ width: '450px', height: 'auto' }} />
                <div className="spinner-border" style={{color: 'var(--accent-color)'}} role="status"></div>
                <p className='mt-2' style={{color: 'var(--accent-color)'}}>Validating your information...</p>
              </div>
            ) : (
              <div id='error_div' className="d-flex flex-column justify-content-center align-items-center" data-aos="fade-in" data-aos-delay="5000">
                <img src="assets/img/vector/6.gif" className="img-fluid hero-img" alt="" data-aos="zoom-out" data-aos-delay="300" style={{ width: '450px', height: 'auto' }} />
                <p className='mt-2' style={{color: 'var(--accent-color)'}}>
                  <i className="bi bi-info-circle-fill"></i> Verification failed. Please contact our hotline for more information.
                </p>
                <p style={{color: 'var(--accent-color)'}}>Our hotline: 011-4123456</p>
                <button className='get-submit-button' onClick={handleHomePageClick}> Go to Home Page </button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>   
  );
}

export default Validatingpage;
