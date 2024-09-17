import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';
import Payment from 'payment';

import Header from './Components/header';
import Footer from './Components/footer';

function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  const { responseData } = location.state || {};
  const policy_id = responseData?.policy_id;
  const [premium, setPremium] = useState(0);
  const [loading, setLoading] = useState(false);

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });

    async function fetchInsurancePremium() {
      try {
        const response = await axios.get(`http://127.0.0.1:8001/api/getinsurancepremium/${policy_id}`);
        setPremium(response.data.insurance_premium);
      } catch (error) {
        console.error('Error fetching premium amount:', error);
      }
    }

    fetchInsurancePremium();

  }, [policy_id]);

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardholdername: '',
    cvc: '',
    expiry: '',
    cardType: ''
  });

  const [formErrors, setFormErrors] = useState({
    cardNumber: '',
    cardholdername: '',
    cvc: '',
    expiry: '',
    cardType: ''
  });

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      const sanitizedValue = value.replace(/\D/g, '');
      const cardType = Payment.fns.cardType(sanitizedValue);
      const isValid = Payment.fns.validateCardNumber(sanitizedValue);
      
      setFormData({
        ...formData,
        cardType,
        [name]: sanitizedValue,
      });
      
      setFormErrors({
        ...formErrors,
        cardNumber: isValid ? '' : 'Please enter a valid card number.',
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getCardTypeIcon = () => {
    if (formData.cardType === 'visa') {
      return <img src="assets/img/card/visa.png" alt="Visa" style={{ width: '50px' }} />;
    }
    if (formData.cardType === 'mastercard') {
      return <img src="assets/img/card/master.png" alt="MasterCard" style={{ width: '50px' }} />;
    }
    return null;
  };

  const validateForm = () => {

    const errors = {};
    if (!formData.cardNumber) errors.cardNumber = 'Card number is required.';
    if (!formData.cardholdername) errors.cardholdername = 'Policy holder name is required.';
    if (!formData.cvc) errors.cvc = 'CVC is required.';
    if (!formData.cardNumber || !Payment.fns.validateCardNumber(formData.cardNumber)) {
      errors.cardNumber = 'Please enter a valid card number.';
    }
    if (!formData.expiry || !Payment.fns.validateCardExpiry(formData.expiry)) {
      errors.expiry = 'Please enter a valid expiry date.';
    }
    if (!formData.cvc || !Payment.fns.validateCardCVC(formData.cvc, formData.cardType)) {
      errors.cvc = 'Please enter a valid CVC.';
    }
    return errors;
  };

  const handleCustomerData = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      Swal.fire({ title: 'Warning', text: 'Please correct the errors in the form.', icon: 'error', customClass: { popup: 'custom-popup' } });
      return;
    }

    try {
      setLoading(true);

      const data = {
        policy_id: policy_id,
        cardholdername: formData.cardholdername,
        cardType: formData.cardType,
        policypremium: premium,
      };

      
      
      const response = await axios.post('http://127.0.0.1:8001/api/updatepayment', data);
      if (response.status === 200) {
        navigate('/verifypayment', { state: { responseData: response.data } });
      } else {
        console.error('Response error:', response.data);
      }
    } catch (error) {
      Swal.fire({
        title: 'Error', text: 'Something went wrong. Please check the form for errors and try again.', icon: 'error', customClass: { popup: 'custom-popup' }});
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
            <h1 className="mb-2 mb-lg-0">Payment Gateway</h1>
            <nav className="breadcrumbs">
              <ol>
                <li><a href="/main2">Home</a></li>
                <li className="current">Payment Gateway</li>
              </ol>
            </nav>
          </div>
        </div>

        <section id="starter-section" className="starter-section section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Payment Gateway</h2>
            <p>Enjoy real-time validation and confirmation of your payments, ensuring immediate updates to your policy status.</p>
          </div>

          <div className="container" data-aos="fade-up">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <form className="php-email-form" data-aos="fade-up" data-aos-delay="400">
                  <h4 className="text-center mb-5">Debit / Credit Card Information</h4>

                  <h5><b>Your Insurance Premium : </b> Rs. {formatNumber(premium)} </h5>
                  <div className="mb-3 mt-3">
                    <label htmlFor="cardholdername" className="form-label">Cardholder Name <span className="text-danger">*</span></label>
                    <input type="text" id="cardholdername" name="cardholdername" className={`form-control ${formErrors.cardholdername ? 'is-invalid' : ''}`} placeholder="Policy Holder Name" value={formData.cardholdername} onChange={handleInputChange} />
                    {formErrors.cardholdername && <div className="invalid-feedback">{formErrors.cardholdername}</div>}
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-11">
                      <label htmlFor="cardNumber" className="form-label">Card Number <span className="text-danger">*</span></label>
                      <input type="number" id="cardNumber" name="cardNumber" className={`form-control ${formErrors.cardNumber ? 'is-invalid' : ''}`} placeholder="Card Number" value={formData.cardNumber} onChange={handleCardInputChange} />
                      {formErrors.cardNumber && <div className="invalid-feedback">{formErrors.cardNumber}</div>}
                    </div>
                    <div className="col-md-1">
                      <br />
                      {getCardTypeIcon()}
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-9">
                      <label htmlFor="expiry" className="form-label">Expiry Date <span className='text-danger'>*</span></label>
                      <input type="text" id="expiry" name="expiry" className={`form-control ${formErrors.expiry ? 'is-invalid' : ''}`} placeholder="MM/YY" onChange={handleInputChange} value={formData.expiry} />
                      {formErrors.expiry && <div className="invalid-feedback">{formErrors.expiry}</div>}
                    </div>

                    <div className="col-md-3">
                      <label htmlFor="cvc" className="form-label">CVC <span className='text-danger'>*</span></label>
                      <input type="number" id="cvc" name="cvc" className={`form-control ${formErrors.cvc ? 'is-invalid' : ''}`} placeholder="CVC" onChange={handleInputChange} value={formData.cvc} />
                      {formErrors.cvc && <div className="invalid-feedback">{formErrors.cvc}</div>}
                    </div>
                  </div>


                  <div className="d-flex justify-content-center">
                    {loading ? (
                      <button type="button" className="get-submit-button mt-3"><div className="spinner-border spinner-border-sm text-white" role="status"></div>&nbsp; processing...</button>
                    ) : (
                      <button type="button" className="get-submit-button mt-3" onClick={handleCustomerData}>Proceed</button>
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

export default PaymentGateway;
