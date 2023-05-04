import Swiper, { Navigation } from 'swiper';
import 'swiper/swiper.scss';

export const swiper = new Swiper('.swiper', {
  modules: [Navigation],
  slidesPerView: 6,
  spaceBetween: 2,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    900: {
      spaceBetween: 8,
    },
    500: {
      slidesPerView: 6,
    },
    320: {
      slidesPerView: 4,
    },
  },
});
