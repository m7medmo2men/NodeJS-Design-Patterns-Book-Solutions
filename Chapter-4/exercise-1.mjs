import fs from "fs";

function saveContent(dest, content, cb) {
  fs.appendFile(dest, content, (err) => {
    if (err) {
      return cb(err);
    }
    cb();
  });
}

function concatFiles(files, dest, cb) {
  let concatenatedContact = "";

  function iterate(indx) {
    if (indx === files.length) {
      return saveContent(dest, concatenatedContact, cb);
    }
    fs.readFile(files[indx], (err, content) => {
      if (err) {
        return cb(err);
      }
      concatenatedContact += content;
      iterate(indx + 1);
    });
  }
  iterate(0);
}

const files = ["a.txt", "b.txt"];
concatFiles(files, "dest.txt", (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("done");
  }
});

/**
 * If you want to use rest parameters for function signature to pass the files
 * The last parameter will be th rest parameter which is function concatFiles(dest, cb, ...files)
 * but i prefer to use array as parameter and the callback as the last parameter
 */
