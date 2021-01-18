import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { authFetch, logout } from "../../services";
import DashBoardTable from "../dashboard-table";

import DashboardTable from "../dashboard-table";

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
      <div className='dashboard__nav'>
        <Link className='logo-noword' to='/'>
          <img src='images/logo-noword.png' alt='logotype' />
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

      <div className='dashboard__content'>
        <div className='dashboard__inner'>
          <div className='dashboard__box'>
            <button className='burger-btn'>Burger Button</button>

            <span className='title dashboard__title'>Dashboard</span>
          </div>

          <form className='dashboard__search'>
            <input className='input dashboard__input' type='text' placeholder='Search by tag ID, name' />

            <button className='button dashboard__btn'>Add New Tag</button>
          </form>

          <DashBoardTable />

          <div className='buy-tags'>
            <div className='buy-tags__top'>
              <span className='title buy-tags__title'>Buy Tags</span>

              <a className='tags__more buy-tags__more' href='#'>
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
                    <a className='tag-card__title' href='#'>
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
      </div>
    </section>
  );
}
