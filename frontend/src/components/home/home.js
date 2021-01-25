import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player/youtube";

import ShopifyCard from "../shopify-card";
import TagForm from "../tag-form";
import NewTagForm from "../new-tag-form.js";


export default function Home() {
  const [currentTab, setCurrentTab] = useState(1);

  return (
    <main>
      <section className='connect'>
        <div className='container'>
          <div className='connect__inner'>
            <div className='connect__content'>
              <span className='title connect__title'>Connecting Lost and Found</span>

              <div className='connect__text'>
                <p>
                  Trace and Return helps you get lost items back home safe, sound and soon. Whether you have found an
                  item or lost one, we're here to help!
                </p>
              </div>

              <span className='connect__subtitle'>Found a Lost item?</span>
              <span className='connect__label'>Enter the unique code on the back of the tag</span>

              <TagForm />
            </div>

            <div className='connect__img'></div>
          </div>
        </div>
      </section>

      <section className='mode'>
        <span className='title mode__title'>Here’s how it works</span>

        <ul className='tabs'>
          <li
            className={`tabs__item ${currentTab === 1 ? "tabs__item--active" : null}`}
            onClick={() => setCurrentTab(1)}>
            for owner
          </li>
          <li
            className={`tabs__item ${currentTab === 2 ? "tabs__item--active" : null}`}
            onClick={() => setCurrentTab(2)}>
            for founder
          </li>
        </ul>

        <div className='tabs__content'>
          {currentTab === 1 && (
            <ul className='mode__advantages'>
              <li className='mode__item'>Register your items Tag ID with trace and return</li>

              <li className='mode__item'>Track the lost items</li>

              <li className='mode__item'>Founder would message you and you find your lost item!!</li>
            </ul>
          )}

          {currentTab === 2 && (
            <ul className='mode__advantages'>
              <li className='mode__item'>Lorem ipsum, dolor sit amet consectetur adipisicing</li>

              <li className='mode__item'>Lorem ipsum dolor sit amet consectetur.</li>

              <li className='mode__item'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Rem!</li>
            </ul>
          )}
        </div>

        <div className='mode__video'>
          <ReactPlayer
            url='https://www.youtube.com/watch?v=RQELVJHn1Hc'
            // width='567px'
            // height='387px'
            controls={true}
            className='mode__link'
          />
        </div>

        <NewTagForm />
      </section>

      <section className='tags'>
        <div className='container'>
          <div className='tags__inner'>
            <div className='tags__top'>
              <div className='tags__text'>
                <span className='title tags__title'>Need a tag?</span>

                <span className='tags__label'>Choose a Tag, which is perfect for your items</span>
              </div>

              <div className='tags__nav'>
                <button className='tags__btn tags__btn--prev'></button>

                <button className='tags__btn tags__btn--next'></button>
              </div>
            </div>

            <div className='tags__bottom' id="tags__bottom">

              <ShopifyCard />
              {/* <article className='tag-card'>
                <div className='tag-card__top'>
                  <div className='tag-card__img'>
                    <img src={tagImg} alt='tag' />
                  </div>

                  <span className='tag-card__title'>Bow Tie Pet Tag</span>

                  <span className='tag-card__desc'>Engrave - Memories, Etched Forever!</span>
                </div>

                <button className='tag-card__btn' type='button'>
                  Buy for $100
                </button>
              </article> */}
            </div>

            <Link className='tags__more' to='/'>
              See All
            </Link>
          </div>
        </div>
      </section>

      
    </main>
  );
}
