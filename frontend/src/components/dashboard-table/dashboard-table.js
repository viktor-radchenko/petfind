import React, { useState, useEffect } from "react";
import { authFetch } from "../../services";

import TableRows from "../table-rows";
import TablePagination from "../table-pagination";

import "./dashboard-table.css";

export default function DashboardTable() {
  // const [state, dispatch] = useReducer(reducer, initialState);
  const [tableData, setTableData] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(8);

  // Populate table with authFetch for current user
  useEffect(() => {
    const fetchTableData = () => {
      setLoading(true);
      return authFetch(`/api/registered_tag/details`).then((response) => {
        if (response.status === 401) {
          console.log("Sorry you aren't authorized!");
          return null;
        }
        setLoading(false);
        return response.json();
      });
    };
    fetchTableData().then((res) => setTableData(res));
  }, []);

  useEffect(() => {
    if (tableData.length > 1) {
      const results = tableData.filter(
        (tag) => tag.tag_name.toLowerCase().includes(filter) || tag.tag_id.toLowerCase().includes(filter)
      );
      if (results.length > 0) setFilteredData(results);
    } else {
      setFilteredData(tableData);
    }
  }, [filter, tableData]);

  const paginate = (page) => {
    setCurrentPage(page);
  };

  const previousPage = () => {
    if (currentPage - 1 <= 0) return;
    setCurrentPage(currentPage - 1);
  };

  const nextPage = () => {
    if (currentPage + 1 > Math.ceil(filteredData.length / rowPerPage)) return;
    setCurrentPage(currentPage + 1);
  };

  const handleFilter = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const handleClearFilter = () => {
    setFilter("");
  }

  const handleUpdate = (row) => {
    setTableData(
      tableData.map((tableRow) => {
        return tableRow.tag_id === row.tag_id ? row : tableRow;
      })
    );
  };

  // Get current posts
  const indexOfLastRow = currentPage * rowPerPage;
  const indexOfFirstRow = indexOfLastRow - rowPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <div className='dashboard__inner'>
      <div className='dashboard__box'>
        <button className='burger-btn'>Burger Button</button>
        <span className='title dashboard__title'>Dashboard</span>
      </div>

      <form className='dashboard__search'>
        <div class='dashboard__form'>
          <input
            className='input dashboard__input'
            type='text'
            placeholder='Search by tag ID, name'
            value={filter}
            onChange={handleFilter}
          />
          {filter && <button onClick={handleClearFilter} class='dashboard__input--clear' type='button'>
            clear
          </button>}
        </div>
        <button className='button dashboard__btn'>Add New Tag</button>
      </form>

      <div className='table'>
        <div className='table__header'>
          <div className='table__item-img'></div>
          <div className='table__item-tag table__item-tag--title'>tag id</div>
          <div className='table__item-name'>item name</div>
          <div className='table__item-email'>email</div>
          <div className='table__item-number'>number</div>
          <div className='table__item-address'>address</div>
          <div className='table__item-state table__item-state--title'>state</div>
          <div className='table__item-actions'>actions</div>
        </div>

        <TableRows rows={currentRows} loading={loading} handleUpdate={handleUpdate} />
        <TablePagination
          rowPerPage={rowPerPage}
          totalRows={filteredData.length}
          paginate={paginate}
          currentPage={currentPage}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      </div>
    </div>
  );
}