import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';

const TotalIncomePieChart = () => {
  const [chartData, setChartData] = useState([['Fuel Type', 'Total Income']]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API
    axios.get('http://127.0.0.1:8001/api/admin/dashboaddetails')
      .then(response => {
        // Extract data from the response
        const apiData = response.data.fuel_income;
        // Format data for the chart
        const formattedData = apiData.map(item => [item.fuel_type, parseFloat(item.TOTAL_INCOME)]);
        setChartData([['Fuel Type', 'Total Income'], ...formattedData]);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  const options = {
    title: 'Total Income by Fuel Type',
    pieHole: 0.4, // Creates a donut chart effect
    pieSliceText: 'label', // Displays the label on the pie slices
    slices: {
      0: { offset: 0.1 }, // Adds a little space around the first slice for emphasis
      1: { offset: 0.1 },
      2: { offset: 0.1 },
      3: { offset: 0.1 },
    },
    backgroundColor: 'transparent', // Light background
    legend: { position: 'right' }, // Legend on the right
    pieStartAngle: 100, // Start angle for the pie chart
  };

  return (
    <div style={{ width: '100%', height: '400px' }}>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>Error loading data: {error.message}</p>
      ) : (
        <Chart
          width={'100%'}
          height={'100%'}
          chartType="PieChart" // Use PieChart for pie chart
          data={chartData}
          options={options}
        />
      )}
    </div>
  );
};

export default TotalIncomePieChart;
