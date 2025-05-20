import React from "react";

const CustomPagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="d-flex justify-content-between align-items-center my-3">
      {totalItems === 0 ? (<span>
        Showing 0 out of {totalItems}
      </span>) : (<span>
        Showing {startItem} - {endItem} out of {totalItems}
      </span>)}

      <ul className="pagination mb-0">
        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
          <button className="page-link" onClick={handlePrevClick}>
            Prev
          </button>
        </li>
        {[...Array(totalPages)?.keys()]?.map((_, index) => (
          <li
            key={index + 1}
            className={`page-item ${currentPage === index + 1 ? "active bg-dark" : ""
              }`}
          >
            <button
              className="page-link"
              onClick={() => onPageChange(index + 1)}
            >
              {index + 1}
            </button>
          </li>
        ))}
        <li
          className={`page-item ${currentPage === totalPages ? "disabled" : ""
            }`}
        >
          <button className="page-link" onClick={handleNextClick}>
            Next
          </button>
        </li>
      </ul>
    </div>
  );
};

export default CustomPagination;
