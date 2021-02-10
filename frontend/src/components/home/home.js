import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactPlayer from "react-player/youtube";

import ShopifyCard from "../shopify-card";
import TagForm from "../tag-form";
import NewTagForm from "../new-tag-form.js";

export default function Home() {
  const [currentTab, setCurrentTab] = useState(1);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const cards = async () => {
      return await fetch("/api/merchandize")
        .then((res) => res.json())
        .then((res) => {
          console.log("Fetched product IDs:", res);
          setCards(res);
        });
    };
    cards();
  }, []);

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
              <li className='mode__item'>Secure your pets and stuff with tags and stickers</li>

              <li className='mode__item'>Get notifications when someone searches for your lost item</li>

              <li className='mode__item'>Privacy: make your contact info private</li>
            </ul>
          )}

          {currentTab === 2 && (
            <ul className='mode__advantages'>
              <li className='mode__item'>Find the owner's contact info instantly</li>

              <li className='mode__item'>Send messages to owners of the lost item</li>

              <li className='mode__item'>Email us when you return a lost item for a reward</li>
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
            <ShopifyCard type={"home"} />
          </div>
        </div>
      </section>
    </main>
  );
}
