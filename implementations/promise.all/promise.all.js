function MyPromise(executor) {
  let state = 'pending';
  let value;
  let handlers = [];

  function resolve(val) {
    if (state !== 'pending') return;
    state = 'fulfilled';
    value = val;
    handlers.forEach((h) => h());
  }

  function reject(val) {
    if (state !== 'pending') return;
    state = 'rejected';
    value = val;
    handlers.forEach((h) => h());
  }

  executor(resolve, reject);

  return {
    then(onFulfilled, onRejected) {
      function handle() {
        if (state === 'fulfilled' && onFulfilled) {
          onFulfilled(value);
        } else if (state === 'rejected' && onRejected) {
          onRejected(value);
        }
      }

      if (state === 'pending') {
        handlers.push(handle);
      } else {
        handle();
      }
    },
    catch(onRejected) {
      return this.then(null, onRejected);
    },
  };
}

// Our custom Promise.all implementation using MyPromise
function MyPromiseAll(promises) {
  // Return a new MyPromise
  return new MyPromise((resolve, reject) => {
    // Check if input is array
    if (!Array.isArray(promises)) {
      return resolve([]);
    }

    // If array is empty, resolve with empty array
    if (promises.length === 0) {
      return resolve([]);
    }

    // Array to store results
    const results = new Array(promises.length);

    // Counter to track completed promises
    let completedPromises = 0;

    // Process each promise in the array
    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];

      // Handle non-promise values
      if (!(promise && typeof promise.then === 'function')) {
        results[i] = promise;
        completedPromises++;
        if (completedPromises === promises.length) {
          resolve(results);
        }
        continue;
      }

      // Handle actual promises
      promise.then(
        (value) => {
          results[i] = value;
          completedPromises++;
          if (completedPromises === promises.length) {
            resolve(results);
          }
        },
        (error) => {
          // If any promise rejects, reject the entire MyPromiseAll
          reject(error);
        }
      );
    }
  });
}

// Create three promises using the random number pattern
function createRandomNumberPromise(id) {
  return new MyPromise((resolve, reject) => {
    setTimeout(() => {
      let number = Math.floor(Math.random() * 20); // 0–19
      console.log(`Promise ${id} - Generated number:`, number);

      if (number < 10) {
        reject(`Promise ${id} - Number too low: ${number}`);
      } else {
        resolve(`Promise ${id} - Number is acceptable: ${number}`);
      }
    }, 2000);
  });
}

// Create three promises
const promise1 = createRandomNumberPromise(1);
const promise2 = createRandomNumberPromise(2);
const promise3 = createRandomNumberPromise(3);

// Use our custom MyPromiseAll to wait for all promises
const allPromises = MyPromiseAll([promise1, promise2, promise3]);

allPromises.then((results) => {
  console.log('All promises resolved successfully:');
  results.forEach((result) => console.log(result));
});

allPromises.catch((error) => {
  console.log('At least one promise was rejected:', error);
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
