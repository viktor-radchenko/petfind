import React from 'react';
import { Link } from "react-router-dom";


import './dashboard-sidebar.css';
import logo from "../../images/logo-noword.png";


export default function DashboardSidebar() {
  return (
    <div className='dashboard__nav'>
        <Link className='logo-noword' to='/'>
          <img src={logo} alt='logotype' />
        </Link>

        <ul className='dashboard__tabs'>
          <li className='dashboard__tab dashboard__tab--dashboard dashboard__tab--active'>Dashboard</li>
          <li className='dashboard__tab dashboard__tab--analytics'>Analytics</li>
          <li className='dashboard__tab dashboard__tab--account'>Account Settings </li>
        </ul>

        <div className='dashboard__username'>
          <div className='dashboard__profile'>
            <div className='dashboard__avatar'>
              <span>RJ</span>
            </div>
            <div className='dashboard__info'>
              <span className='dashboard__name'>Riya Jain</span>
              <span className='dashboard__email'>hi@riyaja.in</span>
            </div>
          </div>
          <button className='dashboard__logout'>Logout</button>
        </div>
      </div>
  )
}
