function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.9) {
                reject(new Error("Something went wrong"));
            }
            resolve(new Date());
        }, ms);
    })
}

function promiseAll(promises) {
    let resolved = [];
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            promise.then((data) => {
                resolved.push(data);
                if (resolved.length == promises.length) {
                    resolve(resolved);
                }
            }).catch(err => reject(err));
        });
    })
}

let startTime = new Date(), asyncTasks = [];
asyncTasks = [delay(1000), delay(1000), delay(1000), delay(1000), delay(1000)];

const tasksPromises = promiseAll(asyncTasks);
tasksPromises.then((res) => {
    console.log(res);
    const endTime = new Date();
    console.log("Total Time :", (endTime - startTime) / 1000);
}).catch((err) => {
    console.log("One of tasks had failed");
});
