import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Carousel from "react-multi-carousel";

import "react-multi-carousel/lib/styles.css";

import "./shopify-card.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
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

const ButtonGroup = ({ next, previous }) => {
  return (
    <div className='tags__nav'>
      <button className='tags__btn tags__btn--prev' onClick={() => previous()}></button>

      <button className='tags__btn tags__btn--next' onClick={() => next()}></button>
    </div>
  );
};

export const ShopifyCard = ({ type }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const cards = async () => {
      return await fetch("/api/merchandize")
        .then((res) => res.json())
        .then((res) => setCards(res));
    };
    cards();
  }, []);

  return (
    <>
      {type === "dashboard" && (
        <Carousel className='buy-tags__content' infinite focusOnSelect={false} responsive={responsive}>
          {cards.map((card) => (
            <div key={card.id} className='tag-card'>
              <div className='tag-card__top'>
                <div className='tag-card__img'>
                  <img src={card.imgUrl} alt='tag' />
                </div>

                <span className='tag-card__title'>{card.title}</span>

                <span className='tag-card__desc'>{card.subtitle}</span>
                <a href={card.url} className='tag-link'>
                  {" "}
                </a>
              </div>

              <a className='tag-card__btn' href={card.url}>
                Buy for ${card.price}
              </a>
            </div>
          ))}
        </Carousel>
      )}
      <div className='tags__top'>
        <div className='tags__text'>
          <span className='title tags__title'>Need a tag?</span>

          <span className='tags__label'>Choose a Tag, which is perfect for your items</span>
        </div>
      </div>

      <Carousel
        className='tags__bottom'
        arrows={false}
        infinite
        focusOnSelect={false}
        renderButtonGroupOutside
        responsive={responsive}
        customButtonGroup={<ButtonGroup />}>
        {cards.map((card) => (
          <div key={card.id} className='tag-card'>
            <div className='tag-card__top'>
              <div className='tag-card__img'>
                <img src={card.imgUrl} alt='tag' />
              </div>

              <span className='tag-card__title'>{card.title}</span>

              <span className='tag-card__desc'>{card.subtitle}</span>
              <a href={card.url} className='tag-link'>
                {" "}
              </a>
            </div>

            <a className='tag-card__btn' href={card.url}>
              Buy for ${card.price}
            </a>
          </div>
        ))}
      </Carousel>

      <a className='tags__more' href='https://store.tracereturn.com'>
        See All
      </a>
    </>
  );
};

export default ShopifyCard;
