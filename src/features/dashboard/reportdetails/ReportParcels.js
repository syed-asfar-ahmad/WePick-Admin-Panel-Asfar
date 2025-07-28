import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import "./ReportParcels.scss";
import Loading from '../../../components/common/Loading';
import { getAdminDashboard } from '../../../services/wepickApi';

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
  const [loadershown, setLoaderShown] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getAdminDashboard()
      .then(response => {
        setReports(response?.data?.reportDetails || []);
        setIsLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch data');
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaderShown(false);
    }, 1500);
    return () => clearTimeout(timer);
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
      {loadershown || isLoading ? (
        <Loading />
      ) : error ? (
        <div style={{ color: 'red', padding: 20 }}>{error}</div>
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