import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import { getPostData } from "../../../services/service";
import "./ReportParcels.scss";
import Loading from '../../../components/common/Loading';

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
  // ... rest of the mock data ...
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setReports(mockParcelReports);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      const response = await getPostData();
      if (response && response.data && response.data.length > 0) {
        setReports(response.data);
      } else {
        setReports(mockParcelReports);
      }
    } catch (error) {
      setReports(mockParcelReports);
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
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
      {isLoading ? (
        <Loading />
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ReportParcels; 