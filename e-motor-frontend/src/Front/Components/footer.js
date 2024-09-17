import React, { Component } from 'react';
import { useLocation } from 'react-router-dom';
 
class Footer extends Component {
  
    render() {
        return (
        <footer id="footer" className="footer position-relative light-background">

              <div className="container footer-top">
                <div className="row gy-4">
                  <div className="col-lg-4 col-md-6 footer-about">
                    <a href="index.html" className="logo d-flex align-items-center">
                      <span className="sitename">QuickStart</span>
                    </a>
                    <div className="footer-contact pt-3">
                      <p>No. 123, Main Street</p>
                      <p>Colombo 01, Sri Lanka</p>
                      <p className="mt-3"><strong>Phone:</strong> <span>+94 11 2345 678</span></p>
                      <p><strong>Email:</strong> <span>info@emotor.com</span></p>
                    </div>
                    <div className="social-links d-flex mt-4">
                      <a href=""><i className="bi bi-twitter-x"></i></a>
                      <a href=""><i className="bi bi-facebook"></i></a>
                      <a href=""><i className="bi bi-instagram"></i></a>
                      <a href=""><i className="bi bi-linkedin"></i></a>
                    </div>
                  </div>

                  <div className="col-lg-2 col-md-3 footer-links">
                    <h4>Useful Links</h4>
                    <ul>
                      <li><a href="/#hero">Home</a></li>
                      <li><a href="/#about">About us</a></li>
                      <li><a href="/#features">Features</a></li>
                      <li><a href="/#services">Services</a></li>
                    </ul>
                  </div>

                  <div className="col-lg-2 col-md-3 footer-links">
                    <h4>Our Services</h4>
                    <ul>
                      <li><a href="#">Instant Vehicle Insurance Policies</a></li>
                      <li><a href="#">Smart Insurance Recommendations</a></li>
                      <li><a href="#">Instant Certificate and Cover Note Issuance</a></li>
                      <li><a href="#">QR Code for Instant Verification</a></li>
                      <li><a href="#">Encrypted PDF Protection</a></li>
                      <li><a href="#">24/7 Support & Assistance</a></li>
                    </ul>
                  </div>

                  <div className="col-lg-4 col-md-12 footer-newsletter">
                    <h4>Our Newsletter</h4>
                    <p>Subscribe to our newsletter and receive the latest news about our products and services!</p>
                    <form className="php-email-form">
                      <div className="newsletter-form"><input type="email" name="email"/><input type="submit" value="Subscribe" />
                      </div>
                      <div className="loading">Loading</div>
                      <div className="error-message"></div>
                      <div className="sent-message">Your subscription request has been sent. Thank you!</div>
                    </form>
                  </div>

                </div>
              </div>

              <div className="container copyright text-center mt-4">
                <p>© <span>Copyright</span> <strong className="px-1 sitename">E-Motor</strong><span>All Rights Reserved</span></p>
                <div className="credits">
                  Designed by <a href="www.emotor.com">E-Motor Insurance PLC</a>
                </div>
              </div>

             

              </footer>

        )
    }
}
export default Footer;



