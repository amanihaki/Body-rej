$(".post-wrapper").slick({
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  nextArrow: $(".next"),
  prevArrow: $(".prev")
});
$(".navbar-toggler").click(function() {
  $(".navbar-collapse").slideToggle();
});
