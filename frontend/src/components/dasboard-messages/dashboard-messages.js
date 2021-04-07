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
  const [openedRows, setOpenedRows] = useState([]);

  const notMobile = document.documentElement.clientWidth >= 640;

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
    // open message details
    if (openedRows.includes(row.id)) {
      setOpenedRows((oldRows) => {
        let newRows = [...oldRows];
        let index = newRows.indexOf(row.id);
        if (index !== -1) {
          oldRows.splice(index, 1);
        }
        return newRows;
      });
    } else {
      setOpenedRows((oldRows) => {
        const newRows = [...oldRows];
        newRows.push(row.id);
        return newRows;
      });
    }

    // update is_read status on backend
    if (row.is_read) return;
    authFetch(`/api/registered_tag/messages/${row.id}`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error("We could not authorize your request. Try log in to the system and try again");
        return res.json();
      })
      .then((res) => {
        if (res.message) return;
        setTableData((state) => {
          const list = state.map((item) => {
            if (item.id === res.id) {
              return res;
            } else {
              return item;
            }
          });

          return list;
        });
      })
      .catch((e) => {
        alert(e.message);
        logout();
      });
  };

  const indexOfLastRow = currentPage * rowPerPage;
  const indexOfFirstRow = indexOfLastRow - rowPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

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
          {currentRows.length === 0 && (
            <span className='table__row' style={{ textAlign: "center" }}>
              No new messages...
            </span>
          )}
          {currentRows &&
            currentRows.map((row) => (
              <>
                <li key={row.id} className='table__row table__row--msg' onClick={() => handleOnClick(row)}>
                  <span className='table__item-tag'>{row.tag}</span>
                  <span
                    className={row.is_read ? "table__item-message" : "table__item-message table__item-message--unread"}
                    style={{
                      fontWeight: row.is_read ? "" : "bold",
                    }}>{`${row.is_read ? "" : "NEW MESSAGE - "} ${row.text}`}</span>
                  <span className='table__item-date'>{row.date}</span>
                </li>
                {openedRows.includes(row.id) && (
                  <div
                    className='table__row table__row--inner'
                    style={{
                      boxShadow: openedRows.includes(row.id) ? "none" : "0px -1px 0px #dfdfdf, 0px 1px 0px #dfdfdf;",
                    }}>
                    {notMobile && <div className='table__item-tag table__item-tag--title'></div>}
                    <div className='table__item-message'>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span>
                          <strong>From</strong>: {row.name}
                        </span>
                        <span>
                          <a
                            className='analytics__link'
                            rel='noreferrer'
                            target='_blank'
                            href={`https://www.google.com/maps/search/?api=1&query=${row.lat},${row.lon}`}
                            style={{ textDecoration: "underline" }}>
                            Location
                          </a>
                        </span>
                      </div>
                      <div>
                        <strong>Tel</strong>: <a href={`tel:${row.phone_number}`}>{row.phone_number}</a>
                      </div>
                      <div className='table__item-inner'>
                        <strong>Message</strong>: <br /> {row.text}
                      </div>
                    </div>
                    {notMobile && <div className='table__item-date'></div>}
                  </div>
                )}
              </>
            ))}
        </ul>

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
