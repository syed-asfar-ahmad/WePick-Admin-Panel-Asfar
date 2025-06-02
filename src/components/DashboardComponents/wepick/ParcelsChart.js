import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./chart.scss";
import { getRequest } from "../../../services/api";
import { Select } from "antd";

Chart.register(...registerables);

const STATUS_COLORS = {
  delivered: '#4CAF50', // green
  pending: '#FFC107',  // yellow
  unknown: '#BDBDBD',  // gray
  failed: '#ff4d4f',   // red
};

const DispatchedParcelsChart = () => {
  const [dailyData, setDailyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => currentYear - i).filter(year => year >= 2020);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Mock monthly data for 12 months
  const mockMonthlyData = [
    { month: 'Jan', count: 1000 },
    { month: 'Feb', count: 800 },
    { month: 'Mar', count: 950 },
    { month: 'Apr', count: 700 },
    { month: 'May', count: 1200 },
    { month: 'Jun', count: 1100 },
    { month: 'Jul', count: 900 },
    { month: 'Aug', count: 1050 },
    { month: 'Sep', count: 980 },
    { month: 'Oct', count: 1150 },
    { month: 'Nov', count: 1020 },
    { month: 'Dec', count: 1300 },
  ];

  useEffect(() => {
    fetchDailyData();
  }, []);

  const fetchDailyData = async () => {
    try {
      setLoading(true);
      // Replace with your actual endpoint for last 10 days
      const response = await getRequest(`/daily-dispatched-parcels?days=10`);
      if (response && response.data && response.data.length > 0) {
        setDailyData(response.data);
      } else {
        setDailyData(mockMonthlyData);
      }
    } catch (error) {
      setDailyData(mockMonthlyData);
      console.error("Error fetching dispatched parcels data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const labels = mockMonthlyData.map(item => item.month);
  const dataCounts = mockMonthlyData.map(item => item.count);

  const data = {
    labels, // Months as x-axis labels
    datasets: [
      {
        label: "Dispatched Parcels",
        data: dataCounts,
        backgroundColor: '#4CAF50', // green for all bars
        borderRadius: 6,
        barThickness: 24,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: "#fff",
        titleColor: "#0d0d0d",
        titleFont: { family: "Montserrat", weight: "bold", size: 15 },
        bodyColor: "#0d0d0d",
        bodyFont: { family: "Montserrat", size: 14 },
        borderColor: "#E4E3E4",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
        callbacks: {
          title: (items) => `Month: ${items[0].label}`,
          label: (item) => `Dispatched: ${item.parsed.y}`,
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#0d0d0d',
          font: {
            family: 'Montserrat',
            size: 14,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E4E3E4',
        },
        ticks: {
          color: '#BDBDBD',
          font: {
            family: 'Montserrat',
            size: 13,
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="col-12 my-lg-4 pt-lg-2 pb-5">
      <div className="bar-chart pb-4" style={{ borderRadius: 16, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div className="d-flex justify-content-between align-items-center px-4 mx-2 py-4">
          <span className="mb-0 bar-chart-text1" style={{ fontFamily: 'Montserrat', fontSize: 18, fontWeight: 600, color: '#0d0d0d' }}>
            Dispatched Parcels Chart
          </span>
          <Select
            style={{ width: "100px", height: "33px" }}
            className="dash-select"
            value={selectedYear}
            onChange={setSelectedYear}
            dropdownStyle={{ fontFamily: 'Montserrat' }}
          >
            {years.map((year) => (
              <Select.Option key={year} value={year}>
                {year}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="bar-chart-padding">
          <div className="pt-3" style={{ height: "350px" }}>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DispatchedParcelsChart; 