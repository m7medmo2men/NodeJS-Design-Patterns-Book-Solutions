class ColorConsole {
  constructor(color) {
    this.color = color;
  }

  log() {
    throw new Error("Not implemented");
  }
}

class RedConsole extends ColorConsole {
  constructor() {
    super("red");
  }

  log(msg) {
    console.log("\x1b[31m", msg);
  }
}

class BlueConsole extends ColorConsole {
  constructor() {
    super("blue");
  }

  log(msg) {
    console.log("\x1b[34m", msg);
  }
}

class GreenConsole extends ColorConsole {
  constructor() {
    super("green");
  }

  log(msg) {
    console.log("\x1b[32m", msg);
  }
}

// Alternative implementation
class ConsoleFactory {
  constructor() {
    this.types = {
      red: RedConsole,
      blue: BlueConsole,
      green: GreenConsole,
    };
  }

  create(type) {
    const Console = this.types[type] || ColorConsole;
    return new Console();
  }
}

function createConsole(type) {
  switch (type) {
    case "red":
      return new RedConsole();
    case "blue":
      return new BlueConsole();
    case "green":
      return new GreenConsole();
    default:
      throw new Error("Unsupported console type");
  }
}

const redConsole = new RedConsole();
redConsole.log("Hello");

const blueConsole = new BlueConsole();
blueConsole.log("Hello");

const greenConsole = new GreenConsole();
greenConsole.log("Hello");
