import React, { useState, useEffect } from "react";
import { authFetch } from "../../services";

import TableRows from "../table-rows";
import TablePagination from "../table-pagination";

import "./dashboard-table.css";

export default function DashboardTable() {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(8);
  const [filter, setFilter] = useState("");

  // Populate table with authFetch for current user
  useEffect(() => {
    const fetchTableData = () => {
      setLoading(true);
      return authFetch(`/api/registered_tags/details`).then((response) => {
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
      setFilteredData(results);
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

  // Get current posts
  const indexOfLastRow = currentPage * rowPerPage;
  const indexOfFirstRow = indexOfLastRow - rowPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow)

  return (
    <div className='dashboard__inner'>
      <div className='dashboard__box'>
        <button className='burger-btn'>Burger Button</button>
        <span className='title dashboard__title'>Dashboard</span>
      </div>

      <form className='dashboard__search'>
        <input
          className='input dashboard__input'
          type='text'
          placeholder='Search by tag ID, name'
          value={filter}
          onChange={handleFilter}
        />
        <button className='button dashboard__btn'>Add New Tag</button>
      </form>

      <div class='table'>
        <div class='table__header'>
          <div class='table__item-img'></div>
          <div class='table__item-tag table__item-tag--title'>tag id</div>
          <div class='table__item-name'>item name</div>
          <div class='table__item-email'>email</div>
          <div class='table__item-number'>number</div>
          <div class='table__item-address'>address</div>
          <div class='table__item-state table__item-state--title'>state</div>
          <div class='table__item-actions'>actions</div>
        </div>

        <TableRows rows={currentRows} loading={loading} />
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

// import React from "react";
// import { ReactTabulator } from "react-tabulator";

// import TagForm from '../tag-form';

// import "react-tabulator/lib/styles.css";
// import 'react-tabulator/lib/css/tabulator.min.css'; // theme

// export default function DashboardTable() {

//   let printIcon = function(cell, formatterParams, onRendered) {
//     return {"<div><button>CLICK ME</button><button>CLICK ME</button><button>CLICK ME</button><button>CLICK ME</button></div>"};
//   }

//   const columns = [
//     { title: "Name", field: "name", width: 150 },
//     { title: "Age", field: "age", hozAlign: "left", formatter: "progress" },
//     { title: "Favourite Color", field: "col" },
//     { title: "Date Of Birth", field: "dob", hozAlign: "center" },
//     { title: "Rating", field: "rating", hozAlign: "center", formatter: "star" },
//     { title: "Passed?", field: "passed", hozAlign: "center", formatter: "tickCross" },
//     { title: "Actions", formatter: printIcon, cellClick: function(e, cell) {alert("Printing")}}
//   ];

//   var data = [
//     { id: 1, name: "Oli Bob", age: "12", col: "red", dob: "",  },
//     { id: 2, name: "Mary May", age: "1", col: "blue", dob: "14/05/1982" },
//     { id: 3, name: "Christine Lobowski", age: "42", col: "green", dob: "22/05/1982" },
//     { id: 4, name: "Brendon Philips", age: "125", col: "orange", dob: "01/08/1980" },
//     { id: 5, name: "Margret Marmajuke", age: "16", col: "yellow", dob: "31/01/1999" },
//   ];

//   return (<ReactTabulator data={data} columns={columns} tooltips={true} layout={"fitData"} />);
// }
