import React, {useEffect, useState} from "react";
import { authFetch } from '../../services';

import DashboardTable from "../dashboard-table";
import DashboardSidebar from "../dashboard-sidebar";

import "./dashboard.css";
import merchImg from "../../images/tag-img.jpg";


export default function Dasboard() {

  const [userData, setUserData] = useState();

  useEffect(() => {
    authFetch("/api/auth/get_user_data")
      .then((response) => {
        if (response.status === 401) {
          console.error("Sorry you aren't authorized!");
          return null;
        }
        return response.json();
      })
      .then((response) => setUserData(response));
  }, []);

  return (
    <section className='dashboard'>
      {userData && <DashboardSidebar userData={userData} />}
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
                  <img src={merchImg} alt='tag' />
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
            <article className='tag-card'>
              <div className='tag-card__top'>
                <div className='tag-card__img'>
                  <img src={merchImg} alt='tag' />
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
            <article className='tag-card'>
              <div className='tag-card__top'>
                <div className='tag-card__img'>
                  <img src={merchImg} alt='tag' />
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
            <article className='tag-card'>
              <div className='tag-card__top'>
                <div className='tag-card__img'>
                  <img src={merchImg} alt='tag' />
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
