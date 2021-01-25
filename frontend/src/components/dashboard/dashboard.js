import React, { useEffect, useState } from "react";
import { authFetch, logout } from "../../services";

import DashboardTable from "../dashboard-table";
import DashboardSidebar from "../dashboard-sidebar";
import ShopifyCard from '../shopify-card';
import Profile from "../profile";

import "./dashboard.css";

export default function Dasboard() {
  const [userData, setUserData] = useState();
  const [currentTab, setCurrentTab] = useState("table");
  const [sideBarActive, setSideBarActive] = useState(false);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const transformUserData = (data) => {
    return {
      fullName: data.full_name ? data.full_name : "",
      phone: data.phone ? data.phone : "",
      email: data.email ? data.email : "",
      address: data.address ? data.address : "",
      city: data.city ? data.city : "",
      country: data.country ? data.country : "",
      zipCode: data.zip_code ? data.zip_code : "",
      userState: data.state ? data.state : "",
      firstName: data.first_name ? data.first_name : "",
      lastName: data.last_name ? data.last_name : "",
    };
  };

  useEffect(() => {
    authFetch("/api/auth/get_user_data")
      .then((res) => {
        if (!res.ok) throw new Error("We could not authorize your request. Try log in to the system and try again");
        return res.json();
      })
      .then((res) => {
        const data = transformUserData(res);
        setUserData(data);
      })
      .catch((e) => {
        alert(e.message);
        logout();
      });
  }, []);

  return (
    <section className='dashboard'>
      {userData && (
        <DashboardSidebar
          active={sideBarActive}
          userData={userData}
          handleTabChange={handleTabChange}
          currentTab={currentTab}
        />
      )}

      <div className='dashboard__content'>
        <div className='dashboard__inner'>
          <div className='dashboard__box'>
            <button
              className={sideBarActive ? "burger-btn burger-btn--active" : "burger-btn"}
              onClick={() => setSideBarActive(!sideBarActive)}>
              Sidebar Button
            </button>
            <span className='title dashboard__title'>Dashboard</span>
          </div>

          {currentTab === "table" && <DashboardTable />}
          {currentTab === "analytics" && <div>Analytics tab</div>}
          {currentTab === "profile" && <Profile userData={userData} />}
        </div>

        <div className='buy-tags'>
          <div className='buy-tags__top'>
            <span className='title buy-tags__title'>Buy Tags</span>
            <a className='tags__more buy-tags__more' href='!#'>
              See all
            </a>
          </div>
          <div className='buy-tags__content' id="buy-tags__content">
            <ShopifyCard wrapper={'buy-tags__content'} />
          </div>
        </div>
      </div>
    </section>
  );
}
