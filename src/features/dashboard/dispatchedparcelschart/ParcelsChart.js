import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { getAdminDashboard } from "../../../services/wepickApi";
import { Chart, registerables } from "chart.js";
import "./chart.scss";
import { Select } from "antd";
import Loading from '../../../components/common/Loading';

Chart.register(...registerables);

const STATUS_COLORS = {
  "In Transit": {
    color: "#1BC949",
    background: "#E6F9F0",
  },
  "Failed": {
    color: "#FF4D4F",
    background: "#FFEAEA",
  },
};

const DispatchedParcelsChart = () => {
  const [dailyData, setDailyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadershown, setLoaderShown] = useState(true);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => currentYear - i).filter(year => year >= 2020);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const fetchDailyData = async () => {
    try {
      setIsLoading(true);
      const response = await getAdminDashboard();
      const reportDetails = response?.data?.reportDetails || [];
      // Process the data to get monthly counts for the selected year
      const monthlyCounts = Array(12).fill(0);
      reportDetails.forEach(parcel => {
        const date = new Date(parcel.dateTime);
        if (date.getFullYear() === selectedYear) {
          const month = date.getMonth();
          monthlyCounts[month]++;
        }
      });
      // Convert to the format expected by the chart
      const processedData = monthlyCounts.map((count, index) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index],
        count: count
      }));
      setDailyData(processedData);
    } catch (error) {
      setDailyData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderShown(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    fetchDailyData();
  }, [selectedYear]);

  const labels = dailyData.map(item => item.month);
  const dataCounts = dailyData.map(item => item.count);

  const data = {
    labels,
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
          title: (items) => {
            const monthAbbr = items[0].label;
            const monthNames = {
              'Jan': 'January',
              'Feb': 'February',
              'Mar': 'March',
              'Apr': 'April',
              'May': 'May',
              'Jun': 'June',
              'Jul': 'July',
              'Aug': 'August',
              'Sep': 'September',
              'Oct': 'October',
              'Nov': 'November',
              'Dec': 'December'
            };
            return `Month: ${monthNames[monthAbbr] || monthAbbr}`;
          },
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
        {loadershown ? (
          <Loading />
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default DispatchedParcelsChart;