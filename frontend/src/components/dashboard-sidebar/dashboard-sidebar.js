import React, { useState } from "react";
import { Link } from "react-router-dom";
import { logout } from "../../services";

import "./dashboard-sidebar.css";
import logo from "../../images/logo-noword.png";

export default function DashboardSidebar({ active, userData }) {

  const [sidebarVisible, setSidebarVisible] = useState(active);

  const getInitials = (string) => {
    let names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  return (
    <div className={active ? "dashboard__nav dashboard__nav--active" : "dashboard__nav"}>
      <div className='dashboard__nav-box'>
        <Link className='logo-noword' to='/'>
          <img src={logo} alt='logo' />
        </Link>
        <button class='close dashboard__close' onClick={() => setSidebarVisible(!sidebarVisible)}>close</button>
      </div>

      <ul className='dashboard__tabs'>
        <li className='dashboard__tab dashboard__tab--dashboard dashboard__tab--active'>Dashboard</li>
        <li className='dashboard__tab dashboard__tab--analytics'>Analytics</li>
        <li className='dashboard__tab dashboard__tab--account'>Account Settings </li>
      </ul>

      <div className='dashboard__username'>
        <div className='dashboard__profile'>
          <div className='dashboard__avatar'>
            <span>{getInitials(userData.full_name)}</span>
          </div>
          <div className='dashboard__info'>
            <div className='dashboard__name'>{userData.full_name}</div>
            <div className='dashboard__email'>{userData.email}</div>
          </div>
        </div>
        <button className='dashboard__logout' onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}
