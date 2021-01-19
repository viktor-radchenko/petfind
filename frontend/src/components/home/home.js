import React from "react";
import { Link } from 'react-router-dom';

import TagForm from '../tag-form';

import videoPlaceholder from "../../images/video.jpg";
import headerBg from "../../images/main-img.png";
import tagImg from "../../images/tag-img.jpg";

export default function Home() {
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch("/api")
  //     .then((resp) => resp.json())
  //     .then((resp) => setMessage(resp.message));
  // }, []);

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

            <div className='connect__img'>
              <img src={headerBg} alt='found my pet' />
            </div>
          </div>
        </div>
      </section>

      <section className='mode'>
        <span className='title mode__title'>Here’s how it works</span>

        <ul className='tabs'>
          <li className='tabs__item tabs__item--active'>For owner</li>

          <li className='tabs__item '>for founder</li>
        </ul>

        <div className='tabs__content'>
          <ul className='mode__advantages'>
            <li className='mode__item'>Register your items Tag ID with trace and return</li>

            <li className='mode__item'>Track the lost items</li>

            <li className='mode__item'>Founder would message you and you find your lost item!!</li>
          </ul>

          <Link className='mode__video'>
            <img src={videoPlaceholder} alt='video' />
          </Link>

          <div className='id-form'>
            <input className='id-form__input' type='text' placeholder='Enter Tag ID' />

            <button className='id-form__btn' type='submit'>
              Register item
            </button>
          </div>
        </div>
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

            <div className='tags__bottom'>
              <article className='tag-card'>
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
              </article>
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
