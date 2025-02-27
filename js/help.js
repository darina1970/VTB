document.getElementById("helpClose").addEventListener("click", function () {
  window.history.back();
});

document.addEventListener("DOMContentLoaded", function () {
  const iconWrappers = document.querySelectorAll('.icon-wrapper');
    iconWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', function () {
            const url = this.getAttribute('data-url');
            if (url) {
                window.location.href = url;
            }
        });
    });

    const currentUrl = window.location.pathname.split('/').pop();
    const navIcons = document.querySelectorAll('.common-icon-wrapper');
    navIcons.forEach(icon => {
        const iconUrl = icon.getAttribute('data-url');
        console.log(iconUrl);
        console.log(currentUrl);
        if (iconUrl && currentUrl === iconUrl) {
            icon.classList.add('active');
        }
    });

  const cards = document.querySelectorAll(".help__gallery__card");
  const dots = document.querySelectorAll(".dot");
  const gallery = document.querySelector(".help__gallery");
  let currentIndex = 0;

  function showCards() {
    const screenWidth = window.innerWidth;

    let shownCards;
    if (screenWidth >= 1840) {
      shownCards = 4;
      cards.forEach((card) => (card.style.display = "block"));
      dots.forEach((dot) => (dot.style.display = "none"));
    } else if (screenWidth >= 1500) {
      shownCards = 3;
    } else if (screenWidth >= 1200) {
      shownCards = 2;
    } else {
      shownCards = 1;
      gallery.style.justifyContent = "center";
    }

    cards.forEach((card) => {
      card.style.display = "none";
    });

    for (let i = 0; i < shownCards && currentIndex + i < cards.length; i++) {
      cards[currentIndex + i].style.display = "block";
    }

    dots.forEach((dot) => {
      dot.style.display = "inline-block";
      dot.classList.remove("active");
    });

    if (currentIndex < dots.length) {
      dots[currentIndex].classList.add("active");
    }
  }

  showCards();

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", function () {
      currentIndex = dotIndex;
      showCards();
    });
  });

  window.addEventListener("resize", showCards);
});
