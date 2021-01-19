import React, { useState, useEffect, useReducer } from "react";
import { authFetch } from "../../services";

import TableRows from "../table-rows";
import TablePagination from "../table-pagination";

import "./dashboard-table.css";
import imagePlaceholder from "../../images/icons/add-photo.svg";


const initialFormState = {
  tagId: "",
  tagName: "",
  tagImage: null,
  phone: "",
  email: "",
  address: "",
  city: "",
  country: "",
  zipCode: "",
  userState: "",
};

function reducer(state, { field, value }) {
  return {
    ...state,
    [field]: value,
  };
}

export default function DashboardTable() {
  // const [state, dispatch] = useReducer(reducer, initialState);
  const [tableData, setTableData] = useState([]);
  const [filter, setFilter] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowPerPage, setRowPerPage] = useState(8);

  const [state, dispatch] = useReducer(reducer, initialFormState);

  const {tagId, tagName, tagImage, phone, email, address, city, country, zipCode, userState} = state;


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


  useEffect(() => {
    if (editRow) {

    }
  })


  // Modal form input handler
  const onChange = (e) => {
    dispatch({
      field: e.target.name,
      value: e.target.value,
    });
  };

  // Modal form file handler
  const onFileChange = (e) => {
    dispatch({
      field: e.target.name,
      value: e.target.files[0],
    });
  };

  const toggleEditModal = () => {
    setEditModalVisible(prevstate => !prevstate);
  }

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
        <input
          className='input dashboard__input'
          type='text'
          placeholder='Search by tag ID, name'
          value={filter}
          onChange={handleFilter}
        />
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

        <TableRows rows={currentRows} loading={loading} handleUpdate={handleUpdate} toggleEditModal={toggleEditModal}/>
        <TablePagination
          rowPerPage={rowPerPage}
          totalRows={filteredData.length}
          paginate={paginate}
          currentPage={currentPage}
          previousPage={previousPage}
          nextPage={nextPage}
        />
      </div>

      {editModalVisible && <div className='modal'>
        <div className='modal__inner'>
          <div className='modal__header'>
            <span className='title title--modal'>Edit Tag</span>

            <button className='close'>close</button>
          </div>

          <div className='edit-tag__switch'>Item Details</div>

          <div className='modal__content'>
            <div className='register-item__box'>
              <div className='register-item__img'>
                <span>Add an Image</span>
                <img src={tagImage ? URL.createObjectURL(tagImage) : imagePlaceholder} alt='img' />
              </div>

              <label className='register-item__label'>
                <input
                  className='register-item__file'
                  type='file'
                  accept='image/*'
                  name='tagImage'
                  onChange={onFileChange}
                />
                <span className='register-item__upload'>Upload image</span>
                <span className='register-item__max'>max file size 2mb</span>
              </label>
            </div>
          </div>

          <label className='label edit-tag__label'>
            <span>Name</span>
            <input
              className='input edit-tag__input edit-tag__input--name'
              type='text'
              name='tagName'
              value={tagName}
              onChange={onChange}
            />
          </label>
        </div>

        <div className='edit-tag__switch edit-tag__switch--active'>Address Details</div>

        <div className='modal__content'>
          <div className='edit-tag__location'>
            <label className='label'>
              <span>Address</span>
              <input
                className='input edit-tag__input edit-tag__input--address'
                type='text'
                name='address'
                value={address}
                onChange={onChange}
              />
            </label>

            <label className='label'>
              <span>City</span>
              <input className='select edit-tag__input' type='text' name='city' value={city} onChange={onChange} />
            </label>

            <label className='label'>
              <span>State</span>
              <input
                className='select edit-tag__input'
                type='text'
                name='userState'
                value={userState}
                onChange={onChange}
              />
            </label>

            <label className='label'>
              <span>Country</span>
              <input
                className='select edit-tag__input'
                type='text'
                name='country'
                value={country}
                onChange={onChange}
              />
            </label>

            <label className='label'>
              <span>ZIP code</span>
              <select
                className='select edit-tag__input'
                type='text'
                name='zipCode'
                value={zipCode}
                onChange={onChange}
              />
            </label>

            <label className='label edit-tag__label'>
              <span>Phone Number</span>
              <input className='input edit-tag__input' type='tel' name='phone' value={phone} onChange={onChange} />
            </label>

            <label className='label edit-tag__label'>
              <span>Email Address</span>
              <input className='input edit-tag__input' type='email' name='email' value={email} onChange={onChange} />
            </label>
          </div>
        </div>

        <div className='modal__footer'>
          <button className='button' type='submit'>
            Update
          </button>
        </div>
      </div>}
    </div>
  );
}
