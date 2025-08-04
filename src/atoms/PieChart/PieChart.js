import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Pie, measureTextWidth } from '@ant-design/plots';


const PieChart = () => {
  const data = [
    {
      type: 'Hospitals',
      value: 9,
    },
    {
      type: 'Doctors',
      value: 10,
    },
    {
      type: 'Pharmacies',
      value: 11,
    },
    {
      type: 'Medical Equipments',
      value: 20,
    },
    {
      type: 'Laboratories',
      value: 15,
    },
    {
      type: 'X-ray',
      value: 25,
    },
    {
      type: 'Service Providers',
      value: 18,
    },

  ];
  // const config = {
  //   appendPadding: 10,
  //   data,
  //   angleField: 'value',
  //   colorField: 'type',
  //   radius: '0.7',
  //   label: {
  //     type: 'outer',
  //     content: '{percentage}',
  //   },

  //   legend: {
  //       position: "top",
  //       itemFormatter(val) {
  //         return val + " %";
  //       },
  //       marker: {
  //         symbol: 'circle',
  //       },
  //     },
  //   interactions: [
  //     {
  //       type: 'pie-legend-active',
  //     },
  //     {
  //       type: 'element-active',
  //     },
  //   ],
  // };

  const genderTotals = {};

  // Calculate totals for each gender
  data.forEach(item => {
    const { type, value } = item;
    genderTotals[type] = (genderTotals[type] || 0) + value;
  });

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.7,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
        // transform: "rotate(20deg)",
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    legend: false,
    // legend: {
    //   position: "bottom",
    //   marker: {
    //     symbol: 'circle',
    //   },
    // },
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: 'Users',
      },
    },

    color: ({ type }) => {
      if (type === "Hospitals") {
        return "#5588FF";
      }
      if (type === "Laboratories") {
        return "#FFCE00";
      }
      if (type === "Pharmacies") {
        return "#11B3CF";
      }
      if (type === "Medical Equipments") {
        return "#6555C5";
      }
      if (type === "X-ray") {
        return "#A501F4";
      }
      if (type === "Service Providers") {
        return "#BAC94A";
      }
      if (type === "Doctors") {
        return "#35A28F";
      }
    },

  };





  return <>

    <Pie {...config} />

    <div className="col-12 px-3 pb-4">
      <div className="row">
        {Object.keys(genderTotals)?.map((item, index) => {
          return (
            <div className=" flex-nowrap d-flex align-items-center">
              <span className="dot " style={{
                backgroundColor: item === 'Hospitals' ? '#5588FF' :
                  item === "Doctors" ? "#35A28F" :
                    item === "Pharmacies" ? "#11B3CF" :
                      item === "Medical Equipments" ? "#6555C5" :
                        item === "X-ray" ? "#A501F4" :
                          item === "Service Providers" ? "#BAC94A" :
                            item === "Laboratories" ? "#FFCE00" :
                              'black'
              }}></span> <span className="pl-2 pr-4">{item}</span>
            </div>
          )

        })}
      </div>
    </div>

  </>;
};

export default PieChart
