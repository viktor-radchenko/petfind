import React, { useState, useEffect } from "react";
import TablePagination from "../table-pagination";
import { authFetch, logout } from "../../services";

function DashboarMessages() {
  const [tableData, setTableData] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerPage] = useState(8);

  useEffect(() => {
    setLoading(true);

    authFetch(`/api/registered_tag/messages`)
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
        (tag) => tag.name.toLowerCase().includes(filter) || tag.id.toLowerCase().includes(filter)
      );
      if (results.length > 0) setFilteredData(results.reverse());
    } else {
      setFilteredData(tableData.reverse());
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

  const handleOnClick = (row) => {
    if (row.is_read) return;
    authFetch(`/api/registered_tag/messages/${row.id}`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error("We could not authorize your request. Try log in to the system and try again");
        return res.json();
      })
      .then((res) => {
        if (res.message) return;
        const newData = [...tableData];
        const index = tableData.indexOf(res.id);
        newData[index] = res;
        setTableData(newData);
      })
      .catch((e) => {
        alert(e.message);
        logout();
      });
  };

  const indexOfLastRow = currentPage * rowPerPage;
  const indexOfFirstRow = indexOfLastRow - rowPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  console.log(tableData);

  return (
    <>
      <form className='dashboard__search'>
        <div className='dashboard__form'>
          <input className='input dashboard__input' type='text' placeholder='' value={filter} onChange={handleFilter} />
          {filter && (
            <button onClick={handleClearFilter} className='dashboard__input--clear' type='button'>
              clear
            </button>
          )}
        </div>
      </form>

      <div className='table'>
        <div className='table__header table__header--msg'>
          <div className='table__item-tag table__item-tag--title'>tag id</div>
          <div className='table__item-message'>Message</div>
          <div className='table__item-date'>Date</div>
        </div>
        <ul className='table__rows'>
          {currentRows &&
            currentRows.map((row) => (
              <li key={row.id} className='table__row table__row--msg' onClick={() => handleOnClick(row.id)}>
                <span className='table__item-tag'>{row.tag}</span>
                <span
                  className={row.is_read ? "table__item-message" : "table__item-message table__item-message--unread"}
                  style={{ fontWeight: row.is_read ? "" : "bold" }}>{`${row.name} - ${row.text}`}</span>
                <span className='table__item-date'>{row.date}</span>
              </li>
            ))}
        </ul>

        {/* <TableRows rows={currentRows} loading={loading} handleUpdate={handleUpdate} /> */}
        <TablePagination
          rowPerPage={rowPerPage}
          totalRows={filteredData.length}
          paginate={paginate}
          currentPage={currentPage}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      </div>
    </>
  );
}

export default DashboarMessages;
