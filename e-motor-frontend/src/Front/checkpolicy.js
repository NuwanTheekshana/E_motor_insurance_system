import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';

function CheckPolicy() {
  const { id } = useParams();
  const [policyDetails, setPolicyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });

    async function fetchPolicyDetails() {
      try {
        const response = await axios.get(`http://127.0.0.1:8001/api/policycheck/${id}`);
        setPolicyDetails(response.data.policy_details);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching policy details:', error);
        setError('Failed to fetch policy details');
        setLoading(false);
      }
    }

    fetchPolicyDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!policyDetails) {
    return <div>No policy details available</div>;
  }

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <main className="main">
        <div className="page-title" data-aos="fade">
          <h1>Policy Details</h1>
        </div>

        <section id="policy-details-section" className="section">
          <div className="container section-title" data-aos="fade-up">
            <h2>Insurance Policy Details</h2>
          </div>

          <div className="container">
            <style>
              {`
                .container {
                  max-width: 800px;
                  margin: auto;
                }

                .table-container {
                  overflow-x: auto;
                }

                .table {
                  width: 100%;
                  border-collapse: collapse;
                }

                .table td, .table th {
                  padding: 8px;
                  border: 1px solid #ddd;
                }

                @media (max-width: 768px) {
                  .table td, .table th {
                    display: block;
                    width: 100%;
                    box-sizing: border-box;
                  }

                  .table thead {
                    display: none;
                  }

                  .table tr {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ddd;
                  }

                  .table td {
                    text-align: left;
                    position: relative;
                    padding-left: 50%;
                    font-weight: bold;
                  }

                  .table td::before {
                    content: attr(data-label);
                    position: absolute;
                    left: 0;
                    width: 50%;
                    padding-left: 10px;
                    font-weight: bold;
                    white-space: nowrap;
                  }
                }
              `}
            </style>
            <div className="table-container d-flex justify-content-center align-items-center">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td data-label="Policy Holder Name:"><strong>Policy Holder Name:</strong></td>
                    <td>{policyDetails.policy_holder_name}</td>
                  </tr>
                  <tr>
                    <td data-label="Vehicle Number:"><strong>Vehicle Number:</strong></td>
                    <td>{policyDetails.vehicle_no}</td>
                  </tr>
                  <tr>
                    <td data-label="Engine Number:"><strong>Engine Number:</strong></td>
                    <td>{policyDetails.engine_no}</td>
                  </tr>
                  <tr>
                    <td data-label="Chassis Number:"><strong>Chassis Number:</strong></td>
                    <td>{policyDetails.chassis_no}</td>
                  </tr>
                  <tr>
                    <td data-label="Policy Number:"><strong>Policy Number:</strong></td>
                    <td>{policyDetails.policy_no}</td>
                  </tr>
                  <tr>
                    <td data-label="Policy Period:"><strong>Policy Period:</strong></td>
                    <td>{policyDetails.policy_period}</td>
                  </tr>
                  <tr>
                    <td data-label="Issue Date:"><strong>Issue Date:</strong></td>
                    <td>{policyDetails.issue_date}</td>
                  </tr>
                  <tr>
                    <td data-label="Expiration Date:"><strong>Expiration Date:</strong></td>
                    <td>{policyDetails.expiration_date}</td>
                  </tr>
                  <tr>
                    <td data-label="NIC:"><strong>NIC:</strong></td>
                    <td>{policyDetails.nic}</td>
                  </tr>
                  <tr>
                    <td data-label="Email:"><strong>Email:</strong></td>
                    <td>{policyDetails.email}</td>
                  </tr>
                  <tr>
                    <td data-label="Status:"><strong>Status:</strong></td>
                    <td>{policyDetails.status}</td>
                  </tr>
                  <tr>
                    <td data-label="Certificate Status:"><strong>Certificate Status:</strong></td>
                    <td>{policyDetails.cetificate_status ? 'Issued' : 'Not Issued'}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default CheckPolicy;
