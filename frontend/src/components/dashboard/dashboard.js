import React, { useEffect, useState } from "react";
import { authFetch, logout } from "../../services";

import DashboardTable from "../dashboard-table";
import DashboardSidebar from "../dashboard-sidebar";
import Profile from "../profile";
import DashboardMessages from "../dasboard-messages";

import "./dashboard.css";
import Carousel from "react-multi-carousel";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 2, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

export default function Dasboard() {
  const [userData, setUserData] = useState();
  const [currentTab, setCurrentTab] = useState("table");
  const [sideBarActive, setSideBarActive] = useState(false);
  const [cards, setCards] = useState([]);

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const handleSidebarActive = () => {
    setSideBarActive(!sideBarActive);
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
      roles: data.roles ? data.roles : "",
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

  useEffect(() => {
    const cards = async () => {
      return await fetch("/api/merchandize")
        .then((res) => res.json())
        .then((res) => setCards(res));
    };
    cards();
  }, []);

  return (
    <section className='dashboard'>
      {userData && (
        <DashboardSidebar
          active={sideBarActive}
          userData={userData}
          handleTabChange={handleTabChange}
          handleSidebarActive={handleSidebarActive}
          currentTab={currentTab}
        />
      )}

      <div className='dashboard__content'>
        <div className='dashboard__inner'>
          <div className='dashboard__box'>
            <button className='burger-btn' onClick={handleSidebarActive}>
              Sidebar Button
            </button>
            <span className='title dashboard__title'>Dashboard</span>
          </div>

          {currentTab === "table" && <DashboardTable />}
          {currentTab === "messages" && <DashboardMessages />}
          {currentTab === "profile" && <Profile userData={userData} />}
        </div>

        <div className='buy-tags'>
          <div className='buy-tags__top'>
            <span className='title buy-tags__title'>Buy Tags</span>
            <a className='tags__more buy-tags__more' href='https://store.tracereturn.com'>
              See all
            </a>
          </div>
          <Carousel
            containerClass='buy-tags__content'
            responsive={responsive}
            infinite
            arrows={false}
            autoPlaySpeed={7000}
            autoPlay>
            {cards.map((card) => (
              <div key={card.id} class='tag-card'>
                <div class='tag-card__top'>
                  <div class='tag-card__img'>
                    <img src={card.imgUrl} alt='tag' />
                  </div>

                  <div class='tag-card__details'>
                    <span class='tag-card__title'>{card.title}</span>

                    <button class='tag-card__btn' type='button'>
                      ${card.price}
                    </button>
                  </div>

                  <span class='tag-card__desc'>{card.subtitle}</span>
                  <a href={card.url} className='tag-link'>
                    {" "}
                  </a>
                </div>
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
