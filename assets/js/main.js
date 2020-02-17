/*let url = '/omneeyat';*/

$(".navbar-toggler").click(function() {
  $(".navbar-collapse").slideToggle();
});

let url = "";
$(document).ready(function() {
  let is_rtl = false;
  is_rtl = $("body").hasClass("rtl");

  $("video")
    .off("play")
    .on("play", function() {
      var dd = this.id;
      $("video").each(function(index) {
        if (dd != this.id) {
          this.pause();
          this.currentTime = 0;
        }
      });
    });

  /* 1. Visualizing things on Hover - See next part for action on click */
  $("#stars li")
    .on("mouseover", function() {
      var onStar = parseInt($(this).data("value"), 10); // The star currently mouse on

      // Now highlight all the stars that's not after the current hovered star
      $(this)
        .parent()
        .children("li.star")
        .each(function(e) {
          if (e < onStar) {
            $(this).addClass("hover");
          } else {
            $(this).removeClass("hover");
          }
        });
    })
    .on("mouseout", function() {
      $(this)
        .parent()
        .children("li.star")
        .each(function(e) {
          $(this).removeClass("hover");
        });
    });

  /* 2. Action to perform on click */
  $("#stars li").on("click", function() {
    var onStar = parseInt($(this).data("value"), 10); // The star currently selected
    var stars = $(this)
      .parent()
      .children("li.star");

    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass("selected");
    }

    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass("selected");
    }

    // JUST RESPONSE (Not needed)
    var ratingValue = parseInt(
      $("#stars li.selected")
        .last()
        .data("value"),
      10
    );
    $.ajax({
      type: "POST",
      url: url + "/rating",
      data: {
        rating: ratingValue,
        booking_id: $("#booking_id").val()
      },
      dataType: "text",
      success: function(response) {
        var msg = "";
        if (ratingValue > 1) {
          msg = "Thanks! You rated this " + ratingValue + " stars.";
        } else {
          msg =
            "Sorry for your bad experience. You rated this " +
            ratingValue +
            " stars.";
        }
        responseMessage(msg);
      }
    });
  });
  $("#comment_text").keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      $("#comment_text").attr("placeholder", "Saving...");
      $.ajax({
        type: "POST",
        url: url + "/post_comment",
        data: {
          description: $("#comment_text").val(),
          video_id: $("#video_id").val()
        },
        dataType: "text",
        success: function(response) {
          $("#comment_text").val("");
          $(response).prependTo(".comments-container");
        }
      });
      return false;
    }
  });
  $("#review_booking").keydown(function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
      $("#review_booking").attr("placeholder", "Saving...");
      $.ajax({
        type: "POST",
        url: url + "/booking_comment",
        data: {
          review_booking: $("#review_booking").val(),
          booking_id: $("#booking_id").val()
        },
        dataType: "text",
        success: function(response) {
          $("#booking_comment").html('"' + $("#review_booking").val() + '"');
        }
      });
      return false;
    }
  });
  var current_id = $(".friends_container li:last").attr("id");
  $("#button_add").click(function() {
    // get the last DIV which ID starts with ^= "friend_"
    var $div = $('li[id^="friend_"]:last');

    // Read the Number from that DIV's ID (i.e: 3 from "friend_3")
    // And increment that number by 1
    var num = parseInt($div.prop("id").match(/\d+/g), 10) + 1;

    // Create clone of <div class='input-form'>
    var newel = $(".friends_container li:last")
      .clone()
      .prop("id", "friend_" + num);
    $(newel)
      .find("label")
      .text("Email " + num);
    $(newel)
      .find("input")
      .val("");
    // Add after last <div class='input-form'>
    $(newel).insertAfter(".friends_container li:last");
  });

  var maxlength = 4;
  $("#search_input").keyup(function() {
    var that = this,
      value = $(this).val();
    //if (value.length <= maxlength) {
    $("#search_result").html('<div class="loader">Loading...</div>');
    $.ajax({
      type: "POST",
      url: url + "/search",
      data: {
        keyword: value
      },
      dataType: "text",
      success: function(html) {
        //if (value == $(that).val()) {
        $("#search_result").html(html);
        //}
      }
    });
    //}
  });

  $("#enroll-btn-submit").click(function(e) {
    e.preventDefault();
    var form = $(".form-signin");

    if (form[0].checkValidity() === false) {
      event.stopPropagation();
      form.addClass("was-validated");
    } else {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: url + "/enroll-talent",
        data: $(".form-signin").serialize(),
        success: function(msg) {
          //alert( "Data Saved: " + msg );
          if (msg.result == "invalid") {
            $(".enroll-msg").html(
              "<span class='error'>An account with this email already exists</span>"
            );
          } else if (msg.result == "created") {
            $(".enroll-msg").html(
              "<span class='success'>Thank you for your registration, We will send email confirmation soon to activate your account.</span>"
            );
            form.removeClass("was-validated");
            $(".form-signin")[0].reset();
          }
        }
      });
    }
  });

  $(".form-insta").submit(function(e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: url + "/update_email",
      data: $(".form-insta").serialize()
    }).done(function(msg) {
      if (msg == -1) {
        $(".error-msg").html("Email already exists!");
      } else if (msg == 1) {
        $(".success-msg").html("Thank you for updating your account!");
        $("#InstaModal").modal("hide");
        $(".form-insta")[0].reset();
      }
    });
  });

  $("#signup-btn-submit").click(function(e) {
    e.preventDefault();

    var form = $("form.new-account");

    if (form[0].checkValidity() === false) {
      event.stopPropagation();
      form.addClass("was-validated");
    } else {
      $.ajax({
        type: "POST",
        dataType: "json",
        url: url + "/signup",
        data: $(".new-account").serialize(),
        success: function(msg) {
          //alert(msg.result);
          //alert( "Data Saved: " + msg );
          if (msg.result == "error") {
            $(".signup-msg").html(
              "<span class='error'>Error, Please try again later</span>"
            );
          } else if (msg.result == "created") {
            $(".signup-msg").html(
              "<span class='success'>Thank you for your registration</span>"
            );
            form.removeClass("was-validated");
            $(".new-account")[0].reset();

            setTimeout(function() {
              window.location.replace("/profile");
            }, 3000);
          } else if (msg.result == "email exist") {
            $(".signup-msg").html(
              "<span class='error'>Email address already in use</span>"
            );
          } else if (msg.result == "username exist") {
            $(".signup-msg").html(
              "<span class='error'>Username already in use</span>"
            );
          }
          $(".signup-msg").show();
        }
      });
    }
  });

  $("#login-btn-submit").click(function(e) {
    e.preventDefault();
    var form = $("form.login");

    if (form[0].checkValidity() === false) {
      event.stopPropagation();
      form.addClass("was-validated");
    } else {
      $.ajax({
        type: "POST",
        url: url + "/login",
        dataType: "json",
        data: $(".login").serialize(),
        success: function(msg) {
          if (msg.result == "login") {
            window.location.replace(url);
          } else {
            $(".login-msg")
              .html("<span class='error'>Invalid Credentials</span>")
              .show();
            //$(".form-signin")[0].reset();
          }
        }
      });
    }
  });

  $("form.pwd").submit(function(e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      dataType: "html",
      url: url + "/forgot",
      data: $("form.pwd").serialize()
    }).done(function(msg) {
      $(".pwd-response").html(msg);
      $("form.pwd")[0].reset();
    });
  });

  $("form.notifications").submit(function(e) {
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: url + "/send_notification",
      dataType: "text",
      data: $(this).serialize(),
      success: function(msg) {
        if (msg == 1) {
          $("form.notifications").remove();
          $("#notificationsModal .modal-body").append(
            '<p style="color:#145258">Thank you, You will be notified once the talent available.</p>'
          );
          // window.location.replace(url);
        } else if (msg == "notified") {
          $(".notify-response").html(
            '<span style="color:red">You already sent a notification for this talent</span>'
          );
        }
      }
    });
  });

  $("#btnSubmit").click(function(event) {
    event.preventDefault();
    // Fetch form to apply custom Bootstrap validation
    var form = $("#booking-form");

    if (form[0].checkValidity() === false) {
      event.stopPropagation();
    } else {
      $.ajax({
        type: "POST",
        url: url + "/book",
        dataType: "json",
        data: $("#booking-form").serialize()
      }).done(function(msg) {
        if (msg.status == 1) {
          //alert("Thank you!");
          $(".hidden-fields").html(msg.fields);
          $("#booking-form").submit();
        } else {
          alert("Failed! Please try again");
        }
      });
    }

    form.addClass("was-validated");
    // Perform ajax submit here...
  });

  $(".fpwd").click(function(event) {
    $("#LoginModal").modal("toggle");
    $("#pwdModal").modal("show");
  });

  $(".new-account-popup").click(function(event) {
    $("#LoginModal").modal("toggle");
    $("#newaccountModal").modal("show");
  });

  $(".show-login-modal").click(function(event) {
    $("#newaccountModal").modal("toggle");
    $("#LoginModal").modal("show");
  });

  $("input[type=radio][name=booking_option_id]").change(function() {
    if (this.value == 1) {
      //$("#customer_name").attr('placeholder','Carissa');
      $("label[for='customer_name']").html(
        '<span class="english">To</span><span class="arabic">الى</span>'
      );
      $("#purchaser_name_div").css("display", "block");
      $("#customer_name_div").removeClass("col-md-12");
      $("#customer_name_div").addClass("col-md-6");
      $("#purchaser_name").val("");

      $("span.brand").hide();
      $("span.individual").show();

      //$( "input[name='ivp_amount']" ).val($('#individualprice').val());
    } else if (this.value == 2) {
      //$("#customer_name").attr('placeholder','Greg');
      $("label[for='customer_name']").html(
        '<span class="english">My name is</span><span class="arabic">الاسم الكامل</span>'
      );
      $("#purchaser_name_div").css("display", "none");
      $("#customer_name_div").removeClass("col-md-6 col-full");
      $("#customer_name_div").addClass("col-md-12");
      $("#purchaser_name").val(" ");

      $("span.brand").hide();
      $("span.individual").show();

      //$( "input[name='ivp_amount']" ).val($('#individualprice').val());
    } else {
      //$("#customer_name").attr('placeholder','Johnny\'s Coffee Shop');
      $("label[for='customer_name']").html(
        '<span class="english">This shoutout is for</span><span class="arabic">مخصص الى</span>'
      );
      $("#purchaser_name_div").css("display", "none");
      $("#customer_name_div").removeClass("col-md-6");
      $("#customer_name_div").addClass("col-md-12 col-full");
      $("#purchaser_name").val(" ");

      $("span.brand").show();
      $("span.individual").hide();

      //$( "input[name='ivp_amount']" ).val($('#brandprice').val());
    }

    $("input#booking_price").val($(this).attr("option-talent-price"));
  });

  $(".post-wrapper").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: $(".next"),
    prevArrow: $(".prev"),
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 6
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  });

  $(".reaction-slider").slick({
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: $(".left-arrow"),
    nextArrow: $(".right-arrow"),
    rtl: is_rtl,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 576,
        settings: {
          dots: true,
          arrows: false,
          prevArrow: false,
          nextArrow: false,
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  });

  $(".review-slider").slick({
    dots: false,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: $(".left-arrow"),
    nextArrow: $(".right-arrow")
  });

  $("#reactions .vjs-tech")
    .parent()
    .click(function() {
      if ($(this).children(".vjs-tech").paused) {
        $(this)
          .children(".vjs-tech")
          .play();
        $(this)
          .children(".playpause")
          .fadeOut();
      } else {
        $(this)
          .children(".vjs-tech")
          .pause();
        $(this)
          .children(".playpause")
          .fadeIn();
      }
    });

  $(".subscribe form").submit(function(e) {
    e.preventDefault();
    var postdata = $(".subscribe form").serialize();
    $.ajax({
      type: "POST",
      url: "/subscribe/",
      data: postdata,
      dataType: "json",
      success: function(json) {
        if (json.valid == 0) {
          $(".success-message").hide();
          $(".error-message").hide();
          $(".error-message").html(json.message);
          $(".error-message").fadeIn("fast", function() {
            $(".subscribe form")
              .addClass("animated shake")
              .one(
                "webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
                function() {
                  $(this).removeClass("animated shake");
                }
              );
          });
        } else {
          $(".error-message").hide();
          $(".success-message").hide();
          $(".subscribe form").hide();
          $(".success-message").html(json.message);
          $(".success-message").fadeIn("fast", function() {
            $(".top-content").backstretch("resize");
          });
        }
      }
    });
  });

  document.getElementById("fb_login").addEventListener(
    "click",
    function() {
      //do the login
      FB.login(statusChangeCallback, {
        scope: "email,public_profile",
        return_scopes: true
      });
    },
    false
  );

  document.getElementById("fb_signup").addEventListener(
    "click",
    function() {
      //do the login
      FB.login(statusChangeCallback, {
        scope: "email,public_profile",
        return_scopes: true
      });
    },
    false
  );

  window.fbAsyncInit = function() {
    FB.init({
      appId: "458085338459412",
      cookie: true,
      xfbml: true,
      version: "v5.0"
    });

    FB.AppEvents.logPageView();
  };

  (function(d, s, id) {
    var js,
      fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
      return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  })(document, "script", "facebook-jssdk");
});

