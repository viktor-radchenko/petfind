import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authFetch, logout } from "../../services";

import { useAppContext } from "../app";

import "./dashboard-sidebar.css";
import logo from "../../images/logo.png";

export default function DashboardSidebar({ active, userData, handleTabChange, currentTab, handleSidebarActive }) {
  const [isUnread, setIsUnread] = useState(false);
  const [state] = useAppContext();

  useEffect(() => {
    if (state.messages.length >= 1) {
      const unread = state.messages.filter((message) => (message.is_read ? null : true));
      if (unread.length >= 1) {
        setIsUnread(true);
      } else {
        setIsUnread(false);
      }
    }
  }, [state.messages]);

  const getInitials = (string) => {
    let names = string.split(" "),
      initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  };

  const getToAdmin = () => {
    authFetch("/admin/auth", { credentials: "include" })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "ok") {
          window.location.replace("/admin");
        }
      });
  };

  return (
    <div className={active ? "dashboard__nav dashboard__nav--active" : "dashboard__nav"}>
      <Link className='logo-noword' to='/'>
        <img src={logo} alt='logo' />
      </Link>

      {active && <button className='burger-btn burger-btn--active' onClick={handleSidebarActive}></button>}

      <ul className='dashboard__tabs'>
        <li
          className={
            currentTab === "table"
              ? `dashboard__tab dashboard__tab--dashboard dashboard__tab--active`
              : "dashboard__tab dashboard__tab--dashboard"
          }
          onClick={() => handleTabChange("table")}>
          Dashboard
        </li>
        <li
          className={
            currentTab === "messages"
              ? `dashboard__tab dashboard__tab--analytics dashboard__tab--active ${
                  isUnread ? "dashboard__tab--unread" : ""
                }`
              : `dashboard__tab dashboard__tab--analytics ${isUnread ? "dashboard__tab--unread" : ""}`
          }
          onClick={() => handleTabChange("messages")}>
          Messages
          {/* {isUnread && <span className='dashboard__tab--unread'></span>} */}
        </li>
        <li
          className={
            currentTab === "profile"
              ? `dashboard__tab dashboard__tab--account dashboard__tab--active`
              : "dashboard__tab dashboard__tab--account"
          }
          onClick={() => handleTabChange("profile")}>
          Account Settings
        </li>

        {userData.roles.includes("admin") && (
          <li className='dashboard__tab dashboard__tab--account' onClick={() => getToAdmin()}>
            Admin page
          </li>
        )}
      </ul>

      <div className='dashboard__username'>
        <div className='dashboard__profile'>
          <div className='dashboard__avatar'>
            <span>{getInitials(userData.fullName)}</span>
          </div>
          <div className='dashboard__info'>
            <div className='dashboard__name'>{userData.fullName}</div>
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
