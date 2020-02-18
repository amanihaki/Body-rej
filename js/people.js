let $ = require("jquery");

import "slick-carousel";

class Slider {
  constructor() {
    this.els = $(".hero-slider");
    this.initSlider();
  }

  initSlider() {
    $("body").append("<h1>Hiiiiii njbb jj j</h1>");
    this.els.slick({
      autoplay: true,
      arrows: false,
      dots: false
    });
  }
}

export default Slider;
