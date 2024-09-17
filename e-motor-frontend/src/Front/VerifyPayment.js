import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';

import Header from './Components/header';
import Footer from './Components/footer';

function VerifyPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { responseData } = location.state || {};
  const policy_id = responseData?.policy_id;
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccessMessage, setResendSuccessMessage] = useState('');


  const [formData, setFormData] = useState({
    otp: ''
  });

  const [formErrors, setFormErrors] = useState({
    otp: ''
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });

    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
    } else {
      setIsResendEnabled(true);
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleInputChange = (e) => {
    setOtp(e.target.value);

    e.preventDefault();
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleResendClick = async () => {
    setResendLoading(true);
    try {
      const data = {
        policy_id: policy_id
      };
      const response = await axios.post('http://127.0.0.1:8001/api/resendverificationcode', data);
      setOtp('');
      setIsResendEnabled(false);
      setTimer(60);
      setResendSuccessMessage('OTP has been resent successfully.');

      setTimeout(() => {
        setResendSuccessMessage('');
      }, 5000);

    } catch (error) {
      console.error('Error submitting OTP:', error);
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const errors = {};
      if (!otp) errors.otp = 'OTP is required.';

      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        Swal.fire({
          title: 'Warning', text: 'Please correct the errors in the form.', icon: 'error', customClass: { popup: 'custom-popup' }
        });
        return;
      }
      
      const data = {
        policy_id: policy_id,
        otp: otp
      };
      const response = await axios.post('http://127.0.0.1:8001/api/paymentverification', data);
      setOtp('');
      if (response.status === 200) {
        navigate('/success', { state: { responseData: response.data } });
      } else {
        console.error('Response error:', response.data);
      }

    } catch (error) {
      console.error('Error submitting OTP:', error);
      Swal.fire({title: 'Error', text: 'Verification failed. Please check the information you entered and try again..!', icon: 'error', customClass: {popup: 'custom-popup'}});
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

      <main className="main">
        <div className="page-title" data-aos="fade">
          <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">Payment Verification</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/main2">Home</a></li>
                <li className="current">Payment Verification</li>
              </ol>
            </nav>
          </div>
        </div>

        <section id="starter-section" className="starter-section section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Secure Payment Verification</h2>
            <p>Enter the OTP sent to your email to verify your payment.</p>
          </div>

          <div className="container" data-aos="fade-up">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <form className="php-email-form" data-aos="fade-up" data-aos-delay="400" onSubmit={handleSubmit}>
                  <h4 className="text-center mb-5">Payment Verification Code</h4>

                  <div className="col-md">
                    <label htmlFor="otp" className="form-label">Enter your OTP code <span className='text-danger'>*</span></label>
                    <input
                      type="number"
                      id="otp" name="otp" className={`form-control ${formErrors.otp ? 'is-invalid' : ''}`} placeholder="Enter OTP" onChange={handleInputChange} value={otp} />
                    {formErrors.otp && <div className="invalid-feedback">{formErrors.otp}</div>}
                    {resendSuccessMessage && <div className="form-text mt-2 text-success">* {resendSuccessMessage}</div>}
                  </div>

                  {timer > 0 && <p className='mt-2'>Resend available in {timer} seconds</p>}

                  {/* <div className="d-flex justify-content-center">
                    {loading ? (
                      <button type="button" className="get-submit-button mt-3">
                        <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                        &nbsp; Checking...
                      </button>
                    ) : (
                      <>
                        {!isResendEnabled && (
                          <button type="submit" className="get-submit-button mt-3">Verify OTP</button>
                        )}
                        {isResendEnabled && (
                          <button type="button" className="get-submit-button mt-3" onClick={handleResendClick}>Resend Code</button>
                        )}
                      </>
                    )}
                  </div> */}


                  <div className="d-flex justify-content-center">
                  {loading ? (
                    <button type="button" className="get-submit-button mt-3">
                      <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                      &nbsp; Checking...
                    </button>
                  ) : (
                    <>
                      {!isResendEnabled && (
                        <button type="submit" className="get-submit-button mt-3">Verify OTP</button>
                      )}
                      {isResendEnabled && (
                        <button type="button" className="get-submit-button mt-3" onClick={handleResendClick}  disabled={resendLoading}>
                          {resendLoading ? (
                            <>
                              <div className="spinner-border spinner-border-sm text-white" role="status"></div>
                              &nbsp; Resending...
                            </>
                          ) : (
                            "Resend Code"
                          )}
                        </button>
                      )}
                    </>
                  )}
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

export default VerifyPayment;
