import fs from "fs";
import path from "path";

let running = 0;
let allFiles = [];

function listNestedFiles(dir, cb) {
  running++;
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    if (err) {
      return cb(err);
    }

    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        listNestedFiles(filePath, cb);
      } else {
        allFiles.push(file.name);
      }
    }

    running--;
    if (running === 0) {
      cb(null, allFiles);
    }
  });
}

const __dirname = path.resolve();
listNestedFiles(__dirname, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    console.log(files);
  }
});
