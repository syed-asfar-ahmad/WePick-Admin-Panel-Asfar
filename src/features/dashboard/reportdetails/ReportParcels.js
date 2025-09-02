import { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import "./ReportParcels.scss";
import Loading from '../../../components/common/Loading';
import { getAdminDashboard } from '../../../services/wepickApi';

const getStatusColor = (status) => {
  switch(status.toLowerCase()) {
    case 'delivered':
      return '#4CAF50';
    case 'in transit':
      return '#2196F3';
    case 'pending':
      return '#FFC107';
    case 'failed':
      return '#F44336';
    case 'deposit':
      return '#FF9800';
    default:
      return '#757575';
  }
};

const ReportParcels = () => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadershown, setLoaderShown] = useState(true);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReports, setTotalReports] = useState(0);
  const [pageSize] = useState(20);



  // Fetch dashboard data from API
  const fetchDashboardData = async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getAdminDashboard(page);
      
      if (response?.success) {
        const reportsData = response.data?.reportDetails || [];
        setReports(reportsData);
        
        // Update pagination from API response
        setCurrentPage(response.data?.currentPage || page);
        setTotalPages(response.data?.totalPages || 1);
        setTotalReports(response.data?.parcelCount || 0); // Use parcelCount from API for total count
      } else {
        setError('Failed to fetch data');
        setReports([]);
      }
    } catch (err) {
      setError('Failed to fetch data');
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    fetchDashboardData(page);
  };



  useEffect(() => {
    fetchDashboardData();
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
        return (
          <span
            className="status-badge"
            style={{ 
              backgroundColor: getStatusColor(status),
              color: 'white',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              display: 'inline-block'
            }}
          >
            {status}
          </span>
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
            <div className="table-container">
              <Table
                columns={columns}
                dataSource={reports}
                pagination={false}
                bordered
                style={{ background: "#fff", borderRadius: 16 }}
                className="custom-pagination"
              />
            </div>
            
            {/* Custom Server-side Pagination */}
            {reports.length > 0 && totalPages > 1 && (
              <div className="pagination-container">
                <div className="pagination-info">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalReports)} of {totalReports} parcels
                </div>
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn prev-btn"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span>←</span> Previous
                  </button>
                  <div className="page-numbers">
                    {currentPage > 2 && (
                      <button 
                        className="pagination-btn page-btn"
                        onClick={() => handlePageChange(1)}
                      >
                        1
                      </button>
                    )}
                    {currentPage > 3 && <span className="page-dots">...</span>}
                    {currentPage > 1 && (
                      <button 
                        className="pagination-btn page-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        {currentPage - 1}
                      </button>
                    )}
                    <button 
                      className="pagination-btn page-btn active"
                      disabled
                    >
                      {currentPage}
                    </button>
                    {currentPage < totalPages && (
                      <button 
                        className="pagination-btn page-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        {currentPage + 1}
                      </button>
                    )}
                    {currentPage < totalPages - 2 && <span className="page-dots">...</span>}
                    {currentPage < totalPages - 1 && (
                      <button 
                        className="pagination-btn page-btn"
                        onClick={() => handlePageChange(totalPages)}
                      >
                        {totalPages}
                      </button>
                    )}
                  </div>
                  <button 
                    className="pagination-btn next-btn"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Next <span>→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ReportParcels; 