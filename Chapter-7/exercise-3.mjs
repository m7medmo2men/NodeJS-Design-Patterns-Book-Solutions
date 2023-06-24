import http from "http";

class Queue {
  constructor(executor) {
    const privateData = {};
    privateData.queue = [];
    privateData.pending = [];

    function enqueue(val) {
      privateData.queue.push(val);
      if (privateData.pending.length > 0) {
        this.queue.push(val);
        const resolve = privateData.pending.shift();
        resolve(privateData.queue.shift());
      }
    }

    function dequeue() {
      return new Promise((resolve) => {
        if (privateData.queue.length > 0) {
          resolve(privateData.queue.shift());
        } else {
          privateData.pending.push(resolve);
        }
      });
    }

    // The only accessible method
    this.dequeue = dequeue.bind(this);

    // use enqueue.bind(this) if you are using "this" inside the function
    // executor(enqueue.bind(this));
    executor(enqueue);
  }
}

const queue = new Queue((enqueue) => {
  const server = http.createServer((req, res) => {
    if (req.method === "POST") {
      enqueue(Math.round(Math.random() * 1000));
    }
    res.end("Inserted Successfully");
  });

  server.on("error", (err) => {
    res.end(`Error Occured: ${err.message}`);
  });

  server.listen(3000, () => {
    console.log("Server Started");
  });
});

async function test() {
  while (true) {
    try {
      const res = await queue.dequeue();
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
}

test();
