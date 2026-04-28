(function () {
  "use strict";

  var hamburgerButton = document.getElementById("hamburgerButton");
  var mainMenu = document.getElementById("mainMenu");
  var carouselTrack = document.getElementById("carouselTrack");
  var prevSlideButton = document.getElementById("prevSlide");
  var nextSlideButton = document.getElementById("nextSlide");
  var dotsContainer = document.getElementById("carouselDots");
  var slides = Array.prototype.slice.call(
    carouselTrack.querySelectorAll(".slide")
  );

  var currentSlideIndex = 0;
  var autoSlideTimer = null;
  var autoSlideDelay = 3500;

  function setMenuState(isOpen) {
    mainMenu.classList.toggle("open", isOpen);
    hamburgerButton.setAttribute("aria-expanded", String(isOpen));
    hamburgerButton.setAttribute(
      "aria-label",
      isOpen ? "Закрити меню" : "Відкрити меню"
    );
  }

  function buildDots() {
    slides.forEach(function (_, index) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("aria-label", "Слайд " + (index + 1));
      dot.dataset.index = String(index);
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    var dots = dotsContainer.querySelectorAll(".dot");

    dots.forEach(function (dot, index) {
      dot.classList.toggle("active", index === currentSlideIndex);
    });
  }

  function updateSlidePosition() {
    carouselTrack.style.transform =
      "translateX(-" + currentSlideIndex * 100 + "%)";
    updateDots();
  }

  function goToSlide(index) {
    if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else if (index >= slides.length) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex = index;
    }

    updateSlidePosition();
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = window.setInterval(function () {
      goToSlide(currentSlideIndex + 1);
    }, autoSlideDelay);
  }

  function stopAutoSlide() {
    if (autoSlideTimer !== null) {
      window.clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function handleMenuClick() {
    var isOpen = mainMenu.classList.contains("open");
    setMenuState(!isOpen);
  }

  function handleResize() {
    if (window.innerWidth >= 768) {
      setMenuState(false);
    }
  }

  function init() {
    buildDots();
    updateSlidePosition();
    startAutoSlide();

    hamburgerButton.addEventListener("click", handleMenuClick);

    prevSlideButton.addEventListener("click", function () {
      goToSlide(currentSlideIndex - 1);
      startAutoSlide();
    });

    nextSlideButton.addEventListener("click", function () {
      goToSlide(currentSlideIndex + 1);
      startAutoSlide();
    });

    dotsContainer.addEventListener("click", function (event) {
      var target = event.target;

      if (target instanceof HTMLButtonElement && target.dataset.index) {
        goToSlide(Number(target.dataset.index));
        startAutoSlide();
      }
    });

    mainMenu.addEventListener("click", function (event) {
      var target = event.target;
      if (
        window.innerWidth < 768 &&
        target instanceof HTMLElement &&
        target.closest(".menu-item")
      ) {
        setMenuState(false);
      }
    });

    carouselTrack.addEventListener("mouseenter", stopAutoSlide);
    carouselTrack.addEventListener("mouseleave", startAutoSlide);

    window.addEventListener("resize", handleResize);
  }

  init();
})();
