import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import 'aos/dist/aos.css';
import Swal from 'sweetalert2';

import Header from './Components/header';
import Footer from './Components/footer';

function UploadDocument() {
  const navigate = useNavigate();
  const location = useLocation();
  const { responseData } = location.state || {};
  const policy_id = responseData?.policy_id;

  const [documents, setDocuments] = useState({
    vehicleBookUploaded: false,
    vehicleBook: null,
    inspectionReport: null,
    nicFront: null,
    nicBack: null,
    passport: null,
    vehicleFront: null,
    vehicleLeft: null,
    vehicleRear: null,
    vehicleRight: null,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    
    async function fetchDocumentStatus() {
      try {
        const response = await axios.get(`http://127.0.0.1:8001/api/vehiclebookcheck/${policy_id}`);
        setDocuments((prevDocs) => ({
          ...prevDocs,
          vehicleBookUploaded: response.data.vehicleBookUploaded,
        }));
      } catch (error) {
        console.error('Error fetching document status:', error);
      }
    }
    
    fetchDocumentStatus();
  }, []);

  const detectVehicle = async (base64Image) => {
    const apiKey = 'AIzaSyATcMqxWEmiKmpMet0LsB6y7I3_EKiRAMU';
    const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

    const requestBody = {
      requests: [
        {
          image: { content: base64Image },
          features: [{ type: 'OBJECT_LOCALIZATION' }],
        },
      ],
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const result = await response.json();
      const annotations = result.responses[0].localizedObjectAnnotations;
      const targetVehicles = ['car', 'truck', 'bike', 'van', 'bus', 'vehicle', 'lorry'];
      const detectedVehicles = targetVehicles.filter(target =>
        annotations.some(annotation => annotation.name.toLowerCase() === target.toLowerCase())
      );
      return detectedVehicles;
    } catch (error) {
      console.error('Error detecting vehicle:', error);
      return false;
    }
  };

  const handleDrop = async (acceptedFiles, docType) => {
    const file = acceptedFiles[0];
    const imageUrl = URL.createObjectURL(file);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.replace(/^data:image\/[a-z]+;base64,/, '');

      let isVehicle = false;
      if (['vehicleFront', 'vehicleLeft', 'vehicleRear', 'vehicleRight'].includes(docType)) {
        isVehicle = await detectVehicle(base64Image);
      }

      if (isVehicle || !['vehicleFront', 'vehicleLeft', 'vehicleRear', 'vehicleRight'].includes(docType)) {

        console.log("Detection completed..");

        setDocuments({
          ...documents,
          [docType]: { file, imageUrl },
        });
      } else {
        Swal.fire({
          title: 'No Vehicle Detected',
          text: `Please upload a valid vehicle image.`,
          icon: 'error',
          customClass: {popup: 'custom-popup'}
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (docType) => {
    setDocuments({
      ...documents,
      [docType]: null,
    });
  };

  const getDropzoneProps = (onDrop) => ({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    multiple: false,
  });

  const { getRootProps: getVehicleBookRootProps, getInputProps: getVehicleBookInputProps } = useDropzone(getDropzoneProps((acceptedFiles) => handleDrop(acceptedFiles, 'vehicleBook')));
  const { getRootProps: getInspectionReportRootProps, getInputProps: getInspectionReportInputProps } = useDropzone(getDropzoneProps((acceptedFiles) => handleDrop(acceptedFiles, 'inspectionReport')));
  const { getRootProps: getNicFrontRootProps, getInputProps: getNicFrontInputProps } = useDropzone(getDropzoneProps((acceptedFiles) => handleDrop(acceptedFiles, 'nicFront')));
  const { getRootProps: getNicBackRootProps, getInputProps: getNicBackInputProps } = useDropzone(getDropzoneProps((acceptedFiles) => handleDrop(acceptedFiles, 'nicBack')));
  const { getRootProps: getPassportRootProps, getInputProps: getPassportInputProps } = useDropzone(getDropzoneProps((acceptedFiles) => handleDrop(acceptedFiles, 'passport')));
  const { getRootProps: getVehicleFrontRootProps, getInputProps: getVehicleFrontInputProps } = useDropzone(getDropzoneProps((acceptedFiles) => handleDrop(acceptedFiles, 'vehicleFront')));
  const { getRootProps: getVehicleLeftRootProps, getInputProps: getVehicleLeftInputProps } = useDropzone(getDropzoneProps((acceptedFiles) => handleDrop(acceptedFiles, 'vehicleLeft')));
  const { getRootProps: getVehicleRearRootProps, getInputProps: getVehicleRearInputProps } = useDropzone(getDropzoneProps((acceptedFiles) => handleDrop(acceptedFiles, 'vehicleRear')));
  const { getRootProps: getVehicleRightRootProps, getInputProps: getVehicleRightInputProps } = useDropzone(getDropzoneProps((acceptedFiles) => handleDrop(acceptedFiles, 'vehicleRight')));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append('policy_id', policy_id);
    Object.keys(documents).forEach((docType) => {
      if (documents[docType] && documents[docType].file) {
        formData.append(docType, documents[docType].file);
      }
    });

    try {
      const response = await axios.post('http://127.0.0.1:8001/api/documentupload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        console.log('Documents uploaded successfully!');
        navigate('/validatingpage', { state: { responseData: response.data } });
      }
      
    } catch (error) {
      Swal.fire({ title: 'Error', text: error.message, icon: 'error', customClass: {popup: 'custom-popup'} });
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentField = (label, docType, dropzoneProps, inputProps) => (
    <div className="col mb-3">
      <label>{label} <span className="text-danger">*</span></label>
      {documents[docType]?.imageUrl ? (
        <div className="d-flex align-items-center">
          <img
            src={documents[docType].imageUrl}
            alt={label}
            style={{maxWidth: '100%',maxHeight: '150px', objectFit: 'cover', borderRadius: '8px', border: '4px solid var(--accent-color)' }} />
          <button type="button" className="get-submit-button-sm" onClick={() => handleRemoveImage(docType)}>
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ) : (
        <div {...dropzoneProps} className="dropzone">
          <input {...inputProps} />
          <div className="plus-button">
            <button type="button" className="get-submit-button-sm">+</button>
          </div>
        </div>
      )}
    </div>
  );

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
            <h2>Upload Vehicle Documents and Images</h2>
            <p>Upload the necessary documents and images to verify your vehicle details and finalize your insurance plan.</p>
          </div>

          <div className="container" data-aos="fade-up">

              <div class="alert alert-info" role="alert">
              <i class="bi bi-info-circle-fill"></i> If any documents or images are missing, we will issue a 60-day cover note in place of the insurance certificate until you complete the necessary submissions. Please note that you can upload your NIC or passport image as needed.
              </div>

            <form onSubmit={handleSubmit} className="row mt-4">
              <b>
                <h5 className="mb-3">Vehicle Documents</h5>
              </b>
              <div className="row">
                {!documents.vehicleBookUploaded && renderDocumentField('Vehicle Book Image', 'vehicleBook', getVehicleBookRootProps(), getVehicleBookInputProps())}
                {renderDocumentField('Inspection Report', 'inspectionReport', getInspectionReportRootProps(), getInspectionReportInputProps())}
                {renderDocumentField('NIC Front Side', 'nicFront', getNicFrontRootProps(), getNicFrontInputProps())}
                {renderDocumentField('NIC Back Side', 'nicBack', getNicBackRootProps(), getNicBackInputProps())}
                {renderDocumentField('Passport Image', 'passport', getPassportRootProps(), getPassportInputProps())}
              </div>

              <b>
                <h5 className="mt-3">Vehicle Images</h5>
              </b>
              <div className="row">
                {renderDocumentField('Vehicle Front Image', 'vehicleFront', getVehicleFrontRootProps(), getVehicleFrontInputProps())}
                {renderDocumentField('Vehicle Left Image', 'vehicleLeft', getVehicleLeftRootProps(), getVehicleLeftInputProps())}
                {renderDocumentField('Vehicle Rear Image', 'vehicleRear', getVehicleRearRootProps(), getVehicleRearInputProps())}
                {renderDocumentField('Vehicle Right Image', 'vehicleRight', getVehicleRightRootProps(), getVehicleRightInputProps())}
              </div>

              

              

              <div className="d-flex justify-content-center">
                {loading ? (
                  <button type="button" className="get-submit-button mt-3"><div className="spinner-border spinner-border-sm text-white" role="status"></div>&nbsp; Uploading...</button>
                ) : (
                  <button type="button" className="get-submit-button mt-3" onClick={handleSubmit}>Upload Your Documents</button>
                )}
              </div>

            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default UploadDocument;
