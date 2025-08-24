import gsap from "gsap";

class Topnav {
  constructor() {
    this.expanded = false;
    this._init();
    this._initAnimation();
  }

  _init() {
    this.$comingSoonLinks = document.querySelectorAll(".link.coming_soon");
    this.$comingSoonLinks.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        el.classList.add("clicked");
      });
    });

    this.$menuBtn = document.querySelector(".topnav .btn-menu");
    if (!this.expanded) {
      this.$menuBtn.classList.add("closed");
    }

    this.$header = document.querySelector(".topnav .header");
    if (!this.expanded) {
      this.$header.classList.add("closed");
    }

    this.$links = document.querySelectorAll(".topnav .navigation .link");
    this.$navigation = document.querySelector(".topnav .navigation");

    this.$menuBtn.addEventListener("click", () => {
      this.expanded = !this.expanded;
      if (!this.expanded) {
        this.timeline.reverse();
        this.$menuBtn.classList.add("closed");
        this.$header.classList.add("closed");
      } else {
        this.timeline.play();
        this.$menuBtn.classList.remove("closed");
        this.$header.classList.remove("closed");
      }
    });
  }
  _initAnimation() {
    this.mm = gsap.matchMedia();
    this.timeline = gsap.timeline({ paused: true });
    this.mm.add("(max-width: 768px)", () => {
      this.timeline.from(this.$navigation, {
        scaleY: 0,
        height: 0,
      });
      this.timeline.from(
        this.$links,
        {
          yPercent: 100,
          stagger: 0.2,
        },
        "-=.5"
      );
      this.timeline.from(
        this.$header,
        {
          backgroundColor: "transparent",
          backdropFilter: "none",
        },
        "-= 1"
      );
    });
  }
}

export default Topnav;
