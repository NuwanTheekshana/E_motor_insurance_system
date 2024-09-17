import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';

import Header from './Components/header';
import Footer from './Components/footer';

function BuyInsurancePlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const { responseData } = location.state || {};
  const motorgurdPremium = responseData?.motorgurd_premium;
  const third_party_premium = responseData?.third_party_premium;
  const motorgurd_xtra_premium = responseData?.motorgurd_xtra_premium;
  const coverDescription = responseData?.cover_discription || [];
  const selected_covers = responseData?.ML_output.selected_covers || [];
  const policy_id = responseData?.policy_id;
  

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };


  const thirdpartybtn = async (event) => {
    event.preventDefault();
    try {
      const data = {
        policy_id: policy_id,
        insurance_premium: third_party_premium,
        selected_covers: null,
        product:'ThirdParty'
    }
  
      const response = await axios.post('http://127.0.0.1:8001/api/selectcoverplan', data);
      if (response.status === 200) {
        navigate('/customerinfo', { state: { responseData: response.data } });
      } else {
        console.error('Response error:', response.data);
      }
    } catch (error) {
      Swal.fire({title: 'Error', text: error.message, icon: 'error', customClass: { popup: 'custom-popup' }});
    }
  };



  const motorgurdbtn = async (event) => {
    event.preventDefault();
    try {
      const data = {
        policy_id: policy_id,
        insurance_premium: motorgurdPremium,
        selected_covers: selected_covers,
        product: 'MotorGurd'
      };
  
      const response = await axios.post('http://127.0.0.1:8001/api/selectcoverplan', data);
      if (response.status === 200) {
        navigate('/customerinfo', { state: { responseData: response.data } });
      } else {
        console.error('Response error:', response.data);
      }
    } catch (error) {
      Swal.fire({title: 'Error', text: error.message, icon: 'error', customClass: { popup: 'custom-popup' }});
    }
  };
  
  const motorgurdxtrabtn = async (event) => {
    event.preventDefault();
    try {
      const data = {
        policy_id: policy_id,
        insurance_premium: motorgurd_xtra_premium,
        selected_covers: selected_covers,
        product: 'motorgurdxtra'
      };
  
      const response = await axios.post('http://127.0.0.1:8001/api/selectcoverplan', data);
      if (response.status === 200) {
        navigate('/customerinfo', { state: { responseData: response.data } });
      } else {
        console.error('Response error:', response.data);
      }
    } catch (error) {
      Swal.fire({title: 'Error', text: error.message, icon: 'error', customClass: { popup: 'custom-popup' }});
    }
  };
  

  return (
    <div>
    <Header />

    <main className="main">

  
            <div className="page-title" data-aos="fade">
            <div className="container d-lg-flex justify-content-between align-items-center">
                
            </div>
            </div>

    
                  <section id="pricing" class="pricing section">
                          <div class="container section-title" data-aos="fade-up">
                            <h2>Insurance Plans</h2>
                            <p>Choose Your Ideal Insurance Plan</p>
                          </div>
                          <div class="container">

                            <div class="row gy-4">

                              <div class="col-lg-4" data-aos="zoom-in" data-aos-delay="100">
                                <div class="pricing-item">
                                  <h3>Third Party Product</h3>
                                  <p class="description">Coverage for Damages to Others</p>
                                  <h4><sup>Rs. </sup>{formatNumber(third_party_premium?.toFixed(2))}<span> / year</span></h4>
                                  <a href="#" class="cta-btn third_party" onClick={thirdpartybtn}>Choose This Plan</a>
                                  <ul>
                                    <li><i class="bi bi-check"></i> <span>Third Party Property Damage</span></li>
                                    <li><i class="bi bi-check"></i> <span>Third Party Bodily Injury - Unlimited</span></li>
                                    <li class="na"><i class="bi bi-x"></i> <span>Vehicle Comprehensive Covers</span></li>
                                  </ul>
                                </div>
                              </div>

                              <div class="col-lg-4" data-aos="zoom-in" data-aos-delay="200">
                                <div class="pricing-item featured">
                                  <p class="popular">Recommended</p>
                                  <h3>Motor Gurd Product</h3>
                                  <p class="description">Full Protection for Your Vehicle and Others</p>
                                  <h4><sup>Rs. </sup>{formatNumber(motorgurdPremium?.toFixed(2))}<span> / year</span></h4>
                                  <a href="#" class="cta-btn motorgurd" onClick={motorgurdbtn}>Choose This Plan</a>
                                  <ul>
                                  <li><i class="bi bi-check"></i> <span>Third Party Property Damage</span></li>
                                  <li><i class="bi bi-check"></i> <span>Third Party Bodily Injury - Unlimited</span></li>
                                  {coverDescription.map((desc, index) => (
                                    <li key={index}><i className="bi bi-check"></i> <span>{desc}</span></li>
                                  ))}
                                    <li class="na"><i class="bi bi-x"></i> <span>Depreciation protection cover</span></li>
                                    <li class="na"><i class="bi bi-x"></i> <span>Loss key cover</span></li>
                                    <li class="na"><i class="bi bi-x"></i> <span>Hospital cash benifit cover</span></li>
                                    <li class="na"><i class="bi bi-x"></i> <span>Special windscreen Cover</span></li>
                                    <li class="na"><i class="bi bi-x"></i> <span>Free Airbag Cover</span></li>
                                  </ul>
                                </div>
                              </div>

                              <div class="col-lg-4" data-aos="zoom-in" data-aos-delay="300">
                                <div class="pricing-item">
                                  <h3>Motor Gurd Xtra Product</h3>
                                  <p class="description">Ultimate Insurance with Extra Safeguards</p>
                                  <h4><sup>Rs. </sup>{formatNumber(motorgurd_xtra_premium?.toFixed(2))}<span> / year</span></h4>
                                  <a href="#" class="cta-btn motorgurdxtra" onClick={motorgurdxtrabtn}>Choose This Plan</a>
                                  <ul>
                                  <li><i class="bi bi-check"></i> <span>Third Party Property Damage</span></li>
                                  <li><i class="bi bi-check"></i> <span>Third Party Bodily Injury - Unlimited</span></li>
                                  {coverDescription.map((desc, index) => (
                                    <li key={index}><i className="bi bi-check"></i> <span>{desc}</span></li>
                                  ))}
                                  <li><i class="bi bi-check"></i> <span>Depreciation protection cover</span></li>
                                  <li><i class="bi bi-check"></i> <span>Loss key cover</span></li>
                                  <li><i class="bi bi-check"></i> <span>Hospital cash benifit cover</span></li>
                                  <li><i class="bi bi-check"></i> <span>Special windscreen Cover</span></li>
                                  <li><i class="bi bi-check"></i> <span>Free Airbag Cover</span></li>
                                  </ul>
                                </div>
                              </div>

                            </div>

                          </div>

                    </section>

             

  </main>


    <Footer />
  </div>   
       
  



      );
}

export default BuyInsurancePlan;
