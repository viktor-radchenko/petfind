import React, { useState, useEffect } from "react";

import DashboardTable from "../dashboard-table";
import DashboardSidebar from "../dashboard-sidebar";

import "./dashboard.css";

export default function Dasboard() {
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   authFetch("/api/protected")
  //     .then((response) => {
  //       if (response.status === 401) {
  //         setMessage("Sorry you aren't authorized!");
  //         return null;
  //       }
  //       return response.json();
  //     })
  //     .then((response) => {
  //       if (response && response.message) {
  //         setMessage(response.message);
  //       }
  //     });
  // }, []);

  return (
    <section className='dashboard'>
      <DashboardSidebar />
      <div className='dashboard__content'>
        
        <DashboardTable />
        
        <div className='buy-tags'>
          <div className='buy-tags__top'>
            <span className='title buy-tags__title'>Buy Tags</span>

            <a className='tags__more buy-tags__more' href='!#'>
              See all
            </a>
          </div>

          <div className='buy-tags__content'>
            <article className='tag-card'>
              <div className='tag-card__top'>
                <div className='tag-card__img'>
                  <img src='images/tag-img.jpg' alt='tag' />
                </div>

                <div className='tag-card__details'>
                  <a className='tag-card__title' href='!#'>
                    Bow Tie Pet Tag
                  </a>

                  <button className='tag-card__btn' type='button'>
                    $100
                  </button>
                </div>

                <span className='tag-card__desc'>Engrave - Memories, Etched Forever!</span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
