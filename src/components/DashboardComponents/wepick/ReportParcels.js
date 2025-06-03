import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import "./ReportParcels.scss";

const mockParcelReports = [
  {
    key: 1,
    parcelId: "#ELEC23456",
    trackingId: "#H1234567812",
    from: "Sheffield",
    destination: "Manchester",
    dateTime: "11Sep, 2025 at 5:00pm",
    weight: "2.40 KG",
    status: "In Transit",
  },
  {
    key: 2,
    parcelId: "#ELEC23457",
    trackingId: "#H1234567813",
    from: "London",
    destination: "Birmingham",
    dateTime: "12Sep, 2025 at 3:00pm",
    weight: "1.80 KG",
    status: "Failed",
  },
  {
    key: 3,
    parcelId: "#ELEC23458",
    trackingId: "#H1234567814",
    from: "Leeds",
    destination: "Liverpool",
    dateTime: "13Sep, 2025 at 1:00pm",
    weight: "3.10 KG",
    status: "In Transit",
  },
  {
    key: 4,
    parcelId: "#ELEC23459",
    trackingId: "#H1234567815",
    from: "Bristol",
    destination: "Nottingham",
    dateTime: "14Sep, 2025 at 11:00am",
    weight: "2.00 KG",
    status: "Failed",
  },
  {
    key: 5,
    parcelId: "#ELEC23460",
    trackingId: "#H1234567816",
    from: "Oxford",
    destination: "Cambridge",
    dateTime: "15Sep, 2025 at 9:00am",
    weight: "2.50 KG",
    status: "In Transit",
  },
  {
    key: 6,
    parcelId: "#ELEC23461",
    trackingId: "#H1234567817",
    from: "Brighton",
    destination: "Southampton",
    dateTime: "16Sep, 2025 at 7:00pm",
    weight: "1.60 KG",
    status: "Failed",
  },
  {
    key: 7,
    parcelId: "#ELEC23462",
    trackingId: "#H1234567818",
    from: "York",
    destination: "Durham",
    dateTime: "17Sep, 2025 at 2:00pm",
    weight: "2.90 KG",
    status: "In Transit",
  },
  {
    key: 8,
    parcelId: "#ELEC23463",
    trackingId: "#H1234567819",
    from: "Bath",
    destination: "Exeter",
    dateTime: "18Sep, 2025 at 4:00pm",
    weight: "2.10 KG",
    status: "Failed",
  },
  {
    key: 9,
    parcelId: "#ELEC23464",
    trackingId: "#H1234567820",
    from: "Cardiff",
    destination: "Swansea",
    dateTime: "19Sep, 2025 at 6:00pm",
    weight: "2.70 KG",
    status: "In Transit",
  },
  {
    key: 10,
    parcelId: "#ELEC23465",
    trackingId: "#H1234567821",
    from: "Newcastle",
    destination: "Sunderland",
    dateTime: "20Sep, 2025 at 8:00pm",
    weight: "2.30 KG",
    status: "Failed",
  },
  {
    key: 11,
    parcelId: "#ELEC23466",
    trackingId: "#H1234567822",
    from: "Edinburgh",
    destination: "Glasgow",
    dateTime: "21Sep, 2025 at 10:00am",
    weight: "2.80 KG",
    status: "In Transit",
  },
  {
    key: 12,
    parcelId: "#ELEC23467",
    trackingId: "#H1234567823",
    from: "Aberdeen",
    destination: "Inverness",
    dateTime: "22Sep, 2025 at 11:30am",
    weight: "1.90 KG",
    status: "Failed",
  },
  {
    key: 13,
    parcelId: "#ELEC23468",
    trackingId: "#H1234567824",
    from: "Dundee",
    destination: "Perth",
    dateTime: "23Sep, 2025 at 2:15pm",
    weight: "2.20 KG",
    status: "In Transit",
  },
  {
    key: 14,
    parcelId: "#ELEC23469",
    trackingId: "#H1234567825",
    from: "Stirling",
    destination: "Falkirk",
    dateTime: "24Sep, 2025 at 3:45pm",
    weight: "1.70 KG",
    status: "Failed",
  },
  {
    key: 15,
    parcelId: "#ELEC23470",
    trackingId: "#H1234567826",
    from: "Dunfermline",
    destination: "Kirkcaldy",
    dateTime: "25Sep, 2025 at 4:30pm",
    weight: "2.60 KG",
    status: "In Transit",
  },
  {
    key: 16,
    parcelId: "#ELEC23471",
    trackingId: "#H1234567827",
    from: "Livingston",
    destination: "Motherwell",
    dateTime: "26Sep, 2025 at 5:20pm",
    weight: "2.10 KG",
    status: "Failed",
  },
  {
    key: 17,
    parcelId: "#ELEC23472",
    trackingId: "#H1234567828",
    from: "Hamilton",
    destination: "East Kilbride",
    dateTime: "27Sep, 2025 at 6:10pm",
    weight: "2.40 KG",
    status: "In Transit",
  },
  {
    key: 18,
    parcelId: "#ELEC23473",
    trackingId: "#H1234567829",
    from: "Paisley",
    destination: "Greenock",
    dateTime: "28Sep, 2025 at 7:00pm",
    weight: "1.80 KG",
    status: "Failed",
  },
  {
    key: 19,
    parcelId: "#ELEC23474",
    trackingId: "#H1234567830",
    from: "Ayr",
    destination: "Kilmarnock",
    dateTime: "29Sep, 2025 at 8:30pm",
    weight: "2.30 KG",
    status: "In Transit",
  },
  {
    key: 20,
    parcelId: "#ELEC23475",
    trackingId: "#H1234567831",
    from: "Dumfries",
    destination: "Stranraer",
    dateTime: "30Sep, 2025 at 9:15pm",
    weight: "2.50 KG",
    status: "Failed",
  },
  {
    key: 21,
    parcelId: "#ELEC23476",
    trackingId: "#H1234567832",
    from: "Galashiels",
    destination: "Hawick",
    dateTime: "1Oct, 2025 at 10:45am",
    weight: "1.90 KG",
    status: "In Transit",
  },
  {
    key: 22,
    parcelId: "#ELEC23477",
    trackingId: "#H1234567833",
    from: "Selkirk",
    destination: "Jedburgh",
    dateTime: "2Oct, 2025 at 11:30am",
    weight: "2.20 KG",
    status: "Failed",
  },
  {
    key: 23,
    parcelId: "#ELEC23478",
    trackingId: "#H1234567834",
    from: "Kelso",
    destination: "Coldstream",
    dateTime: "3Oct, 2025 at 1:15pm",
    weight: "2.70 KG",
    status: "In Transit",
  },
  {
    key: 24,
    parcelId: "#ELEC23479",
    trackingId: "#H1234567835",
    from: "Berwick",
    destination: "Eyemouth",
    dateTime: "4Oct, 2025 at 2:45pm",
    weight: "2.00 KG",
    status: "Failed",
  },
  {
    key: 25,
    parcelId: "#ELEC23480",
    trackingId: "#H1234567836",
    from: "Duns",
    destination: "Lauder",
    dateTime: "5Oct, 2025 at 3:30pm",
    weight: "2.40 KG",
    status: "In Transit",
  },
  {
    key: 26,
    parcelId: "#ELEC23481",
    trackingId: "#H1234567837",
    from: "Haddington",
    destination: "North Berwick",
    dateTime: "6Oct, 2025 at 4:20pm",
    weight: "1.70 KG",
    status: "Failed",
  },
  {
    key: 27,
    parcelId: "#ELEC23482",
    trackingId: "#H1234567838",
    from: "Dunbar",
    destination: "Musselburgh",
    dateTime: "7Oct, 2025 at 5:10pm",
    weight: "2.30 KG",
    status: "In Transit",
  },
  {
    key: 28,
    parcelId: "#ELEC23483",
    trackingId: "#H1234567839",
    from: "Penicuik",
    destination: "Bonnyrigg",
    dateTime: "8Oct, 2025 at 6:00pm",
    weight: "2.60 KG",
    status: "Failed",
  },
  {
    key: 29,
    parcelId: "#ELEC23484",
    trackingId: "#H1234567840",
    from: "Dalkeith",
    destination: "Gorebridge",
    dateTime: "9Oct, 2025 at 7:30pm",
    weight: "2.10 KG",
    status: "In Transit",
  },
  {
    key: 30,
    parcelId: "#ELEC23485",
    trackingId: "#H1234567841",
    from: "Tranent",
    destination: "Prestonpans",
    dateTime: "10Oct, 2025 at 8:15pm",
    weight: "2.40 KG",
    status: "Failed",
  }
];

