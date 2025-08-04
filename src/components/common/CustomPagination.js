import React from "react";

const CustomPagination = ({ page, totalPages, onChangePage }) => {
  const handlePrev = () => {
    onChangePage(Math.max(page - 1, 0));
  };

  const handleNext = () => {
    onChangePage(Math.min(page + 1, totalPages ));
  };

  const handleClick = (newPage) => {
    if (newPage >= 0 && newPage <= totalPages) {
      onChangePage(newPage);
    }
  };

  const getPageButtons = () => {
    const pageButtons = [];
    const maxPagesToShow = 3;
    // Show at most maxPagesToShow page buttons, centered around the current page
    const startPage = Math.max(page - Math.floor(maxPagesToShow / 2), 1);
    const endPage = Math.min(startPage + maxPagesToShow, totalPages);

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() =>{
           
            handleClick(i)}}
          className={i  === page ? "active" : ""}
        >
          {i }
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="custom-pagination">
      <button
        className="prev-button"
        onClick={handlePrev}
        disabled={page === 1}
      >
        Prev
      </button>
      {getPageButtons()}

      <button
        className="next-button"
        onClick={handleNext}
        disabled={page === totalPages }
      >
        Next
      </button>
    </div>
  );
};

export default CustomPagination;
