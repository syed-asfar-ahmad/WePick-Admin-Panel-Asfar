import React, { Component } from "react";
import Chart from "react-apexcharts";
// import '../../App.scss';

import "../../assets/css/dashboard.scss";

class RadialBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      options: {
        labels: ["Users", "Service Provider"],

        stroke: {
          curve: "smooth",
          lineCap: "round",
        },

        chart: {
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 1500,
            animateGradually: {
              enabled: true,
              delay: 500,
            },
            dynamicAnimation: {
              enabled: true,
              speed: 250,
            },
          },
        },

        // for center circle
        plotOptions: {
          radialBar: {
            size: undefined,
            inverseOrder: false,
            startAngle: 0,
            endAngle: 365,
            offsetX: 0,
            offsetY: 0,
            hollow: {
              margin: 5,
              size: "35%",
              background: "transparent",
              image: undefined,
              imageWidth: 150,
              imageHeight: 150,
              imageOffsetX: 0,
              imageOffsetY: 0,
              imageClipped: true,
              position: "front",
              dropShadow: {
                enabled: false,
                top: 0,
                left: 0,
                blur: 3,
                opacity: 0.5,
              },
            },

            stroke: {
              curve: "smooth",
              lineCap: "round",
            },

            // for background lines

            track: {
              show: true,
              startAngle: undefined,
              endAngle: undefined,
              background: "#f2f2f2",
              strokeWidth: "97%",
              opacity: 1,
              margin: 5,
              dropShadow: {
                enabled: false,
                top: 0,
                left: 0,
                blur: 3,
                opacity: 0.5,
              },
            },

            // for centeral text
            dataLabels: {
              show: true,
              name: {
                show: true,
                fontSize: "22px",
                fontFamily: undefined,
                color: undefined,
                offsetY: -6,
              },

              // this is for total
              value: {
                show: true,
                fontSize: "12px",
                fontFamily: undefined,
                color: "#8C8C8C",
                offsetY: -8,
                formatter: function (val) {
                  return val + "%";
                },
              },
              total: {
                show: true,
                label: "Total",
                color: "#8C8C8C",
                fontSize: "12px",
                formatter: function (w) {
                  return (
                    w.globals.seriesTotals.reduce((a, b) => {
                      return a + b;
                    }, 0) /
                      w.globals.series.length +
                    "%"
                  );
                },
              },
            },
          },
        },
      },

      series: [80, 85],
    };
  }

  render() {
    return (
      <div className="donut">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="radialBar"
          width="145%"
        />
      </div>
    );
  }
}

export default RadialBar;
