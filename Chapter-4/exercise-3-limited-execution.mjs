import fs from "fs";
import path from "path";

class TaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.running = 0;
    this.tasks = [];
    this.current = [];
  }

  pushTask(task) {
    this.tasks.push(task);
    process.nextTick(this.next.bind(this));
  }

  next() {
    if (this.running === 0 && this.tasks.length === 0) {
      return;
    }
    while (this.running < this.concurrency && this.tasks.length > 0) {
      const task = this.tasks.shift();
      task(() => {
        this.running--;
        process.nextTick(this.next.bind(this));
      });
      this.running++;
    }
  }
}

const taskQueue = new TaskQueue(3);
let filesFound = [],
  active = 0,
  reading = 0,
  __dirname = path.resolve();

function readAndSearch(filePath, keyword, cb) {
  fs.readFile(filePath, "utf-8", (err, content) => {
    if (err) {
      return cb(err);
    }

    if (content.includes(keyword)) {
      return cb(null, true);
    }
    cb(null, false);
  });
}

function recursiveFind(dir, keyword, cb) {
  active++;
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return cb(err);
    }
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        recursiveFind(filePath, keyword, cb);
      } else {
        reading++;
        taskQueue.pushTask(function asyncTask(done) {
          readAndSearch(filePath, keyword, (err, found) => {
            if (err) {
              return cb(err);
            }

            if (found) {
              filesFound.push(file.name);
            }

            done();
            reading--;
            if (active === 0 && reading === 0) {
              cb(null, filesFound);
            }
          });
        });
      }
    }
    active--;
  });
}

function findWithinDirectory(dir, keyword, cb) {
  recursiveFind(dir, keyword, cb);
}

findWithinDirectory(__dirname, "Hello", (err, files) => {
  if (err) {
    console.log(err);
  } else {
    console.log(files);
  }
});
