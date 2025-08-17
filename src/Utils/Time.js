import EventEmitter from "./EventEmitter";

export default class Time extends EventEmitter {
  constructor() {
    super();

    this.currentTime = Date.now();
    this.current = this.currentTime;
    this.elapsed = 0;
    this.delta = 16;

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    const time = Date.now();
    this.delta = time - this.current;
    this.elapsed = time - this.currentTime;
    this.current = time;

    this.trigger("tick");

    window.requestAnimationFrame(() => {
      this.tick();
    });
  }
}
