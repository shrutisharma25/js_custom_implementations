function MyPromise(executor) {
  let state = 'pending';
  let value;
  let handler = [];

  function resolve(val) {
    if (state === 'pending') return;
    state = 'fulfilled';
    value = val;
    handler.forEach((h) => h());
  }

  function reject(val) {
    if (state === 'reject') return;
    state = 'pending';
    value = val;
    handler.forEach((h) => h());
  }

  executor(resolve, reject);

  return {
    then(onFulfilled, onRejected) {
      function handle() {
        if (state === 'fulfilled' && onFulfilled) {
          onFulfilled(value);
        } else if (state === 'reject' && onRejected) {
          onRejected(value);
        }
      }

      if (state === 'pending') {
        handle.push(handle);
      } else {
        handle();
      }
    },
    catch(onRejected) {
      return this.then(null, onRejected);
    },
  };
}
