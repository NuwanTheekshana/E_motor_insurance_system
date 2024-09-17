import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';

import Header from './Components/header';
import Footer from './Components/footer';

function CustomerInfo() {
  const navigate = useNavigate();
  const location = useLocation();
  const { responseData } = location.state || {};
  const policy_id = responseData?.policy_id;

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    nic: '',
    address: '',
    email: '',
    contact_no: '',
    checkdata: false
  });

  const [formErrors, setFormErrors] = useState({
    fname: '',
    lname: '',
    nic: '',
    address: '',
    email: '',
    contact_no: '',
    checkdata: false
  });
  
 const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // insert all vehicle details details
  const handleCustomerData = async () => {
    try {
      const errors = {};
      if (!formData.fname) errors.fname = 'First name is required.';
      if (!formData.lname) errors.lname = 'Last name is required.';
      if (!formData.nic) errors.nic = 'NIC / Passport number is required.';
      if (!formData.address) errors.address = 'Address is required.';
      if (!formData.email) errors.email = 'Email address is required.';
      if (!formData.contact_no) errors.contact_no = 'Contact number is required.';

      if (!formData.checkdata) {
        errors.checkdata = 'You must confirm the information is accurate.';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        Swal.fire({
          title: 'Warning', text: 'Please correct the errors in the form.', icon: 'error', customClass: { popup: 'custom-popup'}});
        return;
      }
      const data = {
        policy_id: policy_id,
        ...formData
      };

      const response = await axios.post('http://127.0.0.1:8001/api/policycustomers', data);

      if (response.status === 200) {
        navigate('/uploaddocument', { state: { responseData: response.data } });
      } else {
        console.error('Response error:', response.data);
      }
      // Swal.fire({title: 'Success', text: response.data.message, icon: 'success', customClass: { popup: 'custom-popup'}});
      } catch (error) {
      Swal.fire({title: 'Error', text: error.message, icon: 'error', customClass: {popup: 'custom-popup'}});
    }
  };



  return (
    <div>
    <Header />

    <main className="main">

  
        <div className="page-title" data-aos="fade">
        <div className="container d-lg-flex justify-content-between align-items-center">
            <h1 className="mb-2 mb-lg-0">Starter Page</h1>
            <nav className="breadcrumbs">
            <ol>
                <li><a href="/main2">Home</a></li>
                <li className="current">Starter Page</li>
            </ol>
            </nav>
        </div>
        </div>


        <section id="starter-section" className="starter-section section">


            <div className="container section-title" data-aos="fade-up">
                <h2>Tell Us About You</h2>
                <p>Please provide accurate customer details to ensure smooth processing of your vehicle insurance. Your information is kept secure and helps us tailor the best coverage for you.</p>
            </div>

            <div className="container" data-aos="fade-up">
              
            <form class="php-email-form" data-aos="fade-up" data-aos-delay="400">
                    <h5>Customer information</h5>


                  <div className="row mb-2 mt-3">
                    <div className="col-md-4">
                        <label htmlFor="fname" className="form-label">First Name  <span className='text-danger'>*</span></label>
                        <input type="text" id="fname" name="fname" className={`form-control ${formErrors.fname ? 'is-invalid' : ''}`} placeholder="First Name" onChange={handleInputChange}  />
                        {formErrors.fname && <div className="invalid-feedback">{formErrors.fname}</div>}
                    </div>

                    <div className="col-md-4">
                        <label htmlFor="lname" className="form-label">Last Name  <span className='text-danger'>*</span></label>
                        <input type="text" id="lname" name="lname" className={`form-control ${formErrors.lname ? 'is-invalid' : ''}`} placeholder="Last Name" onChange={handleInputChange} />
                        {formErrors.lname && <div className="invalid-feedback">{formErrors.lname}</div>}
                    </div>

                    <div className="col-md-4">
                      <label htmlFor="nic" className="form-label">NIC / Passport No <span className='text-danger'>*</span></label>
                      <input type="text" id="nic" name="nic" className={`form-control ${formErrors.nic ? 'is-invalid' : ''}`} placeholder="NIC / Passport No" onChange={handleInputChange} />
                      {formErrors.nic && <div className="invalid-feedback">{formErrors.nic}</div>}
                    </div>
                  </div>

                  <div className="row mb-2">
                    <div className="col-md-12">
                      <label htmlFor="address" className="form-label">Address  <span className='text-danger'>*</span></label>
                      <input type="text" id="address" name="address" className={`form-control ${formErrors.address ? 'is-invalid' : ''}`} placeholder="Address" onChange={handleInputChange} />
                      {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
                    </div>

                  </div>

                  <div className="row mb-2">
                    <div className="col-md-8">
                      <label htmlFor="email" className="form-label">Email Address  <span className='text-danger'>*</span></label>
                      <input type="email" id="email" name="email" className={`form-control ${formErrors.email ? 'is-invalid' : ''}`} placeholder="Email Address" onChange={handleInputChange}/>
                      {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                    </div>

                    <div className="col-md-4">
                    <label htmlFor="contact_no" className="form-label">Contact Number  <span className='text-danger'>*</span></label>
                    <input type="number" id="contact_no" name="contact_no" className={`form-control ${formErrors.contact_no ? 'is-invalid' : ''}`} placeholder="Contact Number" onChange={handleInputChange} />
                    {formErrors.contact_no && <div className="invalid-feedback">{formErrors.contact_no}</div>}
                  </div>
                </div>

                <div className="form-check mt-3 mb-3">
                  <input className={`form-check-input ${formErrors.checkdata ? 'is-invalid' : ''}`} type="checkbox" value="1" name="checkdata" id="checkdata" checked={formData.checkdata} onChange={(e) => setFormData({...formData, checkdata: e.target.checked })}/>
                    <label className="form-check-label" htmlFor="checkdata">
                      I confirm that I have reviewed all the information provided and it is accurate.
                      <span className="text-danger">*</span>
                    </label>
                    {formErrors.checkdata && (<div className="invalid-feedback">{formErrors.checkdata}</div>)}
                </div>


                    <center>
                      <button type='button' className='get-submit-button' onClick={handleCustomerData}> Continue Insurance Plan</button>
                    </center>
                  </form>


            </div>

        </section>

    </main>



    <Footer />
  </div>   
       
  



  );
};
export default CustomerInfo;