function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}
function statusChangeCallback(response) {
  if (response.status === "connected") {
    // Logged into your app and Facebook.
    FB.api("/me", function(response) {
      $.ajax({
        type: "POST",
        url: "/login_facebook",
        data: {
          response: response
        },
        success: function(response) {
          location.reload();
        }
      });
    });
  } else {
    // The person is not logged into your app or we are unable to tell.
  }
}

function responseMessage(msg) {
  $(".success-box").fadeIn(200);
  $(".success-box div.text-message").html("<span>" + msg + "</span>");
}

function follow(talent_id) {
  //$('#follow').html('FOLLOWING...');
  $.ajax({
    type: "POST",
    url: url + "/follow",
    data: {
      talent_id: talent_id
    },
    dataType: "text",
    success: function(response) {
      if (response == 1) {
        $("#follow").attr("onclick", "unfollow(" + talent_id + ")");
        $("#follow").html('<span class="fa fa-heart "></span>');
      }
    }
  });
}

function unfollow(talent_id) {
  //$('#follow').html('UNFOLLOWING...');
  $.ajax({
    type: "POST",
    url: url + "/unfollow",
    data: {
      talent_id: talent_id
    },
    dataType: "text",
    success: function(response) {
      if (response == 1) {
        $("#follow").attr("onclick", "follow(" + talent_id + ")");
        $("#follow").html('<span class="far fa-heart "></span>');
      }
    }
  });
}

