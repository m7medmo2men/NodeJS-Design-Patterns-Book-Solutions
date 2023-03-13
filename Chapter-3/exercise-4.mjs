import { EventEmitter } from "events";

class Ticker extends EventEmitter {
  constructor(milliseconds, cb) {
    super();
    this.milliseconds = milliseconds;
    this.cb = cb;
    this.timePassed = 0;
    this.cnt = 0;
  }

  checkTimeStamp() {
    return Date.now() % 5 === 0;
  }

  repeat() {
    setTimeout(() => {
      if (this.timePassed >= this.milliseconds) {
        return this.cb(null, this.cnt);
      }

      if (this.checkTimeStamp()) {
        this.emit("error", new Error("Time stamp is divisible by 5"));
        return this.cb(new Error("Time stamp is divisible by 5"));
      }

      this.emit("tick", ++this.cnt);
      this.timePassed += 50;
      this.repeat();
    }, 50);
  }

  start() {
    process.nextTick(() => this.emit("functionStarted"));
    this.repeat();
    return this;
  }
}

const ticker = new Ticker(200, (err, cnt) => {
  if (err) {
    console.log("Callback error: " + err.message);
    return;
  }
  console.log("ticker finished with total count: " + cnt);
});

ticker
  .start()
  .on("tick", (cnt) => console.log(`tick ${cnt}`))
  .on("functionStarted", () => console.log("function started"))
  .on("error", (err) => console.log("Event error: " + err.message));
