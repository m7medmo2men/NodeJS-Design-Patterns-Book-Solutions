 function mapAsync(iterable, callback, concurrency) {
   return new Promise((resolve, reject) => {
     let tasks = [],
       running = 0,
       outcome = [];

     tasks = iterable.map(
       (el) => () =>
         new Promise((resolve, reject) => {
           setTimeout(() => {
             resolve(callback(el));
           }, 1000);
         })
     );

     function next() {
       if (outcome.length === iterable.length) {
         return resolve(outcome);
       }

       while (running < concurrency && tasks.length) {
         const task = tasks.shift();
         task().then((res) => {
           outcome.push(res);
           running--;
           next();
         });
         running++;
       }
     }

     next();
   });
 }

 const startTime = Date.now();
 const ret = await mapAsync([1, 2, 3, 4], (el) => el * 10, 2);
 console.log(`Time taken: ${(Date.now() - startTime) / 1000} seconds`);
 console.log(ret);