function like(video_id) {
  $.ajax({
    type: "POST",
    url: url + "/like",
    data: {
      video_id: video_id
    },
    dataType: "text",
    success: function(response) {
      if (response == 1) {
        $(".like-span")
          .find("i")
          .removeClass("fa-heart-o");
        $(".like-span")
          .find("i")
          .addClass("fa-heart");
        $(".like-span").attr("onclick", "dislike(" + video_id + ")");
        $(".like-span")
          .find(".likes_num")
          .text(
            parseInt(
              $(".like-span")
                .find(".likes_num")
                .text(),
              10
            ) + 1
          );
      }
    }
  });
}

function dislike(video_id) {
  $.ajax({
    type: "POST",
    url: url + "/dislike",
    data: {
      video_id: video_id
    },
    dataType: "text",
    success: function(response) {
      if (response == 1) {
        $(".like-span")
          .find("i")
          .removeClass("fa-heart");
        $(".like-span")
          .find("i")
          .addClass("fa-heart-o");
        $(".like-span").attr("onclick", "like(" + video_id + ")");
        $(".like-span")
          .find(".likes_num")
          .text(
            parseInt(
              $(".like-span")
                .find(".likes_num")
                .text(),
              10
            ) - 1
          );
      }
    }
  });
}

function deleteComment(comment_id) {
  $.ajax({
    type: "POST",
    url: url + "/delete_comment",
    data: {
      comment_id: comment_id
    },
    dataType: "text",
    success: function(response) {
      if (response == 1) {
        $("#comment_" + comment_id).remove();
      }
    }
  });
}

function sendNotification(talent_id) {
  $.ajax({
    type: "POST",
    url: url + "/send_notification",
    data: {
      talent_id: talent_id
    },
    dataType: "text",
    success: function(response) {
      if (response == 1) {
        //$("#comment_"+comment_id).remove();
        $(".btn.btn-book-now").attr("href", "javascript:void(0)");
        Swal.fire({
          title: "Thank you",
          html: "You will be notified once the talent is available.",
          confirmButtonText: "Ok",
          confirmButtonColor: "#145258"
        });
      }
    }
  });
}
/*
document.getElementById('userimage').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = function () {
            document.getElementById('newuserimage').src = fr.result;
        }
        fr.readAsDataURL(files[0]);
    }

    // Not supported
    else {
        // fallback -- perhaps submit the input to an iframe and temporarily store
        // them on the server until the user's session ends.
    }
}
*/

var sticky_header = function() {
  var windows = $(window);
  windows.on("scroll", function() {
    var scroll = windows.scrollTop();
    if (scroll < 100) {
      $(".home #mainNav").removeClass("navbar-shrink");
    } else {
      $(".home #mainNav").addClass("navbar-shrink");
    }
  });
};

sticky_header();
