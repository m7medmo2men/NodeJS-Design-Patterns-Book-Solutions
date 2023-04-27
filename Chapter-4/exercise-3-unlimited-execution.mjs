import fs from "fs";
import path from "path";

let filesFound = [];
let active = 0;
let reading = 0;

function readAndSearch(filePath, fileName, keyword, cb) {
  fs.readFile(filePath, "utf-8", (err, content) => {
    if (err) {
      return cb(err);
    }

    if (content.includes(keyword)) {
      filesFound.push(fileName);
    }
    cb();
  });
}

function recursiveFind(dir, keyword, cb) {
  active++;
  fs.readdir(dir, { withFileTypes: true }, (err, files) => {
    for (const file of files) {
      const filePath = path.join(dir, file.name);
      if (file.isDirectory()) {
        recursiveFind(filePath, keyword, cb);
      } else {
        reading++;
        readAndSearch(filePath, file.name, keyword, () => {
          reading--;
          if (reading === 0) {
            if (active === 0) {
              cb(null, filesFound);
            }
          }
        });
      }
    }
    active--;
  });
}

const __dirname = path.resolve();
recursiveFind(__dirname, "Hello", (err, files) => {
  if (err) {
    console.log(err);
  } else {
    console.log(files);
  }
});
