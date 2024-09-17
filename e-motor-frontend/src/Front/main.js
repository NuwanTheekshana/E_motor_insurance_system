import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './main.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

import Header from './Components/header';
import Footer from './Components/footer';

function Main() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);
  

  return (
    <div>
    <Header />

    <main className="main">

        <section id="hero" className="hero section">
            <div className="hero-bg">
            <img src="assets/img/hero-bg-light.webp" alt="" />
            </div>
            <div className="container text-center">
              <div className="d-flex flex-column justify-content-center align-items-center">
                  <h1 data-aos="fade-up">Welcome to <span>E-Motor</span></h1>
                  <p data-aos="fade-up" data-aos-delay="100">Simplified Vehicle Insurance - Certificate at Your Fingertips</p>
                  <div className="d-flex" data-aos="fade-up" data-aos-delay="200">
                    <Link to="/vehicleinfo" className="btn-get-started">
                    Take Your Certificate
                    </Link>
                  </div>
              <img src="assets/img/cover2.png" className="img-fluid hero-img" alt="" data-aos="zoom-out" data-aos-delay="300" />
              </div>
            </div>
        </section>


{/* About */}
            <section id="about" className="about section">
              <div className="container">
                <div className="row gy-4">
                  <div className="col-lg-6 content" data-aos="fade-up" data-aos-delay="100">
                    <p className="who-we-are">Who We Are</p>
                    <h3>Revolutionizing Vehicle Insurance with Innovative Solutions</h3>
                    <p className="fst-italic">
                    At E-Motor, we’re redefining vehicle insurance with innovative technology and unparalleled customer service. Our goal is to make the insurance process simple, transparent, and tailored to your needs.
                    </p>
                    <ul>
                      <li><i className="bi bi-check-circle"></i> <span>Innovative Technology</span></li>
                      <li><i className="bi bi-check-circle"></i> <span>Customer-Centric Approach</span></li>
                      <li><i className="bi bi-check-circle"></i> <span>Transparent Processes</span></li>
                      <li><i className="bi bi-check-circle"></i> <span>Comprehensive Coverage</span></li>
                      <li><i className="bi bi-check-circle"></i> <span>Commitment to Excellence</span></li>
                    </ul>
                   
                  </div>

                  <div className="col-lg-6 about-images" data-aos="fade-up" data-aos-delay="200">
                        <img src="assets/img/vector/7.gif" className="img-fluid" alt="" />
                  </div>

                </div>

              </div>
            </section>



            <section id="features" className="features section">

                <div className="container section-title" data-aos="fade-up">
                  <h2>Features</h2>
                  <p>Key Features of Our Advanced E-Motor Vehicle Insurance System</p>
                </div>

                <div className="container">
                  <div className="row justify-content-between">

                  <div className="col-lg-6">
                    <div className="tab-content" data-aos="fade-up" data-aos-delay="200">
                      <div className="tab-pane fade active show" id="features-tab-1">
                        <img src="assets/img/vector/10.jpg" alt="" className="img-fluid"/>
                      </div>
                    </div>
                    </div>

                    <div className="col-lg-5 d-flex align-items-center">

                      <ul className="nav nav-tabs" data-aos="fade-up" data-aos-delay="100">
                        <li className="nav-item">
                          <a className="nav-link active show" data-bs-toggle="tab" data-bs-target="#features-tab-1">
                            <i className="bi bi-binoculars"></i>
                            <div>
                              <h4 className="d-none d-lg-block">Seamless Online Experience</h4>
                              <p>
                              Our platform allows you to purchase your vehicle insurance online with ease, eliminating the need for tedious paperwork and long wait times.
                              </p>
                            </div>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" data-bs-toggle="tab" data-bs-target="#features-tab-2">
                            <i className="bi bi-box-seam"></i>
                            <div>
                              <h4 className="d-none d-lg-block">Intelligent Insurance Cover & Premium Prediction</h4>
                              <p>
                              Our system intelligently predicts the most suitable vehicle insurance covers and calculates premiums based on your vehicle details and history, ensuring you receive the best options tailored to your needs.
                              </p>
                            </div>
                          </a>
                        </li>
                        <li className="nav-item">
                          <a className="nav-link" data-bs-toggle="tab" data-bs-target="#features-tab-3">
                            <i className="bi bi-brightness-high"></i>
                            <div>
                              <h4 className="d-none d-lg-block">Vehicle Image Upload & Verification</h4>
                              <p>
                              Upload and verify vehicle documents and images directly through our platform, using advanced AI to ensure accuracy and speed.
                              </p>
                            </div>
                          </a>
                        </li>
                       
                      </ul>

                    </div>

                    

                  </div>

                </div>

                </section>

          
          
{/* Services */}
            <section id="services" className="services section light-background">
            <div className="container section-title" data-aos="fade-up">
              <h2>Services</h2>
              <p>Comprehensive Solutions for All Your Vehicle Insurance Needs</p>
            </div>

            <div className="container">

              <div className="row g-5">

                <div className="col-lg-6" data-aos="fade-up" data-aos-delay="100">
                  <div className="service-item item-cyan position-relative">
                    <i className="bi bi-activity icon"></i>
                    <div>
                      <h3>Instant Vehicle Insurance Policies</h3>
                      <p>Get your insurance policy issued in real-time, with a seamless process that eliminates waiting and paperwork.</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6" data-aos="fade-up" data-aos-delay="200">
                  <div className="service-item item-orange position-relative">
                    <i className="bi bi-broadcast icon"></i>
                    <div>
                      <h3>Smart Insurance Recommendations</h3>
                      <p>Benefit from our intelligent system that predicts the most suitable insurance covers and premium options based on your vehicle details and history.</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
                  <div className="service-item item-teal position-relative">
                    <i className="bi bi-easel icon"></i>
                    <div>
                      <h3>Instant Certificate and Cover Note Issuance</h3>
                      <p>Receive your official vehicle insurance certificates and cover notes instantly, accessible for download or printing right from your account.</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6" data-aos="fade-up" data-aos-delay="400">
                  <div className="service-item item-red position-relative">
                    <i className="bi bi-bounding-box-circles icon"></i>
                    <div>
                      <h3>QR Code for Instant Verification</h3>
                      <p>Each certificate and cover note is generated with a unique QR code, allowing for instant verification of its authenticity by scanning the code.</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6" data-aos="fade-up" data-aos-delay="500">
                  <div className="service-item item-indigo position-relative">
                    <i className="bi bi-calendar4-week icon"></i>
                    <div>
                      <h3>Encrypted PDF Protection</h3>
                      <p>Your insurance certificates and cover notes are secured with encrypted PDF protection, ensuring that they cannot be altered or tampered with.</p>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6" data-aos="fade-up" data-aos-delay="600">
                  <div className="service-item item-pink position-relative">
                    <i className="bi bi-chat-square-text icon"></i>
                    <div>
                      <h3>24/7 Support & Assistance</h3>
                      <p>Our customer support team is available anytime to help you with your insurance needs, ensuring you're never left without assistance.</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>

        </section>


      {/* contact */}

      
    <section id="contact" className="contact section">
      <div className="container section-title" data-aos="fade-up">
        <h2>Contact</h2>
        <p>We're here to assist you! Reach out with any questions, feedback, or support needs, and we'll get back to you as soon as possible.</p>
      </div>

      <div className="container" data-aos="fade-up" data-aos-delay="100">

        <div className="row gy-4">

          <div className="col-lg-6">
            <div className="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="200">
              <i className="bi bi-geo-alt"></i>
              <h3>Address</h3>
              <p>No. 123, Main Street, Colombo 01, Sri Lanka</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="300">
              <i className="bi bi-telephone"></i>
              <h3>Call Us</h3>
              <p>+94 11 2345678</p>
            </div>
          </div>

          <div className="col-lg-3 col-md-6">
            <div className="info-item d-flex flex-column justify-content-center align-items-center" data-aos="fade-up" data-aos-delay="400">
              <i className="bi bi-envelope"></i>
              <h3>Email Us</h3>
              <p>info@emotor.com</p>
            </div>
          </div>

        </div>

        <div className="row gy-4 mt-1">
          <div className="col-lg-6" data-aos="fade-up" data-aos-delay="300">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d247.53819246252397!2d79.84997002644184!3d6.936998950726317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNsKwNTYnMTMuNCJOIDc5wrA1MScwMC41IkU!5e0!3m2!1sen!2slk!4v1726457102620!5m2!1sen!2slk" frameBorder="0" style={{ border: '0', width: '100%', height: '400px' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade">
          </iframe>
          </div>


          <div className="col-lg-6">
            <form className="php-email-form" data-aos="fade-up" data-aos-delay="400">
              <div className="row gy-4">

                <div className="col-md-6">
                  <input type="text" name="name" className="form-control" placeholder="Your Name" required=""/>
                </div>

                <div className="col-md-6 ">
                  <input type="email" className="form-control" name="email" placeholder="Your Email" required=""/>
                </div>

                <div className="col-md-12">
                  <input type="text" className="form-control" name="subject" placeholder="Subject" required=""/>
                </div>

                <div className="col-md-12">
                  <textarea className="form-control" name="message" rows="6" placeholder="Message" required=""></textarea>
                </div>

                <div className="col-md-12 text-center">
                  <div className="loading">Loading</div>
                  <div className="error-message"></div>
                  <div className="sent-message">Your message has been sent. Thank you!</div>
                  <div id="alert-message" className="alert-message mb-2 text-success"></div>

                  <button type="button" className="get-submit-button" onClick={(e) => {e.preventDefault();    document.getElementById('alert-message').textContent = 'Your message has been sent. Thank you..!';  }} > Send Message  </button>
                </div>

              </div>
            </form>
          </div>

        </div>

      </div>

    </section>



          
            

</main>


    <Footer />
  </div>   
       
  



  );
}

export default Main;
