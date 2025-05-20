import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { Select } from "antd";
import "./chart.scss";
import { getRequest } from "../../../services/api";

Chart.register(...registerables);

const { Option } = Select;

const SubscriptionChart = () => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2020 + 1 }, (_, i) => currentYear - i).filter(
    (year) => year >= 2020
  );

  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [subscriptionData, setSubscriptionData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptionData();
  }, [selectedYear]);

  const fetchSubscriptionData = async () => {
    try {
      setLoading(true);
      const response = await getRequest(`/monthly-subscription-count?year=${selectedYear}`);
      if (response && response.data) {
        setSubscriptionData(response.data);
      }
    } catch (error) {
      console.error("Error fetching subscription data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyData = () => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Create an array of 12 values, one for each month
    const monthlyData = Array(12).fill(0);

    // If we have data from the API, populate our array
    if (subscriptionData && subscriptionData.length > 0) {
      subscriptionData.forEach(item => {
        // API might return month index (0-11) or month number (1-12)
        const monthIndex = item.month ? (parseInt(item.month) - 1) : 0;
        if (monthIndex >= 0 && monthIndex < 12) {
          monthlyData[monthIndex] = item.count || 0;
        }
      });
    }

    return monthlyData;
  };

  const data = {
    labels: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ],
    datasets: [
      {
        label: "Monthly Subscriptions",
        data: getMonthlyData(),
        backgroundColor: "#7B61FF",
        borderColor: "#7B61FF",
        borderWidth: 1,
        barThickness: 36,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          // display: false, // Uncomment to hide vertical grid lines
        },
        ticks: {
          color: "#000000", // Color of the x-axis labels
        },
        border: {
          display: true,
          color: "#000000", // Color of the x-axis border
          width: 2, // Thickness of the x-axis border
        },
      },
      y: {
        grid: {
          // display: false, // Uncomment to hide horizontal grid lines
        },
        ticks: {
          color: "#000000", // Color of the y-axis labels
        },
        border: {
          display: true,
          color: "#000000", // Color of the y-axis border
          width: 2, // Thickness of the y-axis border
        },
      },
    },
    plugins: {
      datalabels: {
        display: true,
        align: "end",
        anchor: "end",
        color: "#000000", // Color of the data labels
        borderWidth: 1,
        borderColor: "#000000", // Border color for the data labels
        backgroundColor: "#FFFFFF", // Background color for the data labels
        padding: 4, // Padding for the data labels
        formatter: function (value) {
          return value; // Show the value as it is
        },
      },
    },
    maintainAspectRatio: false,
  };

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  return (
    <div className="col-12 my-lg-4 pt-lg-2 pb-5">
      <div className="bar-chart pb-4">
        <div className="d-flex justify-content-between align-items-center px-4 mx-2 py-4">
          <span className="mb-0 bar-chart-text1">Monthly Subscriptions</span>

          <Select
            style={{ width: "100px", height: "33px" }}
            className="dash-select"
            defaultValue={currentYear}
            onChange={handleYearChange}
            value={selectedYear}
          >
            {years.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
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

export default SubscriptionChart;
