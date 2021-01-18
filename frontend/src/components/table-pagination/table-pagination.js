import React from "react";

export default function TablePagination({ rowPerPage, totalRows, paginate, currentPage, previousPage, nextPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalRows / rowPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='table__footer'>
      <div className='pagination'>
        <button className='pagination__arrow pagination__arrow--left' onClick={() => previousPage()}></button>
        <ul className='pagination__list'>
          {pageNumbers.map((page) => (
            <li key={page} className='pagination__item'>
              <span
                onClick={() => paginate(page)}
                className={page === currentPage ? "pagination__link pagination__link--active" : "pagination__link"}>
                {page}
              </span>
            </li>
          ))}
        </ul>
        <button className='pagination__arrow pagination__arrow--right' onClick={() => nextPage()}></button>
      </div>
    </div>
  );
}
