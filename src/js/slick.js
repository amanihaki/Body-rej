let $ = require("jquery");

import "slick-carousel";

class Slider {
  constructor() {
    this.els = $(".post-wrapper");
    this.initSlider();
  }

  initSlider() {
    this.els.slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      nextArrow: $(".next"),
      prevArrow: $(".prev")
    });
  }
}

export default Slider;
