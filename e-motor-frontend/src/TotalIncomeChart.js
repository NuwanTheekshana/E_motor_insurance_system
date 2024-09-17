import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';
import axios from 'axios';

const TotalIncomeBarChart = () => {
  const [chartData, setChartData] = useState([['Vehicle Usage', 'Total Income']]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from API
    axios.get('http://127.0.0.1:8001/api/admin/dashboaddetails')
      .then(response => {
        // Extract data from the response
        const apiData = response.data.usage_income;
        // Format data for the chart
        const formattedData = apiData.map(item => [item.usage_type, parseFloat(item.TOTAL_INCOME)]);
        setChartData([['Vehicle Usage', 'Total Income'], ...formattedData]);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []); // Empty dependency array means this runs once when the component mounts

  const options = {
    title: 'Total Income by Vehicle Usage',
    chartArea: { width: '60%' },
    hAxis: {
      title: 'Total Income',
      minValue: 0,
      textStyle: { color: '#003d72' }, 
      titleTextStyle: { color: '#003d72' }, 
    },
    vAxis: {
      title: 'Vehicle Usage',
      textStyle: { color: '#003d72' }, 
      titleTextStyle: { color: '#003d72' }, 
    },
    series: {
      0: { color: '#048ABF' }, 
      1: { color: '#04B2D9' }, 
      2: { color: '#048ABF' }, 
      3: { color: '#0477BF' }
    },
    bars: 'vertical', // Use vertical bars
    backgroundColor: 'transparent', // Light background
    legend: { position: 'none' }, // Hide legend if not needed
    bar: { groupWidth: '75%' }, // Adjust bar width for better visibility
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
          chartType="BarChart" // Use BarChart for proper color application
          data={chartData}
          options={options}
        />
      )}
    </div>
  );
};

export default TotalIncomeBarChart;