const statusStyles = {
  "In Transit": {
    color: "#1BC949",
    background: "#E6F9F0",
  },
  "Failed": {
    color: "#FF4D4F",
    background: "#FFEAEA",
  },
};

const ReportParcels = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Replace with API call if needed
    setReports(mockParcelReports);
  }, []);

  const columns = [
    {
      title: "Parcel ID",
      dataIndex: "parcelId",
      key: "parcelId",
    },
    {
      title: "Tracking ID",
      dataIndex: "trackingId",
      key: "trackingId",
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "Destination",
      dataIndex: "destination",
      key: "destination",
    },
    {
      title: "Date/Time",
      dataIndex: "dateTime",
      key: "dateTime",
    },
    {
      title: "Weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const style = statusStyles[status] || statusStyles["In Transit"];
        return (
          <Tag
            style={{
              color: style.color,
              background: style.background,
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 13,
              padding: "2px 14px 2px 8px",
              border: "none",
            }}
          >
            {status}
          </Tag>
        );
      },
    },
  ];

  return (
    <div className="row px-4 pt-3 my-2">
      <div className="col-12 d-flex justify-content-between align-items-center">
        <p className="mt-2 appoinment-text" style={{ fontWeight: 600, fontSize: 18 }}>
          Report Detail
        </p>
      </div>
      <div className="col-12 mt-3">
        <Table
          columns={columns}
          dataSource={reports}
          pagination={{
            position: ['bottomRight'],
            pageSize: 10,
            showSizeChanger: false,
            style: {
              marginRight: '16px',
              marginBottom: '16px'
            }
          }}
          bordered
          style={{ background: "#fff", borderRadius: 16 }}
          className="custom-pagination"
        />
      </div>
    </div>
  );
};

export default ReportParcels; 