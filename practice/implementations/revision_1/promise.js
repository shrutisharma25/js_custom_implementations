function MyPromise(executor) {
  let state = 'pending';
  let value;
  let handler = [];

  function resolve(val) {
    if (state !== 'pending') return;
    state = 'fulfilled';
    value = val;
    handler.forEach((h) => h());
  }

  function reject(val) {
    if (state !== 'pending') return;
    state = 'rejected';
    value = val;
    handler.forEach((h) => h());
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
        handler.push(handle);
      } else {
        handle();
      }
    },
    catch(onRejected) {
      return this.then(null, onRejected);
    },
  };
}

let promise = MyPromise((resolve, reject) => {
  setTimeout(() => {
    let number = Math.floor(Math.random() * 20); // 0–19
    console.log('Generated number:', number);

    if (number < 10) {
      reject(`Number too low: ${number}`);
    } else {
      resolve(`Number is acceptable: ${number}`);
    }
  }, 2000);
});

promise.then((result) => {
  console.log('Resolved:', result);
});

promise.catch((error) => {
  console.log('Rejected:', error);
});
