import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';

import Header from './Components/header';
import Footer from './Components/footer';

function VehicleInfo() {
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const [uploadedImageFile, setUploadedImageFile] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [AllCategory, setAllCategory] = useState([]);
  const [AllUsage, setAllUsage] = useState([]);
  const [AllFuel, setAllFuel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicle_category: '',
    vehicle_usage: '',
    vehicle_fuel: '',
    vehiclebook: '',
    registration_no: '',
    engine_no: '',
    chassis_no: '',
    vehicle_fuel: '',
    makeModel: '',
    yearOfMake: '',
    seatingcapacity: '',
    marketValue: '',
    checkdata: false
  });
  const [formErrors, setFormErrors] = useState({
    vehicle_category: '',
    vehicle_usage: '',
    vehicle_fuel: '',
    vehiclebook: '',
    registration_no: '',
    engine_no: '',
    chassis_no: '',
    vehicle_fuel: '',
    makeModel: '',
    yearOfMake: '',
    seatingcapacity: '',
    marketValue: '',
    checkdata: false
  });
  const [apiResponse, setApiResponse] = useState({
    vehicle_class: '',
    registration_number: '',
    engine_number: '',
    chassis_number: '',
    fuel_type: '',
    make: '',
    model: '',
    year_of_manufacture: ''
  });
  


  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    categoryData();
    usageData();
    fuelData();
  }, []);
  

  const categoryData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8001/api/admin/vehiclecategories`);
      setAllCategory(response.data.category);
    } catch (error) {
      console.error('Error fetching All Category list', error);
    }
  };

  const usageData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8001/api/admin/vehicleusage`);
      setAllUsage(response.data.usage);
    } catch (error) {
      console.error('Error fetching All Usage list', error);
    }
  };

  const fuelData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8001/api/admin/vehiclefuel`);
      setAllFuel(response.data.fuel);
    } catch (error) {
      console.error('Error fetching All Fuel list', error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadImage(file);
    }
    setIsDragging(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    setUploadedImageFile(file);
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:8001/api/extractimagetotext', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const data = response.data || {};
      setApiResponse(data);

      setFormData({
        ...formData,
        vehicle_category: data.vehicle_class || '',
        registration_no: data.registration_number || '',
        engine_no: data.engine_number || '',
        chassis_no: data.chassis_number || '',
        vehicle_fuel: data.fuel_type || '',
        makeModel: `${data.make || ''} ${data.model || ''}`,
        yearOfMake: data.year_of_manufacture || '',
        seatingcapacity: '',
        marketValue: '',
        vehiclebook: ''
      });

      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image and extracting text', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    setApiResponse({
      vehicle_class: '',
      registration_number: '',
      engine_number: '',
      chassis_number: '',
      fuel_type: '',
      make: '',
      model: '',
      year_of_manufacture: ''
    });
  };


  // insert all vehicle details details
  const handleAddVehicleData = async () => {
    try {
      const errors = {};
      if (!formData.vehicle_category) errors.vehicle_category = 'Vehicle category is required.';
      if (!formData.vehicle_usage) errors.vehicle_usage = 'Vehicle usage is required.';
      if (!formData.registration_no) errors.registration_no = 'Vehicle registration number is required.';
      if (!formData.engine_no) errors.engine_no = 'Engine number is required.';
      if (!formData.chassis_no) errors.chassis_no = 'Chassis number is required.';
      if (!formData.vehicle_fuel) errors.vehicle_fuel = 'Fuel type is required.';
      if (!formData.makeModel) errors.makeModel = 'Make model is required.';
      if (!formData.yearOfMake) errors.yearOfMake = 'Manufacture year is required.';
      if (!formData.seatingcapacity) errors.seatingcapacity = 'Seating capacity is required.';
      if (!formData.marketValue) errors.marketValue = 'Market value is required.';

      if (!formData.checkdata) {
        errors.checkdata = 'You must confirm the information is accurate.';
      }
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        Swal.fire({
          title: 'Warning',
          text: 'Please correct the errors in the form.',
          icon: 'error',
          customClass: {
            popup: 'custom-popup'
          }
        });
        return;
      }
  
      const vehicleData = new FormData();
      vehicleData.append('vehicle_category', formData.vehicle_category);
      vehicleData.append('registration_no', formData.registration_no);
      vehicleData.append('vehicle_usage', formData.vehicle_usage);
      vehicleData.append('engine_no', formData.engine_no);
      vehicleData.append('chassis_no', formData.chassis_no);
      vehicleData.append('vehicle_fuel', formData.vehicle_fuel);
      vehicleData.append('makeModel', formData.makeModel);
      vehicleData.append('yearOfMake', formData.yearOfMake);
      vehicleData.append('seatingcapacity', formData.seatingcapacity);
      vehicleData.append('marketValue', formData.marketValue);
  
      if (uploadedImageFile) {
        vehicleData.append('vehiclebook', uploadedImageFile);
      }

      const response = await axios.post('http://127.0.0.1:8001/api/vehicledata', vehicleData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        navigate('/buyinsuranceplan', { state: { responseData: response.data } });
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
                    <h2>Begin Vehicle Insurance</h2>
                    <p>Kick off your journey to comprehensive vehicle protection by providing essential details about your vehicle. This information helps us customize your insurance plan to suit your needs and ensure you get the best coverage. Simple, secure, and tailored to you.</p>
                </div>

                <div className="container" data-aos="fade-up">
                   
                <form class="php-email-form" data-aos="fade-up" data-aos-delay="400">
                        <h5>Vehicle Details</h5>

                        <label className='mt-3 mb-3'>Upload Vehicle Book Image</label>
                          <br />
                          {loading ? (
                            <div className="d-flex justify-content-center">
                              <div className="spinner-border get-text-color" role="status">
                              </div>
                              <p className="mt-2 get-text-color">&nbsp; Analyzing your vehicle book...</p>
                            </div>
                          ) : uploadedImage ? (
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                              <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', border: '4px solid var(--accent-color)', background: 'var(--accent-color)' }} />
                              <button
                                type="button" onClick={handleRemoveImage} className="get-submit-button-sm" ><i className="bi bi-trash"></i>
                              </button>
                            </div>
                          ) : (
                            <div
                              className={`drag-drop-area mb-2 ${isDragging ? 'drag-over' : ''}`} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}
                              style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer', borderRadius: '8px', backgroundColor: isDragging ? '#f7f7f7' : 'white', transition: 'background-color 0.3s ease' }}>
                              <div>
                                <i className="bi bi-upload" style={{ fontSize: '36px', color: '#ccc' }}></i>
                                <p style={{ color: '#999', marginTop: '5px' }}>Drag & Drop your image here or</p>
                                <label className="btn get-submit-button" htmlFor="vehiclebook" style={{ cursor: 'pointer' }}>
                                  Choose File
                                  <input id="vehiclebook" type="file" name='vehiclebook' onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                                </label>
                              </div>
                            </div>
                          )}

                      <div className="row mb-2 mt-3">
                        <div className="col-md-4">
                          <label htmlFor="vehicle_category" className="form-label">Vehicle Category <span className='text-danger'>*</span></label>
                          <select className={`form-control ${formErrors.vehicle_category ? 'is-invalid' : ''}`} id="vehicle_category" name="vehicle_category" onChange={handleInputChange} value={formData.vehicle_category}>
                            <option value="">Select Vehicle Category</option>
                            {AllCategory.map((category) => (
                              <option key={category.vehicle_category_name} value={category.vehicle_category_name}>
                                {category.vehicle_category_name}
                              </option>
                            ))}
                          </select>
                          {formErrors.vehicle_category && <div className="invalid-feedback">{formErrors.vehicle_category}</div>}
                        </div>

                        <div className="col-md-4">
                          <label htmlFor="vehicle_usage" className="form-label">Vehicle Usage  <span className='text-danger'>*</span> </label>
                          <select className={`form-control ${formErrors.vehicle_usage ? 'is-invalid' : ''}`} id="vehicle_usage" name="vehicle_usage" onChange={handleInputChange}>
                            <option value="">Select Vehicle Usage</option>
                            {AllUsage.map((usage) => (
                              <option key={usage.usage_id} value={usage.usage_id}>
                                {usage.usage_type}
                              </option>
                            ))}
                          </select>
                          {formErrors.vehicle_usage && <div className="invalid-feedback">{formErrors.vehicle_usage}</div>}
                        </div>

                        <div className="col-md-4">
                          <label htmlFor="registration_no" className="form-label">Registration No  <span className='text-danger'>*</span></label>
                          <input type="text" id="registration_no" name="registration_no" className={`form-control ${formErrors.registration_no ? 'is-invalid' : ''}`} placeholder="Vehicle Registration No" onChange={handleInputChange} value={formData.registration_no} />
                          {formErrors.registration_no && <div className="invalid-feedback">{formErrors.registration_no}</div>}
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-4">
                          <label htmlFor="engine_no" className="form-label">Engine No  <span className='text-danger'>*</span></label>
                          <input type="text" id="engine_no" name="engine_no" className={`form-control ${formErrors.engine_no ? 'is-invalid' : ''}`}  placeholder="Engine No" onChange={handleInputChange} value={formData.engine_no} />
                          {formErrors.engine_no && <div className="invalid-feedback">{formErrors.engine_no}</div>}
                        </div>

                        <div className="col-md-4">
                          <label htmlFor="chassis_no" className="form-label">Chassis No  <span className='text-danger'>*</span></label>
                          <input type="text" id="chassis_no" name="chassis_no" className={`form-control ${formErrors.chassis_no ? 'is-invalid' : ''}`}  placeholder="Chassis No" onChange={handleInputChange} value={formData.chassis_no} />
                          {formErrors.chassis_no && <div className="invalid-feedback">{formErrors.chassis_no}</div>}
                        </div>

                        <div className="col-md-4">
                          <label htmlFor="vehicle_fuel" className="form-label">Fuel Type  <span className='text-danger'>*</span></label>
                          <select className={`form-control ${formErrors.vehicle_fuel ? 'is-invalid' : ''}`} id="vehicle_fuel" name="vehicle_fuel" onChange={handleInputChange} value={formData.vehicle_fuel}>
                            <option value="">Select Vehicle Fuel</option>
                            {AllFuel.map((fuel) => (
                              <option key={fuel.fuel_type} value={fuel.fuel_type}>
                                {fuel.fuel_type}
                              </option>
                            ))}
                          </select>
                          {formErrors.vehicle_fuel && <div className="invalid-feedback">{formErrors.vehicle_fuel}</div>}
                        </div>
                      </div>

                      <div className="row mb-2">
                        <div className="col-md-8">
                          <label htmlFor="makeModel" className="form-label">Make and Model  <span className='text-danger'>*</span></label>
                          <input type="text" id="makeModel" name="makeModel" className={`form-control ${formErrors.makeModel ? 'is-invalid' : ''}`}  placeholder="Make and Model" onChange={handleInputChange} value={formData.makeModel}/>
                          {formErrors.makeModel && <div className="invalid-feedback">{formErrors.makeModel}</div>}
                        </div>

                        <div className="col-md-4">
                          <label htmlFor="yearOfMake" className="form-label">Year of Make  <span className='text-danger'>*</span></label>
                          <input type="number" id="yearOfMake" name="yearOfMake" className={`form-control ${formErrors.yearOfMake ? 'is-invalid' : ''}`}  placeholder="Year of Make" onChange={handleInputChange} value={formData.yearOfMake} />
                          {formErrors.yearOfMake && <div className="invalid-feedback">{formErrors.yearOfMake}</div>}
                        </div>
                    </div>

                      <div className="row mb-2">
                        <div className="col-md-4">
                          <label htmlFor="seatingcapacity" className="form-label">Seating Capacity  <span className='text-danger'>*</span></label>
                          <input type="number" id="seatingcapacity" name="seatingcapacity" className={`form-control ${formErrors.seatingcapacity ? 'is-invalid' : ''}`}  onChange={handleInputChange} placeholder="Vehicle Seating Capacity" />
                          {formErrors.seatingcapacity && <div className="invalid-feedback">{formErrors.seatingcapacity}</div>}
                        </div>

                        <div className="col-md-4">
                          <label htmlFor="marketValue" className="form-label">Market Value  <span className='text-danger'>*</span></label>
                          <input type="number" id="marketValue" name="marketValue" className={`form-control ${formErrors.marketValue ? 'is-invalid' : ''}`}  onChange={handleInputChange} placeholder="Value in LKR" />
                          {formErrors.marketValue && <div className="invalid-feedback">{formErrors.marketValue}</div>}
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
                          <button type='button' className='get-submit-button' onClick={handleAddVehicleData}> Get Insurance Plan</button>
                        </center>
                      </form>


                </div>

            </section>

  </main>


    <Footer />
  </div>   
       
  



  );
}

export default VehicleInfo;
