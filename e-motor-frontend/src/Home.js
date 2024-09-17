import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './Navbar';
import homeimg from './img/ent_img.avif';
import TotalIncomeChart from './TotalIncomeChart'; // Import the chart component
import TotalIncomeChart_Fuel from './total_income_fuel_type'; // Import the chart component

function Home() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [totalPolicyCount, setTotalPolicyCount] = useState(0);
  const [monthlyPolicyCount, setMonthlyPolicyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API
    axios.get('http://127.0.0.1:8001/api/admin/dashboaddetails')
      .then(response => {
        const data = response.data;

        // Update state with the fetched data
        setTotalIncome(parseFloat(data.total_income[0].TOTAL_INCOME));
        setMonthlyIncome(parseFloat(data.current_month_income[0].TOTAL_INCOME));
        setTotalPolicyCount(data.total_policy_count[0].policy_count);
        setMonthlyPolicyCount(data.month_policy_count[0].policy_count);

        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  return (
    <div className="background-container">
      <Navbar />
      <main>
        <div className="container mt-5">
          <div className="row">
            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card border-primary mb-3" style={{ height: '200px', backgroundColor: '#f0f8ff', color: '#007bff' }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <i className="bi bi-currency-dollar" style={{ fontSize: '2rem', color: '#007bff' }}></i>
                  <h3 className="card-title mt-3 text-center">Total Income</h3>
                  {loading ? <h4 className="card-text">Loading...</h4> : <h4 className="card-text">Rs. {totalIncome.toLocaleString()}</h4>}
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card border-primary mb-3" style={{ height: '200px', backgroundColor: '#e6f0ff', color: '#0056b3' }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <i className="bi bi-calendar-plus" style={{ fontSize: '2rem', color: '#0056b3' }}></i>
                  <h3 className="card-title mt-3 text-center">Monthly Income</h3>
                  {loading ? <h4 className="card-text">Loading...</h4> : <h4 className="card-text">Rs. {monthlyIncome.toLocaleString()}</h4>}
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card border-primary mb-3" style={{ height: '200px', backgroundColor: '#cce5ff', color: '#003d79' }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <i className="bi bi-file-earmark-text" style={{ fontSize: '2rem', color: '#003d79' }}></i>
                  <h3 className="card-title mt-3 text-center">Total Policy Count</h3>
                  {loading ? <h4 className="card-text">Loading...</h4> : <h4 className="card-text">{totalPolicyCount}</h4>}
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-3 mb-4">
              <div className="card border-primary mb-3" style={{ height: '200px', backgroundColor: '#b3d9ff', color: '#002d72' }}>
                <div className="card-body d-flex flex-column align-items-center justify-content-center">
                  <i className="bi bi-calendar" style={{ fontSize: '2rem', color: '#002d72' }}></i>
                  <h3 className="card-title mt-3 text-center">Monthly Policy Count</h3>
                  {loading ? <h4 className="card-text">Loading...</h4> : <h4 className="card-text">{monthlyPolicyCount}</h4>}
                </div>
              </div>
            </div>
          </div>

          {/* Add the charts here */}
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card border-primary">
                <div className="card-body">
                  <TotalIncomeChart />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card border-primary">
                <div className="card-body">
                  <TotalIncomeChart_Fuel />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
