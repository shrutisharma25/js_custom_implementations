function MyPromise(executor) {
  let state = 'pending';
  let value;
  let handler = [];

  function resolve(val) {
    if (state === 'pending') return;
    value = val;
    state = 'fulfilled';
    handler.forEach((h) => h());
  }

  function reject(val) {
    if (state === 'pending') return;
    value = val;
    state = 'rejected';
    handler.forEach((h) => h());
  }

  executor(resolve, reject);

  return {
    then(onFulfilled, onRejected) {
      function handle() {
        if (state === 'fulfilled') {
          onFulfilled(value);
        } else if (state === 'rejected') {
          onRejected(value);
        }
      }

      if (state === 'pending') {
        handler.push(handle);
      } else {
        handle();
      }
    },
    catch(onRejected) {
      return this.then(onRejected);
    },
  };
}

function MyPromiseAll(promises) {
  return MyPromise((resolve, reject) => {
    if (!Array.isArray(promises) || promises.length === 0) {
      return resolve([]);
    }

    const results = new Array(promises.length);

    let completedPromises = 0;

    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];

      if (!(promise && typeof promise.then === 'function')) {
        results[i] = promise;
        completedPromises++;
        if (completedPromises === promise.length) {
          resolve(results);
        }
        continue;
      }

      promise.then(
        (value) => {
          results[i] = value;
          completedPromises++;
          if (completedPromises === promise.length) {
            resolve(results);
          }
        },
        (error) => {
          reject(error);
        }
      );
    }
  });
}

function createRandomNumberPromise(id) {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      let number = Math.floor(Math.random() * 20);
      console.log(`Number--> `, number);

      if (number < 10) {
        reject('Promise Rejected, Number is too low');
      } else {
        resolve('Promise is fulfilled');
      }
    }, 2000);
  });
}

const promise1 = createRandomNumberPromise(1);
const promise2 = createRandomNumberPromise(2);
const promise3 = createRandomNumberPromise(3);
const promise4 = createRandomNumberPromise(4);

const allPromises = MyPromiseAll([promise1, promise2, promise3, promise4]);

allPromises.then((results) => {
  console.log('All Promises resolved successfully');
  results.forEach((result) => console.log(result));
});

allPromises.catch(() => {
  console.log('At least one promise gt rejected--> ', err);
});

// Individual promise handling (for comparison)
promise1
  .then((result) => {
    console.log('Promise 1 resolved:', result);
  })
  .catch((error) => {
    console.log('Promise 1 rejected:', error);
  });

promise2
  .then((result) => {
    console.log('Promise 2 resolved:', result);
  })
  .catch((error) => {
    console.log('Promise 2 rejected:', error);
  });

promise3
  .then((result) => {
    console.log('Promise 3 resolved:', result);
  })
  .catch((error) => {
    console.log('Promise 3 rejected:', error);
  });
