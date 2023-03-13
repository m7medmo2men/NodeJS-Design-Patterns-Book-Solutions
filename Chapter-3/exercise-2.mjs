import { EventEmitter } from "events";

class Ticker extends EventEmitter {
  constructor(milliseconds, cb) {
    super();
    this.milliseconds = milliseconds;
    this.cb = cb;
    this.timePassed = 0;
    this.cnt = 0;
  }

  repeat() {
    setTimeout(() => {
      if (this.timePassed >= this.milliseconds) {
        return this.cb(this.cnt);
      }
      this.emit("tick", ++this.cnt);
      this.timePassed += 50;
      this.repeat();
    }, 50);
  }

  start() {
    this.repeat();
    return this;
  }
}

const ticker = new Ticker(200, (cnt) => console.log("ticker finished with total count: " + cnt));
ticker.start().on("tick", (cnt) => console.log(`tick ${cnt}`));
