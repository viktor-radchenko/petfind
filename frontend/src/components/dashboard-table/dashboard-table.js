import React, { useState, useEffect, useRef } from "react";
import { authFetch, logout } from "../../services";

import ModalWrapper from "../modal-wrapper";
import ModalAddTag from "../modal-add-tag";

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
  const [rowPerPage] = useState(8);

  const addModalTag = useRef(null);

  // Populate table with authFetch for current user
  useEffect(() => {
    setLoading(true);

    authFetch(`/api/registered_tag/details`)
      .then((res) => {
        if (!res.ok) throw new Error("We could not authorize your request. Try log in to the system and try again");
        return res.json();
      })
      .then((res) => {
        if (res.message) return;
        setTableData(res);
      })
      .catch((e) => {
        alert(e.message);
        logout();
      });
    setLoading(false);
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
  };

  const handleUpdate = (row) => {
    setTableData(
      tableData.map((tableRow) => {
        return tableRow.tag_id === row.tag_id ? row : tableRow;
      })
    );
  };

  const handleNewTag = (row) => {
    addModalTag.current.close();
    setTableData([...tableData, row]);
  };

  const handleAddModalTag = (e) => {
    e.preventDefault();
    addModalTag.current.open();
  };

  // Get current posts
  const indexOfLastRow = currentPage * rowPerPage;
  const indexOfFirstRow = indexOfLastRow - rowPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  return (
    <>
      <form className='dashboard__search'>
        <div className='dashboard__form'>
          <input
            className='input dashboard__input'
            type='text'
            placeholder='Search by tag ID, name'
            value={filter}
            onChange={handleFilter}
          />
          {filter && (
            <button onClick={handleClearFilter} className='dashboard__input--clear' type='button'>
              clear
            </button>
          )}
        </div>
        <button className='button dashboard__btn' onClick={(e) => handleAddModalTag(e)}>
          Add New Tag
        </button>
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
      <ModalWrapper header={"Add New Tag"} ref={addModalTag}>
        <ModalAddTag handleNewTag={handleNewTag} />
      </ModalWrapper>
    </>
  );
}
