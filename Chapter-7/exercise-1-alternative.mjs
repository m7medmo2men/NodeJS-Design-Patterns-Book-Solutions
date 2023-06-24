class ColorConsole {
  constructor(color) {
    this.color = color;
  }

  log(msg) {
    console.log(this.color, msg);
  }
}

class RedConsole extends ColorConsole {
  constructor() {
    super("\x1b[31m");
  }
}

class BlueConsole extends ColorConsole {
  constructor() {
    super("\x1b[34m");
  }
}

class GreenConsole extends ColorConsole {
  constructor() {
    super("\x1b[32m");
  }
}

const redConsole = new RedConsole();
redConsole.log("Hello");

const blueConsole = new BlueConsole();
blueConsole.log("Hello");

const greenConsole = new GreenConsole();
greenConsole.log("Hello");
