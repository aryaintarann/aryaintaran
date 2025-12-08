import Swiper from 'swiper';
import { Navigation, Pagination, Keyboard, Autoplay, Parallax, EffectCreative } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-creative';

document.addEventListener('DOMContentLoaded', () => {
    const swiper = new Swiper('.project-slider', {
        modules: [Navigation, Pagination, Keyboard, Autoplay, Parallax, EffectCreative],
        loop: true,
        effect: 'creative',
        creativeEffect: {
            prev: {
                translate: ['-100%', 0, 0],
                opacity: 0,
            },
            next: {
                translate: ['100%', 0, 0],
                opacity: 0,
            },
        },
        speed: 1000,
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 1,
        parallax: true,
        keyboard: {
            enabled: true,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + ' bg-genz-lime hover:bg-genz-pink transition-colors"></span>';
            },
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
});
