import React, { useEffect, useState } from "react";
import ListHeader from "../../molecules/ListHeader/ListHeader";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { getReportStats } from "../../services/service";

Chart.register(...registerables);

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const handlegetStatsData = async () => {
    try {
      const response = await getReportStats();
      if (response?.success) {
        setStats(response?.data);
      }
    } catch (error) {
      console.error("Error fetching users data:", error);
    } finally {
    }
  };

  useEffect(() => {
    handlegetStatsData();
  }, []);
  const data = {
    labels: [
      "Posts - ",
      "Events - ",
      // "Communities - ",
      " Questions - ",
      "Courses -",
      "Stories - ",
      "Users -",
    ],
    datasets: [
      {
        label: "Reports Statistics",
        data: [
          stats?.[0]?.reportCount,
          stats?.[1]?.reportCount,
          // stats?.[2]?.reportCount,
          stats?.[2]?.reportCount,
          stats?.[3]?.reportCount,
          stats?.[5]?.reportCount,
          stats?.[5]?.reportCount,
        ],
        backgroundColor: "#7B61FF",
        borderColor: "#7B61FF",
        borderWidth: 1,
        barThickness: 26,
      },
    ],
  };

  const options = {
    indexAxis: "y",
    scales: {
      x: {
        beginAtZero: true,
        grid: {
          display: false, // Hide the vertical grid lines
        },
        ticks: {
          color: "#655B96", // Color of the x-axis labels
        },
        border: {
          display: true,
          color: "#655B96", // Color of the x-axis border
          width: 1, // Thickness of the x-axis border
        },
      },
      y: {
        grid: {
          display: false, // Hide the horizontal grid lines
        },
        ticks: {
          color: "#655B96", // Color of the y-axis labels
        },
        border: {
          display: true,
          color: "#655B96", // Color of the y-axis border
          width: 1, // Thickness of the y-axis border
        },
      },
    },
    plugins: {
      datalabels: {
        display: true,
        align: "end",
        anchor: "end",
        color: "#655B96", // Color of the data labels
      },
    },
    maintainAspectRatio: false,
  };
  return (
    <div className="row  px-2 pt-4">
      <div className="col-12 pb-3 ">
        <div className="row d-flex align-items-end">
          <div className="col-12 ">
            <ListHeader
              mainHeading="Report Statistics"
              placeholder="Search user by name, email, university or Course"
              btnText=""
              linkbtn=""
              linkBreadCrum="/statistics"
              blinkBreadCrumText="Report Statistics"
            />
          </div>
        </div>
      </div>

      <div className="col-12 mb-5 pb-5 mt-3 pt-4">
        <div className="row d-flex align-items-end">
          <div className="col-12">
            <div className="bar-chart pb-4">
              <div className="d-flex justify-content-between align-items-center px-4 mx-2 py-4">
                <span className="mb-0 bar-chart-text1">Report Statistics</span>
              </div>
              <div className="bar-chart-padding">
                <div className="pt-3" style={{ height: "600px" }}>
                  <Bar data={data} options={options} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
