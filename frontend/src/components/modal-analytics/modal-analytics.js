import React, { useState, useEffect } from "react";
import { authFetch } from "../../services";
import TablePagination from "../table-pagination";

import "./modal-analytics.css";

export default function ModalAnalytics({ data }) {
  const [searches, setSearches] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerPage] = useState(8);

  // Get current posts
  const indexOfLastRow = currentPage * rowPerPage;
  const indexOfFirstRow = indexOfLastRow - rowPerPage;
  const currentRows = searches.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (page) => {
    setCurrentPage(page);
  };

  const previousPage = () => {
    if (currentPage - 1 <= 0) return;
    setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage + 1 > Math.ceil(searches.length / rowPerPage)) return;
    setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    authFetch(`/api/registered_tag/search_history/${data.tag_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Could not identify tag ID. Please try again");
        return res.json();
      })
      .then((res) => {
        setSearches(res);
      });
  }, [data.tag_id]);

  return (
    <>
      <div className='analytics'>
        <div className='analytics__header'>
          <span className='table__item-tag delete-tag__tag'>{data.tag_id}</span> - {data.tag_name}
        </div>
        <div className='analytics__table'>
          <div className='analytics__table-header'>
            <div className='cell analytics__date'>Date</div>
            <div className='cell analytics__city'>City</div>
            <div className='cell analytics__zip'>Zip</div>
            <div className='cell analytics__ip'>IP</div>
            {/* <div className='cell analytics__coord'>Lat/Lon</div> */}
            <div className='cell analytics__map'>Map</div>
          </div>

          <ul className='analytics__table-rows'>
            {currentRows.length > 1 ? (
              currentRows.map((row, index) => (
                <li key={`row${index}`} className='analytics__table-row'>
                  <div className='cell analytics__date'>{row.date}</div>
                  <div className='cell analytics__city'>{row.city}</div>
                  <div className='cell analytics__zip'>{row.zip_code}</div>
                  <div className='cell analytics__ip'>{row.ip_address}</div>
                  {/* <div className='cell analytics__coord'>{`${row.lat}/${row.lon}`}</div> */}
                  <div className='cell analytics__map'>
                    <a
                      rel='noreferrer'
                      target='_blank'
                      href={`https://www.google.com/maps/search/?api=1&query=${row.lat},${row.lon}`}
                      className='analytics__link'>
                      map
                    </a>
                  </div>
                </li>
              ))
            ) : (
              <div className='analytics__table-row'>No searches results yet</div>
            )}
          </ul>

          <TablePagination
            rowPerPage={rowPerPage}
            totalRows={searches.length}
            paginate={paginate}
            currentPage={currentPage}
            previousPage={previousPage}
            nextPage={nextPage}
          />
        </div>
      </div>
    </>
  );
}
