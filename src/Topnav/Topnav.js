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
    this.$header = document.querySelector(".topnav .header");
    this.$links = document.querySelectorAll(".topnav .navigation .link");
    this.$navigation = document.querySelector(".topnav .navigation");

    this.$menuBtn.addEventListener("click", () => {
      if (!this.expanded) {
        this.timeline.play();
      } else {
        this.timeline.reverse();
      }
      this.expanded = !this.expanded;
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
        },
        "-= 1"
      );
    });
  }
}

export default Topnav;
